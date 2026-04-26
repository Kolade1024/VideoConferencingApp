import { useEffect, useRef, useState } from "react";

export function useBBBAudio(
  sessionToken: string | undefined, 
  voiceBridge: string | undefined, 
  userId: string | undefined,
  userName: string | undefined,
  stream: MediaStream | null
) {
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const iceBufferRef = useRef<any[]>([]);

  useEffect(() => {
    if (!sessionToken || !stream || !voiceBridge || !userId) {
      // cleanup
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
      return;
    }

    let pc: RTCPeerConnection | null = null;
    let ws: WebSocket | null = null;
    let isComponentMounted = true;

    const connectAudio = async () => {
      setStatus("connecting");
      iceBufferRef.current = [];

      // 1. Initialize WebSocket
      const wsUrl = `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${sessionToken}`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 2. Initialize RTCPeerConnection
      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Handle incoming tracks (to hear others)
      pc.ontrack = (event) => {
        console.log("[BBB Audio] Received remote track:", event.track.kind);
        if (isComponentMounted) {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
          } else {
            const newStream = new MediaStream([event.track]);
            setRemoteStream(newStream);
          }
        }
      };

      // Add local stream tracks to PC
      stream.getTracks().forEach((track) => {
        console.log("[BBB Audio] Adding local track:", track.kind);
        if (pc) pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateMsg = {
            id: "onIceCandidate",
            type: "audio",
            role: "sendrecv",
            clientSessionNumber: 2,
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              usernameFragment: event.candidate.usernameFragment,
            },
            voiceBridge: voiceBridge,
          };

          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(candidateMsg));
          } else {
            iceBufferRef.current.push(candidateMsg);
          }
        }
      };

      ws.onopen = async () => {
        console.log("[BBB Audio WS] Connected, sending offer");
        try {
          if (!pc) return;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const sdpOfferMessage = {
            id: "start",
            type: "audio",
            role: "sendrecv",
            clientSessionNumber: 2,
            sdpOffer: offer.sdp,
            extension: voiceBridge,
            transparentListenOnly: false,
            voiceBridge: voiceBridge,
            userId: userId,
            userName: userName || userId,
          };

          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(sdpOfferMessage));
            
            // Flush buffered candidates
            if (iceBufferRef.current.length > 0) {
              console.log(`[BBB Audio WS] Flushing ${iceBufferRef.current.length} buffered ICE candidates`);
              iceBufferRef.current.forEach(msg => ws?.send(JSON.stringify(msg)));
              iceBufferRef.current = [];
            }
          }
        } catch (err) {
          console.error("[BBB Audio WS] Error creating offer:", err);
        }
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log("[BBB Audio WS] Message:", msg.id);

          if (msg.id === "startResponse") {
            if (msg.response === "accepted" && msg.sdpAnswer && pc) {
              console.log("[BBB Audio WS] Received startResponse accepted");
              await pc.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: msg.sdpAnswer,
                })
              );
            } else {
              console.error("[BBB Audio WS] startResponse not accepted:", msg);
            }
          } else if (msg.id === "webRTCAudioSuccess") {
            console.log("[BBB Audio WS] Received success:", msg.success);
            if (msg.success === "MEDIA_FLOWING" && isComponentMounted) {
              setStatus("connected");
            }
          } else if (msg.id === "iceCandidate") {
            if (pc && msg.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
          } else if (msg.id === "error") {
             console.error("[BBB Audio WS] SFU Error:", msg.message || msg);
          }
        } catch (err) {
          console.error("[BBB Audio WS] Error parsing message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("[BBB Audio WS] WebSocket Error:", err);
      };

      ws.onclose = () => {
        console.log("[BBB Audio WS] WebSocket Closed");
        if (isComponentMounted) {
          setStatus("disconnected");
        }
      };
    };

    connectAudio();

    return () => {
      isComponentMounted = false;
      if (pc) pc.close();
      if (ws) ws.close();
    };
  }, [sessionToken, voiceBridge, userId, userName, stream]);

  return { status, remoteStream };
}

