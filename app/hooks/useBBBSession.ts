"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BBBUser, BBBChatMessage, BBBGuestUser, BBBEnterResponse } from "../lib/bbb";

// ─── Pre-computed API query strings (using the checksums provided) ───
const CREATE_QUERY =
    "allowStartStopRecording=true&attendeePW=ap&autoStartRecording=false&meetingID=random-8186644&moderatorPW=mp&name=random-8186644&record=false&voiceBridge=71538&welcome=%3Cbr%3EWelcome+to+%3Cb%3E%25%25CONFNAME%25%25%3C%2Fb%3E%21&checksum=352f3fbfecd27bff52ef919954c43091fa25e230";

const JOIN_QUERY =
    "fullName=User+4771761&meetingID=random-8186644&password=mp&redirect=false&checksum=2c6a9ffa257b7e39ac1c8c86e309e866f17ee9fe";

// ─── Hook State ──────────────────────────────────────────────────────

interface BBBSessionState {
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
    sessionInfo: BBBEnterResponse | null;
    participants: BBBUser[];
    chatMessages: BBBChatMessage[];
    guestUsers: BBBGuestUser[];
    isRecording: boolean;
}

export function useBBBSession() {
    const [state, setState] = useState<BBBSessionState>({
        isLoading: true,
        isConnected: false,
        error: null,
        sessionInfo: null,
        participants: [],
        chatMessages: [],
        guestUsers: [],
        isRecording: false,
    });

    const socketRef = useRef<WebSocket | null>(null);
    const participantsRef = useRef<Map<string, BBBUser>>(new Map());
    const chatMessagesRef = useRef<Map<string, BBBChatMessage>>(new Map());
    const guestUsersRef = useRef<Map<string, BBBGuestUser>>(new Map());
    const methodIdCounterRef = useRef(100);
    const hasInitialized = useRef(false);

    const updateParticipants = useCallback(() => {
        setState((prev) => ({
            ...prev,
            participants: Array.from(participantsRef.current.values()),
        }));
    }, []);

    const updateChatMessages = useCallback(() => {
        setState((prev) => ({
            ...prev,
            chatMessages: Array.from(chatMessagesRef.current.values()).sort(
                (a, b) => a.timestamp - b.timestamp
            ),
        }));
    }, []);

    const updateGuestUsers = useCallback(() => {
        setState((prev) => ({
            ...prev,
            guestUsers: Array.from(guestUsersRef.current.values()),
        }));
    }, []);

    // Send a DDP method call over the WebSocket
    const sendDDPMethod = useCallback((method: string, params: any[]) => {
        const ws = socketRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            const id = String(methodIdCounterRef.current++);
            ws.send(
                JSON.stringify([
                    JSON.stringify({
                        msg: "method",
                        id,
                        method,
                        params,
                    }),
                ])
            );
            console.log(`[BBB DDP] Sent method '${method}' with id ${id}`);
            return id;
        }
        console.warn("[BBB DDP] Cannot send method, WebSocket not open");
        return null;
    }, []);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        let socket: WebSocket | null = null;

        const initSession = async () => {
            try {
                // Step 1: Create the room
                console.log("[BBB] Creating room...");
                const createRes = await fetch("/api/bbb/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ queryString: CREATE_QUERY }),
                });
                const createData = await createRes.json();
                if (createData.error) {
                    // Room might already exist, proceed anyway
                    console.warn("[BBB] Create warning:", createData.error);
                } else {
                    console.log("[BBB] Room created:", createData.meetingID);
                }

                // Step 2: Join the room
                console.log("[BBB] Joining room...");
                const joinRes = await fetch("/api/bbb/join", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ queryString: JOIN_QUERY }),
                });
                const joinData = await joinRes.json();
                if (joinData.error) {
                    throw new Error(`Join failed: ${joinData.error}`);
                }
                console.log("[BBB] Joined, session_token:", joinData.session_token);

                // Step 3: Enter the room to get full session config
                console.log("[BBB] Entering room...");
                const enterRes = await fetch(
                    `/api/bbb/enter?sessionToken=${joinData.session_token}`
                );
                const sessionInfo: BBBEnterResponse = await enterRes.json();
                if (sessionInfo.returncode !== "SUCCESS") {
                    throw new Error(`Enter failed: ${JSON.stringify(sessionInfo)}`);
                }
                console.log("[BBB] Session info:", sessionInfo);

                setState((prev) => ({
                    ...prev,
                    sessionInfo,
                    isLoading: false,
                }));

                // Step 4: Connect WebSocket with dynamic credentials
                connectWebSocket(sessionInfo);
            } catch (err: any) {
                console.error("[BBB] Session init error:", err);
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: err.message || "Failed to initialize BBB session",
                }));
            }
        };

        const connectWebSocket = (sessionInfo: BBBEnterResponse) => {
            const sessionId = Math.random().toString(36).substring(2, 10);
            socket = new WebSocket(
                `wss://meet.konn3ct.ng/html5client/sockjs/914/${sessionId}/websocket`
            );
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("[BBB WS] Connected, sending DDP connect...");
                socket!.send(
                    JSON.stringify([
                        JSON.stringify({
                            msg: "connect",
                            version: "1",
                            support: ["1", "pre2", "pre1"],
                        }),
                    ])
                );
            };

            socket.onmessage = (event) => {
                const data = event.data;

                if (typeof data !== "string") return;

                // SockJS open frame
                if (data === "o") {
                    console.log("[BBB WS] SockJS open");
                    socket!.send(
                        JSON.stringify([
                            JSON.stringify({
                                msg: "connect",
                                version: "1",
                                support: ["1", "pre2", "pre1"],
                            }),
                        ])
                    );
                    return;
                }

                // Heartbeat
                if (data === "h") return;

                // Array of DDP messages
                if (data.startsWith("a")) {
                    try {
                        const messages = JSON.parse(data.substring(1));
                        for (const msgStr of messages) {
                            const message = JSON.parse(msgStr);
                            handleDDPMessage(message, sessionInfo, socket!);
                        }
                    } catch (e) {
                        console.error("[BBB WS] Parse error:", e);
                    }
                }
            };

            socket.onerror = (error) => {
                console.error("[BBB WS] Error:", error);
                setState((prev) => ({ ...prev, error: "WebSocket connection error" }));
            };

            socket.onclose = (event) => {
                console.log("[BBB WS] Closed:", event.code, event.reason);
                setState((prev) => ({ ...prev, isConnected: false }));
            };
        };

        const handleDDPMessage = (
            message: any,
            sessionInfo: BBBEnterResponse,
            ws: WebSocket
        ) => {
            if (message.msg === "connected") {
                console.log("[BBB DDP] Connected, session:", message.session);
                setState((prev) => ({ ...prev, isConnected: true }));

                // Send user settings
                ws.send(
                    JSON.stringify([
                        JSON.stringify({
                            msg: "method",
                            id: "1",
                            method: "userChangedLocalSettings",
                            params: [
                                {
                                    application: {
                                        animations: true,
                                        chatAudioAlerts: false,
                                    },
                                    audio: {
                                        inputDeviceId: "undefined",
                                        outputDeviceId: "undefined",
                                    },
                                    dataSaving: {
                                        viewParticipantsWebcams: true,
                                        viewScreenshare: true,
                                    },
                                },
                            ],
                        }),
                    ])
                );

                // Validate auth token with DYNAMIC credentials from /enter
                ws.send(
                    JSON.stringify([
                        JSON.stringify({
                            msg: "method",
                            id: "2",
                            method: "validateAuthToken",
                            params: [
                                sessionInfo.meetingID,
                                sessionInfo.internalUserID,
                                sessionInfo.authToken,
                                sessionInfo.externUserID,
                            ],
                        }),
                    ])
                );

                // Subscribe to all collections
                const subscriptions = [
                    { id: "sub-autoupdate", name: "meteor_autoupdate_clientVersions", params: [] },
                    { id: "sub-current-user", name: "current-user", params: [] },
                    { id: "sub-users", name: "users", params: [] },
                    { id: "sub-meetings", name: "meetings", params: [] },
                    { id: "sub-polls", name: "polls", params: [] },
                    { id: "sub-presentations", name: "presentations", params: [] },
                    { id: "sub-slides", name: "slides", params: [] },
                    { id: "sub-slide-positions", name: "slide-positions", params: [] },
                    { id: "sub-captions", name: "captions", params: [] },
                    { id: "sub-voiceUsers", name: "voiceUsers", params: [] },
                    { id: "sub-whiteboard", name: "whiteboard-multi-user", params: [] },
                    { id: "sub-screenshare", name: "screenshare", params: [] },
                    { id: "sub-group-chat", name: "group-chat", params: [] },
                    { id: "sub-group-chat-msg", name: "group-chat-msg", params: ["MAIN-PUBLIC-GROUP-CHAT"] },
                    { id: "sub-pres-pods", name: "presentation-pods", params: [] },
                    { id: "sub-users-settings", name: "users-settings", params: [] },
                    { id: "sub-guestUser", name: "guestUser", params: [] },
                    { id: "sub-users-infos", name: "users-infos", params: [] },
                    { id: "sub-time-remaining", name: "meeting-time-remaining", params: [] },
                    { id: "sub-local-settings", name: "local-settings", params: [] },
                    { id: "sub-users-typing", name: "users-typing", params: [] },
                    { id: "sub-record-meetings", name: "record-meetings", params: [] },
                    { id: "sub-video-streams", name: "video-streams", params: [] },
                    { id: "sub-conn-status", name: "connection-status", params: [] },
                    { id: "sub-voice-call", name: "voice-call-states", params: [] },
                    { id: "sub-ext-video", name: "external-video-meetings", params: [] },
                    { id: "sub-annotations", name: "annotations", params: [] },
                    // Moderator subscriptions
                    { id: "sub-meetings-mod", name: "meetings", params: ["MODERATOR"] },
                    { id: "sub-users-mod", name: "users", params: ["MODERATOR"] },
                    { id: "sub-breakouts-mod", name: "breakouts", params: ["MODERATOR"] },
                    { id: "sub-guest-mod", name: "guestUser", params: ["MODERATOR"] },
                ];

                for (const sub of subscriptions) {
                    ws.send(
                        JSON.stringify([
                            JSON.stringify({
                                msg: "sub",
                                id: sub.id,
                                name: sub.name,
                                params: sub.params,
                            }),
                        ])
                    );
                }

                // Fetch chat messages
                ws.send(
                    JSON.stringify([
                        JSON.stringify({
                            msg: "method",
                            id: "11",
                            method: "fetchMessagePerPage",
                            params: ["MAIN-PUBLIC-GROUP-CHAT", 1],
                        }),
                    ])
                );

                return;
            }

            if (message.msg === "ready") {
                console.log("[BBB DDP] Subscription ready:", message.subs);
                return;
            }

            if (message.msg === "result") {
                console.log("[BBB DDP] Method result:", message.id, message.result || message.error);
                return;
            }

            // ─── Handle collection changes ────────────────────────────

            if (message.msg === "added") {
                handleDocumentAdded(message);
            }

            if (message.msg === "changed") {
                handleDocumentChanged(message);
            }

            if (message.msg === "removed") {
                handleDocumentRemoved(message);
            }
        };

        const handleDocumentAdded = (message: any) => {
            const { collection, id, fields } = message;

            if (collection === "users" && fields) {
                const user: BBBUser = {
                    odId: id,
                    odUserId: fields.userId || fields.intId || id,
                    meetingId: fields.meetingId || "",
                    name: fields.name || "Unknown",
                    role: fields.role || "VIEWER",
                    avatar: fields.avatar || "",
                    color: fields.color || "#64748b",
                    emoji: fields.emoji || "none",
                    away: fields.away || false,
                    raiseHand: fields.raiseHand || false,
                    presenter: fields.presenter || false,
                    locked: fields.locked || false,
                    guest: fields.guest || false,
                    mobile: fields.mobile || false,
                    extId: fields.extId || "",
                    muted: true, // Default to muted
                    talking: false,
                };
                participantsRef.current.set(id, user);
                updateParticipants();
                console.log("[BBB] User added:", user.name);
            }

            if (collection === "voiceUsers" && fields) {
                // Link voiceUser to participant
                const intId = fields.intId || fields.userId || id;
                // Find participant by odUserId (which is often the intId)
                const participantEntry = Array.from(participantsRef.current.entries()).find(
                    ([_, p]) => p.odUserId === intId
                );

                if (participantEntry) {
                    const [pId, p] = participantEntry;
                    const updated = {
                        ...p,
                        muted: fields.muted ?? p.muted,
                        talking: fields.talking ?? p.talking,
                    };
                    participantsRef.current.set(pId, updated);
                    updateParticipants();
                    console.log("[BBB] Voice user joined/updated:", p.name, "Muted:", updated.muted);
                }
            }

            if (collection === "group-chat-msg" && fields) {
                const msg: BBBChatMessage = {
                    id,
                    chatId: fields.chatId || "",
                    correlationId: fields.correlationId || "",
                    sender: typeof fields.sender === "string" ? fields.sender : (fields.sender || { id: "", name: "Unknown", role: "VIEWER" }),
                    senderName: fields.senderName || undefined,
                    senderRole: fields.senderRole || undefined,
                    message: fields.message || "",
                    timestamp: fields.timestamp || Date.now(),
                };
                chatMessagesRef.current.set(id, msg);
                updateChatMessages();
                console.log("[BBB] Chat message added:", msg.message, "Sender:", msg.sender, "SenderName:", fields.senderName);
            }

            if (collection === "record-meetings" && fields) {
                setState((prev) => ({
                    ...prev,
                    isRecording: fields.recording === true,
                }));
                console.log("[BBB] Recording status added:", fields.recording);
            }

            if (collection === "guestUser" && fields) {
                const guest: BBBGuestUser = {
                    odId: id,
                    odUserId: fields.odUserId || fields.intId || id,
                    meetingId: fields.meetingId || "",
                    name: fields.name || "Guest",
                    role: fields.role || "VIEWER",
                    avatar: fields.avatar || "",
                    color: fields.color || "#64748b",
                    guest: true,
                    guestStatus: fields.guestStatus || "WAIT",
                    loginTime: fields.loginTime || Date.now(),
                };
                guestUsersRef.current.set(id, guest);
                updateGuestUsers();
                console.log("[BBB] Guest user added:", guest.name, "status:", guest.guestStatus);
            }
        };

        const handleDocumentChanged = (message: any) => {
            const { collection, id, fields } = message;

            if (collection === "users" && fields) {
                const existing = participantsRef.current.get(id);
                if (existing) {
                    const updated: BBBUser = { ...existing };
                    if (fields.name !== undefined) updated.name = fields.name;
                    if (fields.role !== undefined) updated.role = fields.role;
                    if (fields.avatar !== undefined) updated.avatar = fields.avatar;
                    if (fields.color !== undefined) updated.color = fields.color;
                    if (fields.emoji !== undefined) {
                        updated.emoji = fields.emoji;
                        updated.raiseHand = fields.emoji === "raiseHand";
                    }
                    if (fields.away !== undefined) updated.away = fields.away;
                    if (fields.raiseHand !== undefined) updated.raiseHand = fields.raiseHand;
                    if (fields.presenter !== undefined) updated.presenter = fields.presenter;
                    if (fields.locked !== undefined) updated.locked = fields.locked;
                    if (fields.guest !== undefined) updated.guest = fields.guest;
                    if (fields.mobile !== undefined) updated.mobile = fields.mobile;
                    participantsRef.current.set(id, updated);
                    updateParticipants();
                    console.log("[BBB] User changed:", updated.name, fields);
                }
            }

            if (collection === "voiceUsers" && fields) {
                // BBB voiceUsers 'changed' — find the participant by matching IDs
                // Try the document id directly, or split on '-' as a fallback
                const pEntry = Array.from(participantsRef.current.entries()).find(
                    ([_, p]) => p.odUserId === id || p.odUserId === id.split('-')[0]
                );

                if (pEntry) {
                    const [pId, p] = pEntry;
                    const updated = {
                        ...p,
                        muted: fields.muted !== undefined ? fields.muted : p.muted,
                        talking: fields.talking !== undefined ? fields.talking : p.talking,
                    };
                    participantsRef.current.set(pId, updated);
                    updateParticipants();
                    console.log("[BBB] Voice user changed:", p.name, fields);
                }
            }

            if (collection === "group-chat-msg" && fields) {
                const existing = chatMessagesRef.current.get(id);
                if (existing) {
                    chatMessagesRef.current.set(id, { ...existing, ...fields });
                    updateChatMessages();
                }
            }

            if (collection === "guestUser" && fields) {
                const existing = guestUsersRef.current.get(id);
                if (existing) {
                    const updated = { ...existing, ...fields };
                    guestUsersRef.current.set(id, updated);
                    updateGuestUsers();
                    console.log("[BBB] Guest user changed:", updated.name, fields);
                }
            }

            if (collection === "record-meetings" && fields) {
                if (fields.recording !== undefined) {
                    setState((prev) => ({
                        ...prev,
                        isRecording: fields.recording === true,
                    }));
                    console.log("[BBB] Recording status changed:", fields.recording);
                }
            }
        };

        const handleDocumentRemoved = (message: any) => {
            const { collection, id } = message;

            if (collection === "users") {
                const removed = participantsRef.current.get(id);
                participantsRef.current.delete(id);
                updateParticipants();
                if (removed) {
                    console.log("[BBB] User removed:", removed.name);
                }
            }

            if (collection === "voiceUsers") {
                // Find user and set muted/talking to false/true(default)
                const pEntry = Array.from(participantsRef.current.entries()).find(
                    ([_, p]) => p.odUserId === id
                );
                if (pEntry) {
                    const [pId, p] = pEntry;
                    participantsRef.current.set(pId, { ...p, muted: true, talking: false });
                    updateParticipants();
                }
            }

            if (collection === "group-chat-msg") {
                chatMessagesRef.current.delete(id);
                updateChatMessages();
            }

            if (collection === "guestUser") {
                const removed = guestUsersRef.current.get(id);
                guestUsersRef.current.delete(id);
                updateGuestUsers();
                if (removed) {
                    console.log("[BBB] Guest user removed:", removed.name);
                }
            }
        };


        initSession();

        // Cleanup
        return () => {
            if (socket) {
                if (
                    socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING
                ) {
                    socket.close();
                }
            }
        };
    }, [updateParticipants, updateChatMessages, updateGuestUsers]);

    return {
        isLoading: state.isLoading,
        isConnected: state.isConnected,
        error: state.error,
        sessionInfo: state.sessionInfo,
        participants: state.participants,
        chatMessages: state.chatMessages,
        guestUsers: state.guestUsers,
        isRecording: state.isRecording,
        sendDDPMethod,
    };
}
