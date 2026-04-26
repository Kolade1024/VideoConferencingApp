import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useBBBAudio — connects to the BBB WebRTC SFU for full-duplex audio.
 *
 * ARCHITECTURE:
 * - The hook establishes a SINGLE persistent WebRTC connection when the user
 *   first joins the audio bridge.
 * - Mute/unmute is handled by enabling/disabling the audio track on the
 *   existing peer connection, NOT by tearing down and recreating everything.
 * - The `callerIdNum` (voiceBridge extension) tells the SFU which FreeSWITCH
 *   conference to bridge the audio into.
 */
export function useBBBAudio(
  sessionToken: string | undefined,
  voiceBridge: string | undefined,
  userId: string | undefined,
  userName: string | undefined
) {
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const iceBufferRef = useRef<any[]>([]);
  const isConnectingRef = useRef(false);

  // ── Connect to the audio bridge ────────────────────────────────────
  const connect = useCallback(async () => {
    if (!sessionToken || !voiceBridge || !userId) return;
    if (isConnectingRef.current) return;
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.connectionState !== "closed"
    )
      return;

    isConnectingRef.current = true;
    setStatus("connecting");
    iceBufferRef.current = [];

    try {
      // 1. Get microphone
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = micStream;
      setLocalStream(micStream);

      // Start muted
      micStream.getAudioTracks().forEach((t) => (t.enabled = false));
      setIsMuted(true);

      // 2. Create WebSocket to BBB SFU
      const wsUrl = `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${sessionToken}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 3. Create PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });
      peerConnectionRef.current = pc;

      // Add local tracks
      micStream.getTracks().forEach((track) => {
        console.log("[BBB Audio] Adding local track:", track.kind, track.id);
        pc.addTrack(track, micStream);
      });

      // Handle remote tracks (audio from other participants)
      pc.ontrack = (event) => {
        console.log(
          "[BBB Audio] Received remote track:",
          event.track.kind,
          event.track.id
        );
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        } else {
          const rs = new MediaStream([event.track]);
          setRemoteStream(rs);
        }
      };

      // Buffer ICE candidates until WS is open
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const candidateMsg = {
          id: "onIceCandidate",
          type: "audio",
          role: "sendrecv",
          clientSessionNumber: 2,
          voiceBridge,
          candidate: {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment,
          },
        };
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(candidateMsg));
        } else {
          iceBufferRef.current.push(candidateMsg);
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("[BBB Audio] ICE state:", pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log("[BBB Audio] Connection state:", pc.connectionState);
      };

      // 4. WebSocket handlers
      ws.onopen = async () => {
        console.log("[BBB Audio WS] Open — creating offer");
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const startMsg = {
            id: "start",
            type: "audio",
            role: "sendrecv",
            clientSessionNumber: 2,
            sdpOffer: offer.sdp,
            extension: voiceBridge,
            voiceBridge,
            transparentListenOnly: false,
            userId,
            userName: userName || userId,
            callerIdNum: voiceBridge,
          };
          ws.send(JSON.stringify(startMsg));
          console.log("[BBB Audio WS] Sent start message");

          // Flush any buffered ICE candidates
          if (iceBufferRef.current.length > 0) {
            console.log(
              `[BBB Audio WS] Flushing ${iceBufferRef.current.length} ICE candidates`
            );
            for (const msg of iceBufferRef.current) {
              ws.send(JSON.stringify(msg));
            }
            iceBufferRef.current = [];
          }
        } catch (err) {
          console.error("[BBB Audio WS] Offer error:", err);
        }
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log("[BBB Audio WS] ←", msg.id, msg.response || msg.success || "");

          switch (msg.id) {
            case "startResponse":
              if (msg.response === "accepted" && msg.sdpAnswer) {
                await pc.setRemoteDescription(
                  new RTCSessionDescription({
                    type: "answer",
                    sdp: msg.sdpAnswer,
                  })
                );
                console.log("[BBB Audio] Remote description set");
              } else {
                console.error("[BBB Audio WS] Start rejected:", msg);
              }
              break;

            case "webRTCAudioSuccess":
              if (msg.success === "MEDIA_FLOWING") {
                setStatus("connected");
                console.log("[BBB Audio] ✓ MEDIA_FLOWING — audio bridge active");
              }
              break;

            case "iceCandidate":
              if (msg.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
              }
              break;

            case "error":
              console.error("[BBB Audio WS] SFU error:", msg);
              break;

            default:
              console.log("[BBB Audio WS] Unhandled:", msg.id);
          }
        } catch (err) {
          console.error("[BBB Audio WS] Message error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("[BBB Audio WS] Error:", err);
      };

      ws.onclose = (e) => {
        console.log("[BBB Audio WS] Closed:", e.code, e.reason);
        setStatus("disconnected");
      };
    } catch (err) {
      console.error("[BBB Audio] Connect error:", err);
      setStatus("disconnected");
    } finally {
      isConnectingRef.current = false;
    }
  }, [sessionToken, voiceBridge, userId, userName]);

  // ── Disconnect from audio bridge ───────────────────────────────────
  const disconnect = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("disconnected");
    setRemoteStream(null);
    setIsMuted(true);
  }, []);

  // ── Toggle mute (enable/disable track — no reconnect) ─────────────
  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    const newEnabled = !audioTrack.enabled;
    audioTrack.enabled = newEnabled;
    setIsMuted(!newEnabled);
    console.log("[BBB Audio] Mute toggled:", !newEnabled ? "MUTED" : "UNMUTED");
  }, []);

  // ── Auto-connect when session info becomes available ───────────────
  useEffect(() => {
    if (sessionToken && voiceBridge && userId && status === "disconnected" && !isConnectingRef.current) {
      connect();
    }
  }, [sessionToken, voiceBridge, userId, status, connect]);

  // ── Cleanup on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { status, remoteStream, localStream, isMuted, connect, disconnect, toggleMute };
}
