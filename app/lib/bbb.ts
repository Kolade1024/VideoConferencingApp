// BigBlueButton API service layer
// Handles create, join, and enter API calls against the BBB server

export const BBB_BASE_URL = "https://meet.konn3ct.ng/bigbluebutton/api";

// ─── Types ───────────────────────────────────────────────────────────

export interface BBBCreateParams {
    meetingID: string;
    name: string;
    attendeePW?: string;
    moderatorPW?: string;
    welcome?: string;
    record?: boolean;
    allowStartStopRecording?: boolean;
    autoStartRecording?: boolean;
    voiceBridge?: number;
    checksum: string;
}

export interface BBBCreateResponse {
    returncode: string;
    meetingID: string;
    internalMeetingID: string;
    attendeePW: string;
    moderatorPW: string;
    createTime: string;
    voiceBridge: string;
    hasUserJoined: boolean;
}

export interface BBBJoinParams {
    fullName: string;
    meetingID: string;
    password: string;
    redirect?: boolean;
    checksum: string;
}

export interface BBBJoinResponse {
    returncode: string;
    messageKey: string;
    message: string;
    meeting_id: string;
    user_id: string;
    auth_token: string;
    session_token: string;
    guestStatus: string;
    url: string;
}

export interface BBBEnterResponse {
    returncode: string;
    fullname: string;
    confname: string;
    meetingID: string;
    externMeetingID: string;
    externUserID: string;
    internalUserID: string;
    authToken: string;
    role: string;
    guest: boolean;
    guestStatus: string;
    conference: string;
    room: string;
    voicebridge: string;
    welcome: string;
    logoutUrl: string;
    defaultLayout: string;
    avatarURL: string;
    record: string;
    allowStartStopRecording: boolean;
    muteOnStart: boolean;
    sessionToken: string;
}

// ─── BBB User from DDP ──────────────────────────────────────────────

export interface BBBUser {
    odId: string; // DDP document ID
    odUserId: string; // BBB userId (e.g. w_xyz)
    meetingId: string;
    name: string;
    role: string; // "MODERATOR" | "VIEWER"
    avatar: string;
    color: string;
    emoji: string;
    away: boolean;
    raiseHand: boolean;
    presenter: boolean;
    locked: boolean;
    guest: boolean;
    mobile: boolean;
    extId: string;
}

// ─── BBB Chat Message from DDP ──────────────────────────────────────

export interface BBBChatMessage {
    id: string;
    chatId: string;
    correlationId: string;
    sender: {
        id: string;
        name: string;
        role: string;
    } | string;
    senderName?: string;
    senderRole?: string;
    message: string;
    timestamp: number;
}

// ─── BBB Guest User from DDP ────────────────────────────────────────

export interface BBBGuestUser {
    odId: string; // DDP document ID
    odUserId: string; // BBB userId
    meetingId: string;
    name: string;
    role: string;
    avatar: string;
    color: string;
    guest: boolean;
    guestStatus: string; // "WAIT" | "ALLOW" | "DENY"
    loginTime: number;
}

// ─── XML Parser helper ──────────────────────────────────────────────

function parseXMLValue(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
}

// ─── API Functions ──────────────────────────────────────────────────

/**
 * Create a BBB meeting room.
 * Pass the full query string including checksum.
 */
export async function createRoom(queryString: string): Promise<BBBCreateResponse> {
    const url = `${BBB_BASE_URL}/create?${queryString}`;
    const res = await fetch(url);
    const xml = await res.text();

    const returncode = parseXMLValue(xml, "returncode");
    if (returncode !== "SUCCESS") {
        throw new Error(`BBB create failed: ${parseXMLValue(xml, "message") || xml}`);
    }

    return {
        returncode,
        meetingID: parseXMLValue(xml, "meetingID"),
        internalMeetingID: parseXMLValue(xml, "internalMeetingID"),
        attendeePW: parseXMLValue(xml, "attendeePW"),
        moderatorPW: parseXMLValue(xml, "moderatorPW"),
        createTime: parseXMLValue(xml, "createTime"),
        voiceBridge: parseXMLValue(xml, "voiceBridge"),
        hasUserJoined: parseXMLValue(xml, "hasUserJoined") === "true",
    };
}

/**
 * Join a BBB meeting room (redirect=false to get session_token).
 * Pass the full query string including checksum.
 */
export async function joinRoom(queryString: string): Promise<BBBJoinResponse> {
    const url = `${BBB_BASE_URL}/join?${queryString}`;
    const res = await fetch(url);
    const xml = await res.text();

    const returncode = parseXMLValue(xml, "returncode");
    if (returncode !== "SUCCESS") {
        throw new Error(`BBB join failed: ${parseXMLValue(xml, "message") || xml}`);
    }

    return {
        returncode,
        messageKey: parseXMLValue(xml, "messageKey"),
        message: parseXMLValue(xml, "message"),
        meeting_id: parseXMLValue(xml, "meeting_id"),
        user_id: parseXMLValue(xml, "user_id"),
        auth_token: parseXMLValue(xml, "auth_token"),
        session_token: parseXMLValue(xml, "session_token"),
        guestStatus: parseXMLValue(xml, "guestStatus"),
        url: parseXMLValue(xml, "url"),
    };
}

/**
 * Enter a BBB meeting (get full session config).
 */
export async function enterRoom(sessionToken: string): Promise<BBBEnterResponse> {
    const url = `${BBB_BASE_URL}/enter?sessionToken=${sessionToken}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.response?.returncode !== "SUCCESS") {
        throw new Error(`BBB enter failed: ${JSON.stringify(json)}`);
    }

    const r = json.response;
    return {
        returncode: r.returncode,
        fullname: r.fullname,
        confname: r.confname,
        meetingID: r.meetingID,
        externMeetingID: r.externMeetingID,
        externUserID: r.externUserID,
        internalUserID: r.internalUserID,
        authToken: r.authToken,
        role: r.role,
        guest: r.guest,
        guestStatus: r.guestStatus,
        conference: r.conference,
        room: r.room,
        voicebridge: r.voicebridge,
        welcome: r.welcome,
        logoutUrl: r.logoutUrl,
        defaultLayout: r.defaultLayout,
        avatarURL: r.avatarURL,
        record: r.record,
        allowStartStopRecording: r.allowStartStopRecording,
        muteOnStart: r.muteOnStart,
        sessionToken,
    };
}
