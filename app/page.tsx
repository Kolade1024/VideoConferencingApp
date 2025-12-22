"use client";

import { useState, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, JSX } from "react";
import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
  ShareScreenIcon,
  RecordIcon,
  ChatIcon,
  HandIcon,
  MoreIcon,
  PhoneIcon,
  LinkIcon,
  SendIcon,
  PlusIcon,
  ChevronUpIcon,
  AlertIcon,
  ChevronDownIcon,
  LogOutIcon,
  StopCircleIcon,
  MaximizeIcon,
  UploadIcon,
  LayoutIcon,
  MicOffAllIcon,
  PollIcon,
  VideoLinkIcon,
  UsersIcon,
  ShareIcon,
  SettingsIcon,
} from "./components/icons";
import {
  Avatar,
  IconButton,
  Tabs,
  ParticipantCard,
  ParticipantListItem,
  ChatMessage,
  ParticipantMenu,
} from "./components/ui";

function UndoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 14 4 9 9 4"></polyline>
      <path d="M20 20v-3a9 9 0 0 0-9-9H4"></path>
    </svg>
  );
}

function RedoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 14 20 9 15 4"></polyline>
      <path d="M4 20v-3a9 9 0 0 1 9-9h7"></path>
    </svg>
  );
}

function PointerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 3l12 6-5 2 2 9-3.5-2-2.5 5-1.5-.7 2.5-5L4 3z" />
    </svg>
  );
}

function PenToolIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ShapeToolIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" />
      <circle cx="17" cy="7" r="3" />
      <path d="M4 21h16l-8-10z" />
    </svg>
  );
}

function StickyNoteIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v6h6" />
    </svg>
  );
}

function ImageToolIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-3.5-3.5a2 2 0 0 0-3 0L9 18" />
    </svg>
  );
}

function ColorDropperIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 3a2.82 2.82 0 0 0-4 0l-1 1 4 4 1-1a2.82 2.82 0 0 0 0-4Z" />
      <path d="M15 7L5 17v4h4l10-10" />
    </svg>
  );
}

function EraserIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 20H10l-7.29-7.29a1 1 0 0 1 0-1.42L9.3 4.71a1 1 0 0 1 1.4 0L21 15v2a3 3 0 0 1-3 3Z" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

type WhiteboardPoint = { x: number; y: number };

type WhiteboardPathElement = {
  id: string;
  type: "path";
  points: WhiteboardPoint[];
  color: string;
  strokeWidth: number;
};

type WhiteboardStickyElement = {
  id: string;
  type: "sticky";
  x: number;
  y: number;
  text: string;
  color: string;
};

type WhiteboardTextElement = {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
};

type WhiteboardShapeElement = {
  id: string;
  type: "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type WhiteboardImageElement = {
  id: string;
  type: "image";
  x: number;
  y: number;
  url: string;
  width: number;
  height: number;
};

type WhiteboardElement =
  | WhiteboardPathElement
  | WhiteboardStickyElement
  | WhiteboardTextElement
  | WhiteboardShapeElement
  | WhiteboardImageElement;

type WhiteboardTool =
  | "pointer"
  | "pen"
  | "text"
  | "sticky"
  | "shapes"
  | "image"
  | "eraser";

const WHITEBOARD_COLORS = [
  "#2563eb",
  "#facc15",
  "#f97316",
  "#ef4444",
  "#22c55e",
  "#a855f7",
  "#0ea5e9",
  "#64748b",
];
const WHITEBOARD_WIDTH = 1600;
const WHITEBOARD_HEIGHT = 900;
const STICKY_NOTE_SIZE = 180;
const TEXT_ELEMENT_WIDTH = 220;
const TEXT_ELEMENT_MIN_HEIGHT = 80;
const TEXT_ELEMENT_ERASE_EXTRA = 120;
const ERASER_HIT_RADIUS = 18;

const generateId = () => Math.random().toString(36).slice(2, 10);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const distanceBetweenPoints = (a: WhiteboardPoint, b: WhiteboardPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const distancePointToSegment = (
  point: WhiteboardPoint,
  start: WhiteboardPoint,
  end: WhiteboardPoint
) => {
  if (start.x === end.x && start.y === end.y) {
    return distanceBetweenPoints(point, start);
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) {
    return distanceBetweenPoints(point, start);
  }

  const t = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
    0,
    1
  );
  const projectionX = start.x + t * dx;
  const projectionY = start.y + t * dy;
  return Math.hypot(point.x - projectionX, point.y - projectionY);
};

const isPointInsideRect = (
  point: WhiteboardPoint,
  rect: { x: number; y: number; width: number; height: number }
) => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

const doesPointHitElement = (
  element: WhiteboardElement,
  point: WhiteboardPoint
) => {
  if (element.type === "path") {
    const threshold = Math.max(element.strokeWidth * 0.75, ERASER_HIT_RADIUS);
    if (element.points.length === 1) {
      return distanceBetweenPoints(element.points[0], point) <= threshold;
    }
    for (let index = 1; index < element.points.length; index += 1) {
      const start = element.points[index - 1];
      const end = element.points[index];
      if (distancePointToSegment(point, start, end) <= threshold) {
        return true;
      }
    }
    return false;
  }

  if (element.type === "shape") {
    const rect = {
      x: element.x - ERASER_HIT_RADIUS,
      y: element.y - ERASER_HIT_RADIUS,
      width: Math.max(element.width, 0) + ERASER_HIT_RADIUS * 2,
      height: Math.max(element.height, 0) + ERASER_HIT_RADIUS * 2,
    };
    return isPointInsideRect(point, rect);
  }

  if (element.type === "sticky") {
    const rect = {
      x: element.x - ERASER_HIT_RADIUS,
      y: element.y - ERASER_HIT_RADIUS,
      width: STICKY_NOTE_SIZE + ERASER_HIT_RADIUS * 2,
      height: STICKY_NOTE_SIZE + ERASER_HIT_RADIUS * 2,
    };
    return isPointInsideRect(point, rect);
  }

  if (element.type === "text") {
    const estimatedHeight = TEXT_ELEMENT_MIN_HEIGHT + TEXT_ELEMENT_ERASE_EXTRA;
    const rect = {
      x: element.x - ERASER_HIT_RADIUS,
      y: element.y - ERASER_HIT_RADIUS,
      width: TEXT_ELEMENT_WIDTH + ERASER_HIT_RADIUS * 2,
      height: estimatedHeight + ERASER_HIT_RADIUS * 2,
    };
    return isPointInsideRect(point, rect);
  }

  if (element.type === "image") {
    const rect = {
      x: element.x - ERASER_HIT_RADIUS,
      y: element.y - ERASER_HIT_RADIUS,
      width: element.width + ERASER_HIT_RADIUS * 2,
      height: element.height + ERASER_HIT_RADIUS * 2,
    };
    return isPointInsideRect(point, rect);
  }

  return false;
};

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Home() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEndRecordingDialog, setShowEndRecordingDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const [chatTab, setChatTab] = useState("Group");

  // Participant menu states
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState("Broadcaster");

  // End call states
  const [showEndCallMenu, setShowEndCallMenu] = useState(false);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);
  const [hasLeftSession, setHasLeftSession] = useState(false);

  // Screen share states
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showScreenShareDialog, setShowScreenShareDialog] = useState(false);
  const [selectedScreenTab, setSelectedScreenTab] = useState("Entire screen");
  const [selectedScreen, setSelectedScreen] = useState<number | null>(null);

  // More menu state
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // External video states
  const [showExternalVideoDialog, setShowExternalVideoDialog] = useState(false);
  const [externalVideoUrl, setExternalVideoUrl] = useState("");
  const [isPlayingExternalVideo, setIsPlayingExternalVideo] = useState(false);
  const [activeExternalVideoUrl, setActiveExternalVideoUrl] = useState("");
  const [showEndVideoDialog, setShowEndVideoDialog] = useState(false);

  // Settings states
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settingsTab, setSettingsTab] = useState("Device Settings");
  const [selectedCamera, setSelectedCamera] = useState("HD Camera");
  const [selectedVideoQuality, setSelectedVideoQuality] =
    useState("High Definition");
  const [selectedMicrophone, setSelectedMicrophone] = useState(
    "Default - Intel HP Mic (Built-in)"
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState(
    "Default - Intel HP Spea..."
  );
  const [notificationLeave, setNotificationLeave] = useState(true);
  const [notificationNewMessage, setNotificationNewMessage] = useState(true);
  const [notificationHandRaise, setNotificationHandRaise] = useState(true);
  const [notificationError, setNotificationError] = useState(true);

  // Waiting Room state
  const [waitingUsers, setWaitingUsers] = useState([
    {
      id: 1,
      name: "Samuel Odejinmi",
      imageSrc: "https://i.pravatar.cc/150?u=samuel",
    },
    { id: 2, name: "Emmy ba", imageSrc: "https://i.pravatar.cc/150?u=emmy" },
  ]);
  const [activeMobileView, setActiveMobileView] = useState<"menu" | "content">(
    "menu"
  );

  // Poll states
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollAnswers, setPollAnswers] = useState(["", "", ""]);
  const [activePoll, setActivePoll] = useState<{
    question: string;
    answers: { text: string; votes: number; percentage: number }[];
    totalVotes: number;
    isPublished: boolean;
  } | null>(null);
  const [showPollResults, setShowPollResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Upload/Presentation states
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string;
      isCurrent: boolean;
    }>
  >([]);
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{
      name: string;
      progress: number;
    }>
  >([]);
  const [isDragging, setIsDragging] = useState(false);

  // Random Participant states
  const [showRandomParticipantDialog, setShowRandomParticipantDialog] =
    useState(false);
  const [selectedRandomParticipant, setSelectedRandomParticipant] = useState<{
    name: string;
    imageSrc: string;
    initials: string;
  } | null>(null);

  // Hand raise states
  const [raisedHands, setRaisedHands] = useState<number[]>([]);

  // Whiteboard states
  const WHITEBOARD_SAMPLE_IMAGE =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardZoom, setWhiteboardZoom] = useState(62);
  const [whiteboardActiveFrame, setWhiteboardActiveFrame] = useState(0);
  const [whiteboardFrames, setWhiteboardFrames] = useState<
    Array<{
      id: number;
      backgroundImage: string | null;
    }>
  >([
    { id: 1, backgroundImage: null },
    { id: 2, backgroundImage: WHITEBOARD_SAMPLE_IMAGE },
  ]);
  const [whiteboardActiveTool, setWhiteboardActiveTool] =
    useState<WhiteboardTool>("pointer");
  const [whiteboardElements, setWhiteboardElements] = useState<
    WhiteboardElement[]
  >([]);
  const [whiteboardSelectedElementId, setWhiteboardSelectedElementId] =
    useState<string | null>(null);
  const [whiteboardEditingElementId, setWhiteboardEditingElementId] = useState<
    string | null
  >(null);
  const [whiteboardPenColor, setWhiteboardPenColor] = useState<string>(
    WHITEBOARD_COLORS[0]
  );
  const [whiteboardPenSize, setWhiteboardPenSize] = useState<number>(4);
  const whiteboardCanvasRef = useRef<HTMLDivElement>(null);
  const drawingPathIdRef = useRef<string | null>(null);
  const draggingElementRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const shapeDraftRef = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);
  const erasingPointerIdRef = useRef<number | null>(null);

  const endCallMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLDivElement>(null);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Close end call menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        endCallMenuRef.current &&
        !endCallMenuRef.current.contains(event.target as Node)
      ) {
        setShowEndCallMenu(false);
      }
    }

    if (showEndCallMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEndCallMenu]);

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    }

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  // Format recording time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      setShowEndRecordingDialog(true);
    } else {
      setIsRecording(true);
    }
  };

  const handleEndRecording = () => {
    setIsRecording(false);
    setShowEndRecordingDialog(false);
  };

  const handleCancelEndRecording = () => {
    setShowEndRecordingDialog(false);
  };

  const handleMenuClick = (
    participantName: string,
    event: React.MouseEvent
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 5,
      left: rect.left - 180,
    });
    setSelectedParticipant(participantName);
    setMenuOpen(participantName);
  };

  const handleChangeRole = () => {
    setMenuOpen(null);
    setShowChangeRoleDialog(true);
  };

  const handleRemoveUser = () => {
    setMenuOpen(null);
    setShowRemoveUserDialog(true);
  };

  const handleMuteUser = () => {
    setMenuOpen(null);
    // Implement mute logic
    console.log("Mute user:", selectedParticipant);
  };

  const handlePrivateChat = () => {
    setMenuOpen(null);
    setChatTab("Personal");
    // Implement private chat logic
    console.log("Private chat with:", selectedParticipant);
  };

  const handleConfirmChangeRole = () => {
    setShowChangeRoleDialog(false);
    // Implement role change logic
    console.log("Change role to:", selectedRole, "for", selectedParticipant);
  };

  const handleConfirmRemoveUser = (preventRejoin: boolean) => {
    setShowRemoveUserDialog(false);
    // Implement remove user logic
    console.log(
      "Remove user:",
      selectedParticipant,
      "Prevent rejoin:",
      preventRejoin
    );
  };

  const handleEndCallClick = () => {
    setShowEndCallMenu(!showEndCallMenu);
  };

  const handleEndRoomForAll = () => {
    setShowEndCallMenu(false);
    setShowEndSessionDialog(true);
  };

  const handleLeaveRoom = () => {
    setShowEndCallMenu(false);
    setShowLeaveRoomDialog(true);
  };

  const handleConfirmEndSession = () => {
    setShowEndSessionDialog(false);
    setHasLeftSession(true);
  };

  const handleConfirmLeaveRoom = () => {
    setHasLeftSession(true);
  };

  const handleScreenShareClick = () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
    } else {
      setShowScreenShareDialog(true);
    }
  };

  const handleStartScreenShare = () => {
    if (selectedScreen !== null) {
      setIsScreenSharing(true);
      setShowScreenShareDialog(false);
    }
  };

  const handleStopScreenShare = () => {
    setIsScreenSharing(false);
  };

  const handleShareExternalVideo = () => {
    setShowMoreMenu(false);
    setShowExternalVideoDialog(true);
  };

  const handleCastExternalVideo = () => {
    if (externalVideoUrl.trim()) {
      // Convert YouTube URL to embed format
      let embedUrl = externalVideoUrl;

      // Handle different YouTube URL formats
      if (externalVideoUrl.includes("youtube.com/watch?v=")) {
        const videoId = externalVideoUrl.split("v=")[1]?.split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (externalVideoUrl.includes("youtu.be/")) {
        const videoId = externalVideoUrl.split("youtu.be/")[1]?.split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (externalVideoUrl.includes("youtube.com/embed/")) {
        embedUrl = externalVideoUrl.includes("?")
          ? externalVideoUrl
          : `${externalVideoUrl}?autoplay=1`;
      }

      setActiveExternalVideoUrl(embedUrl);
      setIsPlayingExternalVideo(true);
      setShowExternalVideoDialog(false);
      setExternalVideoUrl("");
    }
  };

  const handleStopExternalVideo = () => {
    setShowEndVideoDialog(true);
  };

  const handleConfirmEndVideo = () => {
    setIsPlayingExternalVideo(false);
    setActiveExternalVideoUrl("");
    setShowEndVideoDialog(false);
  };

  const handleCancelEndVideo = () => {
    setShowEndVideoDialog(false);
  };

  const handleOpenSettings = () => {
    setShowMoreMenu(false);
    setShowSettingsDialog(true);
    setActiveMobileView("menu");
  };

  const handleOpenPolls = () => {
    setShowMoreMenu(false);
    setShowPollDialog(true);
  };

  const handleAddPollAnswer = () => {
    setPollAnswers([...pollAnswers, ""]);
  };

  const handlePollAnswerChange = (index: number, value: string) => {
    const newAnswers = [...pollAnswers];
    newAnswers[index] = value;
    setPollAnswers(newAnswers);
  };

  const handlePublishPoll = () => {
    if (pollQuestion.trim() && pollAnswers.some((a) => a.trim())) {
      const validAnswers = pollAnswers.filter((a) => a.trim());
      setActivePoll({
        question: pollQuestion,
        answers: validAnswers.map((text) => ({
          text,
          votes: 0,
          percentage: 0,
        })),
        totalVotes: 0,
        isPublished: true,
      });
      setShowPollDialog(false);
      setShowPollResults(true);
      setPollQuestion("");
      setPollAnswers(["", "", ""]);
      setHasVoted(false);
    }
  };

  const handleVotePoll = (answerIndex: number) => {
    if (!hasVoted && activePoll) {
      const newAnswers = [...activePoll.answers];
      newAnswers[answerIndex].votes += 1;
      const newTotal = activePoll.totalVotes + 1;

      // Recalculate percentages
      newAnswers.forEach((answer) => {
        answer.percentage = Math.round((answer.votes / newTotal) * 100);
      });

      setActivePoll({
        ...activePoll,
        answers: newAnswers,
        totalVotes: newTotal,
      });
      setHasVoted(true);
    }
  };

  const handleHidePoll = () => {
    setShowPollResults(false);
  };

  const handleEndPoll = () => {
    setActivePoll(null);
    setShowPollResults(false);
    setHasVoted(false);
  };

  const handleOpenUpload = () => {
    setShowMoreMenu(false);
    setShowUploadDialog(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFilesUpload(Array.from(files));
    }
  };

  const handleFilesUpload = (files: File[]) => {
    files.forEach((file) => {
      // Add to uploading list
      const newUploadingFile = { name: file.name, progress: 0 };
      setUploadingFiles((prev) => [...prev, newUploadingFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadingFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, progress } : f))
        );

        if (progress >= 100) {
          clearInterval(interval);
          // Move to uploaded files
          setTimeout(() => {
            setUploadingFiles((prev) =>
              prev.filter((f) => f.name !== file.name)
            );
            setUploadedFiles((prev) => [
              ...prev,
              { name: file.name, isCurrent: false },
            ]);
          }, 500);
        }
      }, 300);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFilesUpload(files);
  };

  const handleSetCurrentPresentation = (fileName: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => ({ ...f, isCurrent: f.name === fileName }))
    );
  };

  const handleDeletePresentation = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleSelectRandomParticipant = () => {
    setShowMoreMenu(false);
    setShowRandomParticipantDialog(true);
    setSelectedRandomParticipant(null);
  };

  const handleRandomSelect = () => {
    // Filter out "You" from participants for random selection
    const eligibleParticipants = participants.filter((p) => !p.isYou);
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const selected = eligibleParticipants[randomIndex];

    // Get initials from name
    const nameParts = selected.name.split(" ");
    const initials = nameParts
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    setSelectedRandomParticipant({
      name: selected.name,
      imageSrc: selected.imageSrc,
      initials: initials,
    });
  };

  const handleHandRaise = () => {
    // Toggle hand raise for current user (id: 1)
    setRaisedHands((prev) => {
      if (prev.includes(1)) {
        return prev.filter((id) => id !== 1);
      } else {
        return [...prev, 1];
      }
    });
  };

  const handleOpenWhiteboard = () => {
    setShowMoreMenu(false);
    setShowWhiteboard(true);
    setIsPlayingExternalVideo(false);
  };

  const handleCloseWhiteboard = () => {
    setShowWhiteboard(false);
  };

  const handleWhiteboardZoomChange = (delta: number) => {
    setWhiteboardZoom((prev) => {
      const next = Math.min(200, Math.max(10, prev + delta));
      return next;
    });
  };

  const handleWhiteboardFrameNavigate = (direction: number) => {
    setWhiteboardActiveFrame((prev) => {
      const total = whiteboardFrames.length;
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= total) return total - 1;
      return next;
    });
  };

  const handleClearWhiteboardFrame = () => {
    setWhiteboardFrames((prev) =>
      prev.map((frame, index) =>
        index === whiteboardActiveFrame
          ? { ...frame, backgroundImage: null }
          : frame
      )
    );
  };

  const handleSetWhiteboardBackground = () => {
    setWhiteboardFrames((prev) =>
      prev.map((frame, index) =>
        index === whiteboardActiveFrame
          ? { ...frame, backgroundImage: WHITEBOARD_SAMPLE_IMAGE }
          : frame
      )
    );
  };

  const handleAddWhiteboardFrame = () => {
    setWhiteboardFrames((prev) => {
      const nextFrame = { id: prev.length + 1, backgroundImage: null };
      const updated = [...prev, nextFrame];
      setWhiteboardActiveFrame(updated.length - 1);
      return updated;
    });
  };

  const getWhiteboardPoint = (event: ReactPointerEvent<Element>) => {
    if (!whiteboardCanvasRef.current) {
      return null;
    }
    const rect = whiteboardCanvasRef.current.getBoundingClientRect();
    const scale = whiteboardZoom / 100;
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    return {
      x: clamp(x, 0, WHITEBOARD_WIDTH),
      y: clamp(y, 0, WHITEBOARD_HEIGHT),
    };
  };

  const updateWhiteboardElement = (
    id: string,
    updater: (previous: WhiteboardElement) => WhiteboardElement
  ) => {
    setWhiteboardElements((prev) =>
      prev.map((element) => (element.id === id ? updater(element) : element))
    );
  };

  const removeWhiteboardElement = (id: string) => {
    setWhiteboardElements((prev) =>
      prev.filter((element) => element.id !== id)
    );
    if (whiteboardSelectedElementId === id) {
      setWhiteboardSelectedElementId(null);
    }
    if (whiteboardEditingElementId === id) {
      setWhiteboardEditingElementId(null);
    }
  };

  const eraseAtPoint = (point: WhiteboardPoint) => {
    let removedElementId: string | null = null;

    setWhiteboardElements((previousElements) => {
      for (let index = previousElements.length - 1; index >= 0; index -= 1) {
        const element = previousElements[index];
        if (doesPointHitElement(element, point)) {
          removedElementId = element.id;
          const updated = [...previousElements];
          updated.splice(index, 1);
          return updated;
        }
      }
      return previousElements;
    });

    if (removedElementId) {
      setWhiteboardSelectedElementId((previousSelected) =>
        previousSelected === removedElementId ? null : previousSelected
      );
      setWhiteboardEditingElementId((previousEditing) =>
        previousEditing === removedElementId ? null : previousEditing
      );
    }
  };

  const handleWhiteboardPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!showWhiteboard) {
      return;
    }
    const point = getWhiteboardPoint(event);
    if (!point) {
      return;
    }

    if (whiteboardActiveTool === "eraser") {
      eraseAtPoint(point);
      whiteboardCanvasRef.current?.setPointerCapture?.(event.pointerId);
      erasingPointerIdRef.current = event.pointerId;
      event.preventDefault();
      return;
    }

    if (whiteboardActiveTool === "pen") {
      const id = generateId();
      const newPath: WhiteboardPathElement = {
        id,
        type: "path",
        points: [point],
        color: whiteboardPenColor,
        strokeWidth: whiteboardPenSize,
      };
      setWhiteboardElements((prev) => [...prev, newPath]);
      drawingPathIdRef.current = id;
      whiteboardCanvasRef.current?.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }

    if (whiteboardActiveTool === "shapes") {
      const id = generateId();
      const newShape: WhiteboardShapeElement = {
        id,
        type: "shape",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        color: whiteboardPenColor,
      };
      setWhiteboardElements((prev) => [...prev, newShape]);
      shapeDraftRef.current = { id, startX: point.x, startY: point.y };
      setWhiteboardSelectedElementId(id);
      event.preventDefault();
      return;
    }

    if (whiteboardActiveTool === "sticky") {
      const stickySize = STICKY_NOTE_SIZE;
      const id = generateId();
      const newSticky: WhiteboardStickyElement = {
        id,
        type: "sticky",
        x: clamp(point.x - stickySize / 2, 0, WHITEBOARD_WIDTH - stickySize),
        y: clamp(point.y - stickySize / 2, 0, WHITEBOARD_HEIGHT - stickySize),
        text: "Double-click to edit",
        color: whiteboardPenColor,
      };
      setWhiteboardElements((prev) => [...prev, newSticky]);
      setWhiteboardSelectedElementId(id);
      setWhiteboardEditingElementId(id);
      event.preventDefault();
      return;
    }

    if (whiteboardActiveTool === "text") {
      const textWidth = TEXT_ELEMENT_WIDTH;
      const textHeight = TEXT_ELEMENT_MIN_HEIGHT;
      const id = generateId();
      const newText: WhiteboardTextElement = {
        id,
        type: "text",
        x: clamp(point.x - textWidth / 2, 0, WHITEBOARD_WIDTH - textWidth),
        y: clamp(point.y - textHeight / 2, 0, WHITEBOARD_HEIGHT - textHeight),
        text: "Add your text",
        color: whiteboardPenColor,
      };
      setWhiteboardElements((prev) => [...prev, newText]);
      setWhiteboardSelectedElementId(id);
      setWhiteboardEditingElementId(id);
      event.preventDefault();
      return;
    }

    if (whiteboardActiveTool === "image") {
      const url = window.prompt("Enter image URL");
      if (url) {
        const imageWidth = 320;
        const imageHeight = 200;
        const id = generateId();
        const newImage: WhiteboardImageElement = {
          id,
          type: "image",
          x: clamp(point.x - imageWidth / 2, 0, WHITEBOARD_WIDTH - imageWidth),
          y: clamp(
            point.y - imageHeight / 2,
            0,
            WHITEBOARD_HEIGHT - imageHeight
          ),
          url,
          width: imageWidth,
          height: imageHeight,
        };
        setWhiteboardElements((prev) => [...prev, newImage]);
        setWhiteboardSelectedElementId(id);
      }
      setWhiteboardActiveTool("pointer");
      return;
    }

    if (whiteboardActiveTool === "pointer") {
      setWhiteboardSelectedElementId(null);
    }
  };

  const handleWhiteboardPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!showWhiteboard) {
      return;
    }
    const point = getWhiteboardPoint(event);
    if (!point) {
      return;
    }

    if (
      whiteboardActiveTool === "eraser" &&
      erasingPointerIdRef.current !== null
    ) {
      eraseAtPoint(point);
      event.preventDefault();
      return;
    }

    const drawingId = drawingPathIdRef.current;
    if (drawingId) {
      setWhiteboardElements((prev) =>
        prev.map((element) => {
          if (element.id === drawingId && element.type === "path") {
            const lastPoint = element.points[element.points.length - 1];
            const deltaX = point.x - lastPoint.x;
            const deltaY = point.y - lastPoint.y;
            if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
              return {
                ...element,
                points: [...element.points, point],
              };
            }
          }
          return element;
        })
      );
      event.preventDefault();
      return;
    }

    const shapeDraft = shapeDraftRef.current;
    if (shapeDraft) {
      const { id, startX, startY } = shapeDraft;
      const width = point.x - startX;
      const height = point.y - startY;
      setWhiteboardElements((prev) =>
        prev.map((element) => {
          if (element.id === id && element.type === "shape") {
            const rectX = width < 0 ? startX + width : startX;
            const rectY = height < 0 ? startY + height : startY;
            return {
              ...element,
              x: clamp(rectX, 0, WHITEBOARD_WIDTH),
              y: clamp(rectY, 0, WHITEBOARD_HEIGHT),
              width: Math.min(Math.abs(width), WHITEBOARD_WIDTH),
              height: Math.min(Math.abs(height), WHITEBOARD_HEIGHT),
            };
          }
          return element;
        })
      );
      event.preventDefault();
      return;
    }

    const dragState = draggingElementRef.current;
    if (dragState) {
      setWhiteboardElements((prev) =>
        prev.map((element) => {
          if (element.id === dragState.id && element.type !== "path") {
            const newX = clamp(
              point.x - dragState.offsetX,
              0,
              WHITEBOARD_WIDTH - ("width" in element ? element.width : 0)
            );
            const newY = clamp(
              point.y - dragState.offsetY,
              0,
              WHITEBOARD_HEIGHT - ("height" in element ? element.height : 0)
            );
            if (element.type === "sticky" || element.type === "text") {
              const elementWidth =
                element.type === "sticky"
                  ? STICKY_NOTE_SIZE
                  : TEXT_ELEMENT_WIDTH;
              const elementHeight =
                element.type === "sticky"
                  ? STICKY_NOTE_SIZE
                  : TEXT_ELEMENT_MIN_HEIGHT;
              return {
                ...element,
                x: clamp(
                  point.x - dragState.offsetX,
                  0,
                  WHITEBOARD_WIDTH - elementWidth
                ),
                y: clamp(
                  point.y - dragState.offsetY,
                  0,
                  WHITEBOARD_HEIGHT - elementHeight
                ),
              };
            }
            if (element.type === "image") {
              return {
                ...element,
                x: clamp(
                  point.x - dragState.offsetX,
                  0,
                  WHITEBOARD_WIDTH - element.width
                ),
                y: clamp(
                  point.y - dragState.offsetY,
                  0,
                  WHITEBOARD_HEIGHT - element.height
                ),
              };
            }
            return {
              ...element,
              x: newX,
              y: newY,
            };
          }
          return element;
        })
      );
      event.preventDefault();
    }
  };

  const stopWhiteboardInteractions = () => {
    if (erasingPointerIdRef.current !== null) {
      whiteboardCanvasRef.current?.releasePointerCapture?.(
        erasingPointerIdRef.current
      );
      erasingPointerIdRef.current = null;
    }
    drawingPathIdRef.current = null;
    shapeDraftRef.current = null;
    draggingElementRef.current = null;
  };

  const handleWhiteboardPointerUp = () => {
    const shapeDraft = shapeDraftRef.current;
    if (shapeDraft) {
      const { id } = shapeDraft;
      setWhiteboardElements((prev) =>
        prev.map((element) => {
          if (element.id === id && element.type === "shape") {
            if (element.width < 10 || element.height < 10) {
              return { ...element, width: 120, height: 80 };
            }
          }
          return element;
        })
      );
    }
    stopWhiteboardInteractions();
  };

  const handleWhiteboardPointerLeave = () => {
    stopWhiteboardInteractions();
  };

  const handleWhiteboardElementPointerDown = (
    event: ReactPointerEvent<Element>,
    element: WhiteboardElement
  ) => {
    const point = getWhiteboardPoint(event);
    if (!point) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();

    if (whiteboardActiveTool === "eraser") {
      removeWhiteboardElement(element.id);
      whiteboardCanvasRef.current?.setPointerCapture?.(event.pointerId);
      erasingPointerIdRef.current = event.pointerId;
      return;
    }

    if (whiteboardActiveTool === "pointer") {
      setWhiteboardSelectedElementId(element.id);
      if (element.type === "sticky") {
        const width = STICKY_NOTE_SIZE;
        const height = STICKY_NOTE_SIZE;
        draggingElementRef.current = {
          id: element.id,
          offsetX: point.x - element.x,
          offsetY: point.y - element.y,
        };
        draggingElementRef.current.offsetX = clamp(
          draggingElementRef.current.offsetX,
          0,
          width
        );
        draggingElementRef.current.offsetY = clamp(
          draggingElementRef.current.offsetY,
          0,
          height
        );
      } else if (element.type === "text") {
        const width = TEXT_ELEMENT_WIDTH;
        const height = TEXT_ELEMENT_MIN_HEIGHT;
        draggingElementRef.current = {
          id: element.id,
          offsetX: point.x - element.x,
          offsetY: point.y - element.y,
        };
        draggingElementRef.current.offsetX = clamp(
          draggingElementRef.current.offsetX,
          0,
          width
        );
        draggingElementRef.current.offsetY = clamp(
          draggingElementRef.current.offsetY,
          0,
          height
        );
      } else if (element.type === "image") {
        draggingElementRef.current = {
          id: element.id,
          offsetX: point.x - element.x,
          offsetY: point.y - element.y,
        };
      } else if (element.type === "shape") {
        draggingElementRef.current = {
          id: element.id,
          offsetX: point.x - element.x,
          offsetY: point.y - element.y,
        };
      }
    }
  };

  const handleWhiteboardElementDoubleClick = (element: WhiteboardElement) => {
    if (element.type === "sticky" || element.type === "text") {
      setWhiteboardEditingElementId(element.id);
    }
  };

  const handleWhiteboardElementTextChange = (id: string, text: string) => {
    updateWhiteboardElement(id, (element) => {
      if (element.type === "sticky" || element.type === "text") {
        return {
          ...element,
          text,
        };
      }
      return element;
    });
  };

  useEffect(() => {
    if (!whiteboardEditingElementId) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWhiteboardEditingElementId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [whiteboardEditingElementId]);

  // Show goodbye screen if user has left
  if (hasLeftSession) {
    return (
      <div className="h-screen bg-blue-600 flex flex-col">
        <header className="p-6">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <VideoIcon className="w-7 h-7 text-blue-600" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-white px-4">
          <div className="text-6xl mb-6">👋</div>
          <h1 className="text-3xl font-semibold mb-2">You left the session</h1>
          <p className="text-blue-100 mb-8">Thanks</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-100">Left by mistake?</span>
            <button
              onClick={() => setHasLeftSession(false)}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data
  const participants = [
    {
      id: 1,
      name: "You",
      isYou: true,
      isMuted: !isMicOn,
      isVideoOff: !isVideoOn,
      hasRaisedHand: raisedHands.includes(1),
      imageSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Bolade ola",
      isMuted: true,
      isVideoOff: true,
      hasRaisedHand: raisedHands.includes(2),
      imageSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Ajibade fola",
      isMuted: true,
      isVideoOff: false,
      hasRaisedHand: raisedHands.includes(3),
      imageSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Kathryn Murphy",
      isMuted: true,
      isVideoOff: false,
      hasRaisedHand: raisedHands.includes(4),
      imageSrc:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  const messages = [
    {
      id: 1,
      name: "Kathryn Murphy",
      message: "Good afternoon, everyone.",
      time: "11:01 AM",
      imageSrc:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Ajibade fola",
      message: "We will start this meeting",
      time: "11:02 AM",
      imageSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Ajibade fola",
      message: "Yes, Let's start this meeting",
      time: "11:02 AM",
      imageSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "You",
      message: "Today, we are here to discuss last week's sales.",
      time: "12:04 AM",
      isYou: true,
      imageSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
  ];

  const activeParticipant = participants[0];
  const activeWhiteboardFrame =
    whiteboardFrames[whiteboardActiveFrame] ?? whiteboardFrames[0];
  const totalWhiteboardFrames = whiteboardFrames.length;
  const whiteboardScale = whiteboardZoom / 100;
  const scaledWhiteboardWidth = WHITEBOARD_WIDTH * whiteboardScale;
  const scaledWhiteboardHeight = WHITEBOARD_HEIGHT * whiteboardScale;

  const whiteboardTools: Array<{
    id: WhiteboardTool;
    label: string;
    icon: JSX.Element;
  }> = [
    { id: "pointer", label: "Select", icon: <PointerIcon /> },
    {
      id: "text",
      label: "Text",
      icon: <span className="font-semibold text-xs">T</span>,
    },
    { id: "pen", label: "Pen", icon: <PenToolIcon /> },
    { id: "shapes", label: "Shapes", icon: <ShapeToolIcon /> },
    { id: "sticky", label: "Sticky Note", icon: <StickyNoteIcon /> },
    { id: "image", label: "Image", icon: <ImageToolIcon /> },
    { id: "eraser", label: "Eraser", icon: <EraserIcon /> },
  ];

  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left side - Meeting info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>

            {/* Mobile Meeting Link */}
            <button className="sm:hidden flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <LinkIcon className="w-4 h-4" />
              <span>cem-jnmt-</span>
            </button>

            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-900">
                [Internal] Weekly Report Marketing + Sales
              </h1>
              <p className="text-xs text-gray-500">
                June 12th, 2023 | 11:00 AM
              </p>
            </div>
            {/* Recording timer badge */}
            {isRecording && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Participants & Meeting link */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile Header Buttons */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                <UsersIcon className="w-4 h-4" />
                <span>15+</span>
              </button>
              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setChatTab("Group");
                }}
                className="relative flex items-center justify-center w-9 h-9 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-200"
              >
                <ChatIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] flex items-center justify-center rounded-full">
                  4
                </span>
              </button>
            </div>

            {/* Participant avatars */}
            <div className="hidden md:flex items-center">
              <div className="flex -space-x-2">
                {participants.slice(0, 4).map((p) => (
                  <div key={p.id} className="ring-2 ring-white">
                    <Avatar name={p.name} src={p.imageSrc} size={32} />
                  </div>
                ))}
              </div>
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                +9
              </span>
            </div>

            {/* Meeting link */}
            <button className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
              <LinkIcon className="w-4 h-4" />
              <span>cem-jmnt-hsu</span>
            </button>

            {/* Moderator info */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200">
              <Avatar
                name="Adam Joseph"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                size={36}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Adam Joseph</p>
                <p className="text-xs text-gray-500">Moderator</p>
              </div>
            </div>

            {/* Mobile menu button - Hidden now as we have specific buttons */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:hidden"
            >
              <MoreIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video grid / Whiteboard area */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-6">
            {showWhiteboard ? (
              <div className="h-full flex flex-col bg-blue-50/60 border border-blue-100 rounded-2xl shadow-inner overflow-hidden">
                <div className="flex items-center justify-between gap-4 flex-wrap px-4 lg:px-6 py-3 border-b border-blue-100 bg-white">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
                      >
                        <UndoIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
                      >
                        <RedoIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-blue-100" />
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleWhiteboardZoomChange(-10)}
                        className="w-7 h-7 rounded-full bg-white/60 hover:bg-white text-blue-600 text-sm font-semibold"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold">
                        {whiteboardZoom}%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleWhiteboardZoomChange(10)}
                        className="w-7 h-7 rounded-full bg-white/60 hover:bg-white text-blue-600 text-sm font-semibold"
                      >
                        +
                      </button>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/80 border border-blue-100 rounded-full px-3 py-1.5">
                      {WHITEBOARD_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setWhiteboardPenColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform duration-150 ${
                            whiteboardPenColor === color
                              ? "border-blue-600 scale-110"
                              : "border-white"
                          }`}
                          style={{ backgroundColor: color }}
                          title="Choose color"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-white/70 border border-blue-100 rounded-full px-3 py-1.5">
                      <span className="text-xs font-medium text-blue-600">
                        Pen
                      </span>
                      <input
                        type="range"
                        min={1}
                        max={16}
                        value={whiteboardPenSize}
                        onChange={(event) =>
                          setWhiteboardPenSize(Number(event.target.value))
                        }
                        className="w-24 accent-blue-600"
                      />
                      <span className="text-xs font-semibold text-blue-600 w-6 text-right">
                        {whiteboardPenSize}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <button
                      type="button"
                      onClick={handleSetWhiteboardBackground}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Set background
                    </button>
                    <button
                      type="button"
                      onClick={handleClearWhiteboardFrame}
                      className="px-3 py-1.5 text-sm bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Clear frame
                    </button>
                    <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleWhiteboardFrameNavigate(-1)}
                        disabled={whiteboardActiveFrame === 0}
                        className={`p-1 rounded-md transition-colors ${
                          whiteboardActiveFrame === 0
                            ? "text-blue-200"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                      </button>
                      <div className="min-w-14 text-sm font-semibold text-blue-700 text-center">
                        {whiteboardActiveFrame + 1}/{totalWhiteboardFrames}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleWhiteboardFrameNavigate(1)}
                        disabled={
                          whiteboardActiveFrame === totalWhiteboardFrames - 1
                        }
                        className={`p-1 rounded-md transition-colors ${
                          whiteboardActiveFrame === totalWhiteboardFrames - 1
                            ? "text-blue-200"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseWhiteboard}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-14 bg-blue-600 text-white flex flex-col items-center py-4 gap-2">
                    {whiteboardTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setWhiteboardActiveTool(tool.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          whiteboardActiveTool === tool.id
                            ? "bg-white text-blue-600 shadow"
                            : "text-white/80 hover:bg-blue-500/80"
                        }`}
                        title={tool.label}
                      >
                        {tool.icon}
                      </button>
                    ))}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleAddWhiteboardFrame}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white/80 hover:bg-blue-500/80 transition-colors"
                      title="Add frame"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white/80 hover:bg-blue-500/80 transition-colors"
                      title="More tools"
                    >
                      <MoreIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 lg:p-6 overflow-auto">
                    <div className="relative w-full h-full bg-blue-100/40 rounded-2xl border border-blue-100 shadow-inner overflow-auto">
                      <div
                        className="relative mx-auto"
                        style={{
                          width: scaledWhiteboardWidth,
                          height: scaledWhiteboardHeight,
                        }}
                      >
                        <div
                          ref={whiteboardCanvasRef}
                          className="relative bg-white border border-blue-200 rounded-2xl shadow-sm touch-none select-none"
                          style={{
                            width: WHITEBOARD_WIDTH,
                            height: WHITEBOARD_HEIGHT,
                            transform: `scale(${whiteboardScale})`,
                            transformOrigin: "0 0",
                          }}
                          onPointerDown={handleWhiteboardPointerDown}
                          onPointerMove={handleWhiteboardPointerMove}
                          onPointerUp={handleWhiteboardPointerUp}
                          onPointerLeave={handleWhiteboardPointerLeave}
                        >
                          {activeWhiteboardFrame?.backgroundImage ? (
                            <img
                              src={activeWhiteboardFrame.backgroundImage}
                              alt="Whiteboard frame"
                              className="absolute inset-0 w-full h-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-white" />
                          )}

                          <svg
                            className="absolute inset-0 w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {whiteboardElements.map((element) => {
                              if (element.type === "path") {
                                return (
                                  <polyline
                                    key={element.id}
                                    points={element.points
                                      .map((point) => `${point.x},${point.y}`)
                                      .join(" ")}
                                    fill="none"
                                    stroke={element.color}
                                    strokeWidth={element.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    data-element-id={element.id}
                                    onPointerDown={(event) =>
                                      handleWhiteboardElementPointerDown(
                                        event,
                                        element
                                      )
                                    }
                                    style={{
                                      cursor:
                                        whiteboardActiveTool === "eraser"
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                  />
                                );
                              }
                              if (element.type === "shape") {
                                return (
                                  <rect
                                    key={element.id}
                                    x={element.x}
                                    y={element.y}
                                    width={Math.max(element.width, 4)}
                                    height={Math.max(element.height, 4)}
                                    fill={element.color}
                                    fillOpacity={0.18}
                                    stroke={element.color}
                                    strokeWidth={2}
                                    rx={12}
                                    data-element-id={element.id}
                                    onPointerDown={(event) =>
                                      handleWhiteboardElementPointerDown(
                                        event,
                                        element
                                      )
                                    }
                                    style={{
                                      cursor:
                                        whiteboardActiveTool === "eraser"
                                          ? "not-allowed"
                                          : "move",
                                    }}
                                  />
                                );
                              }
                              return null;
                            })}
                          </svg>

                          {whiteboardElements.map((element) => {
                            if (element.type === "image") {
                              const isSelected =
                                whiteboardSelectedElementId === element.id;
                              return (
                                <div
                                  key={element.id}
                                  className={`absolute rounded-xl overflow-hidden shadow ${
                                    isSelected
                                      ? "ring-2 ring-blue-500"
                                      : "ring-0"
                                  }`}
                                  style={{
                                    left: element.x,
                                    top: element.y,
                                    width: element.width,
                                    height: element.height,
                                    cursor:
                                      whiteboardActiveTool === "eraser"
                                        ? "not-allowed"
                                        : "move",
                                  }}
                                  data-element-id={element.id}
                                  onPointerDown={(event) =>
                                    handleWhiteboardElementPointerDown(
                                      event,
                                      element
                                    )
                                  }
                                >
                                  <img
                                    src={element.url}
                                    alt="Whiteboard asset"
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                  />
                                </div>
                              );
                            }

                            if (element.type === "sticky") {
                              const isSelected =
                                whiteboardSelectedElementId === element.id;
                              const isEditing =
                                whiteboardEditingElementId === element.id;
                              return (
                                <div
                                  key={element.id}
                                  style={{
                                    left: element.x,
                                    top: element.y,
                                    width: STICKY_NOTE_SIZE,
                                    height: STICKY_NOTE_SIZE,
                                    backgroundColor: element.color,
                                    cursor:
                                      whiteboardActiveTool === "eraser"
                                        ? "not-allowed"
                                        : "move",
                                  }}
                                  className={`absolute rounded-2xl p-4 shadow-lg flex flex-col gap-2 transition-shadow ${
                                    isSelected
                                      ? "ring-2 ring-offset-2 ring-blue-500"
                                      : "ring-0"
                                  }`}
                                  data-element-id={element.id}
                                  onPointerDown={(event) =>
                                    handleWhiteboardElementPointerDown(
                                      event,
                                      element
                                    )
                                  }
                                  onDoubleClick={() =>
                                    handleWhiteboardElementDoubleClick(element)
                                  }
                                >
                                  {isEditing ? (
                                    <textarea
                                      value={element.text}
                                      onChange={(event) =>
                                        handleWhiteboardElementTextChange(
                                          element.id,
                                          event.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        setWhiteboardEditingElementId(null)
                                      }
                                      autoFocus
                                      className="flex-1 resize-none bg-white/70 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      style={{ minHeight: 0 }}
                                      onPointerDown={(event) =>
                                        event.stopPropagation()
                                      }
                                    />
                                  ) : (
                                    <div className="flex-1 text-sm font-medium text-gray-900 whitespace-pre-wrap">
                                      {element.text}
                                    </div>
                                  )}
                                  {!isEditing && (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setWhiteboardEditingElementId(
                                          element.id
                                        );
                                      }}
                                      className="self-end text-xs font-semibold text-blue-700 bg-white/70 px-3 py-1 rounded-full hover:bg-white"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>
                              );
                            }

                            if (element.type === "text") {
                              const isSelected =
                                whiteboardSelectedElementId === element.id;
                              const isEditing =
                                whiteboardEditingElementId === element.id;
                              return (
                                <div
                                  key={element.id}
                                  style={{
                                    left: element.x,
                                    top: element.y,
                                    width: TEXT_ELEMENT_WIDTH,
                                    minHeight: TEXT_ELEMENT_MIN_HEIGHT,
                                    cursor:
                                      whiteboardActiveTool === "eraser"
                                        ? "not-allowed"
                                        : "move",
                                  }}
                                  className={`absolute rounded-xl bg-white/90 border border-blue-200 p-3 shadow ${
                                    isSelected
                                      ? "ring-2 ring-offset-2 ring-blue-500"
                                      : "ring-0"
                                  }`}
                                  data-element-id={element.id}
                                  onPointerDown={(event) =>
                                    handleWhiteboardElementPointerDown(
                                      event,
                                      element
                                    )
                                  }
                                  onDoubleClick={() =>
                                    handleWhiteboardElementDoubleClick(element)
                                  }
                                >
                                  {isEditing ? (
                                    <textarea
                                      value={element.text}
                                      onChange={(event) =>
                                        handleWhiteboardElementTextChange(
                                          element.id,
                                          event.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        setWhiteboardEditingElementId(null)
                                      }
                                      autoFocus
                                      className="w-full h-full resize-none bg-transparent text-sm text-gray-900 focus:outline-none"
                                      style={{ color: element.color }}
                                      onPointerDown={(event) =>
                                        event.stopPropagation()
                                      }
                                    />
                                  ) : (
                                    <div
                                      className="text-sm font-semibold whitespace-pre-wrap"
                                      style={{ color: element.color }}
                                    >
                                      {element.text}
                                    </div>
                                  )}
                                  {!isEditing && (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setWhiteboardEditingElementId(
                                          element.id
                                        );
                                      }}
                                      className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 hover:bg-blue-200"
                                    >
                                      Edit text
                                    </button>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}

                          <div className="absolute inset-0 pointer-events-none border-4 border-blue-200/40 rounded-2xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : isPlayingExternalVideo ? (
              // Full screen external video
              <div className="h-full flex items-center justify-center">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                  {/* External video player */}
                  <iframe
                    src={activeExternalVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="External Video"
                  />

                  {/* Stop Video button - top right */}
                  <button
                    onClick={handleStopExternalVideo}
                    className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg z-10"
                  >
                    <StopCircleIcon className="w-5 h-5" />
                    Stop Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 max-w-7xl mx-auto">
                {/* Main speaker - takes 2 columns on desktop */}
                <div className="lg:col-span-2">
                  {isScreenSharing ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-blue-600">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <ShareScreenIcon className="w-16 h-16 mb-4" />
                        <p className="text-xl font-semibold mb-2">
                          You are sharing your screen
                        </p>
                        <button
                          onClick={handleStopScreenShare}
                          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 6h12v12H6z" />
                          </svg>
                          Stop Screenshare
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ParticipantCard
                      name={activeParticipant.name}
                      isActive={true}
                      isMuted={activeParticipant.isMuted}
                      isVideoOff={activeParticipant.isVideoOff}
                      imageSrc={activeParticipant.imageSrc}
                      hasRaisedHand={activeParticipant.hasRaisedHand}
                    />
                  )}
                </div>

                {/* Other participants */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
                  {participants.slice(1).map((p) => (
                    <ParticipantCard
                      key={p.id}
                      name={p.name}
                      isMuted={p.isMuted}
                      isVideoOff={p.isVideoOff}
                      imageSrc={p.imageSrc}
                      hasRaisedHand={p.hasRaisedHand}
                    />
                  ))}
                </div>

                {/* Poll Overlay */}
                {showPollResults && activePoll && (
                  <div className="fixed top-24 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-blue-600 rounded-2xl shadow-2xl p-6 w-96">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold text-lg">
                          Polls
                        </h3>
                        <button
                          onClick={handleHidePoll}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <ChevronUpIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-white mb-4">{activePoll.question}</p>

                      <div className="space-y-2 mb-4">
                        {activePoll.answers.map((answer, index) => (
                          <button
                            key={index}
                            onClick={() => handleVotePoll(index)}
                            disabled={hasVoted}
                            className={`w-full text-left transition-colors ${
                              hasVoted
                                ? "cursor-default"
                                : "hover:bg-blue-700 cursor-pointer"
                            }`}
                          >
                            <div className="bg-blue-500/40 rounded-lg p-3 relative overflow-hidden">
                              {hasVoted && (
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-blue-700/50 transition-all duration-500"
                                  style={{ width: `${answer.percentage}%` }}
                                />
                              )}
                              <div className="relative flex items-center justify-between">
                                <span className="text-white font-medium">
                                  {answer.text}
                                </span>
                                {hasVoted && (
                                  <span className="text-white font-semibold">
                                    {answer.percentage}%"
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="text-blue-200 text-sm mb-4">
                        {activePoll.totalVotes} votes of{" "}
                        {activePoll.totalVotes + (hasVoted ? 0 : 1)}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleEndPoll}
                          className="flex-1 bg-blue-500/40 hover:bg-blue-500/60 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          disabled
                          className="flex-1 bg-blue-500/40 text-white py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="6" y="6" width="4" height="4" />
                            <rect x="6" y="12" width="4" height="4" />
                          </svg>
                        </button>
                        <button
                          disabled
                          className="flex-1 bg-blue-500/40 text-white py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={handleEndPoll}
                        className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-medium"
                      >
                        End Poll/Publish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Control bar */}
          <div className="shrink-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-3 lg:py-4">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 flex-wrap">
              <IconButton
                active={!isMicOn}
                onClick={() => setIsMicOn(!isMicOn)}
                className="w-10 h-10 lg:w-12 lg:h-12"
              >
                {isMicOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              <IconButton
                active={isVideoOn}
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="w-10 h-10 lg:w-12 lg:h-12"
              >
                {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
              </IconButton>

              <IconButton
                active={isScreenSharing}
                onClick={handleScreenShareClick}
                className="w-10 h-10 lg:w-12 lg:h-12"
              >
                <ShareScreenIcon />
              </IconButton>

              <IconButton
                active={isRecording}
                onClick={handleRecordingClick}
                className="hidden lg:flex w-12 h-12"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isRecording ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <RecordIcon className="w-3 h-3 text-white" />
                </div>
              </IconButton>

              <IconButton
                active={isSidebarOpen}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex w-12 h-12"
              >
                <ChatIcon />
              </IconButton>

              <div className="relative lg:order-last">
                <button
                  onClick={handleEndCallClick}
                  className="bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm flex items-center justify-center px-4 py-2 rounded-xl font-medium text-xs gap-2 lg:w-12 lg:h-12 lg:rounded-full lg:p-0"
                >
                  <span className="lg:hidden">End Call</span>
                  <PhoneIcon className="hidden lg:block w-5 h-5" />
                </button>

                {/* End Call Menu */}
                {showEndCallMenu && (
                  <div
                    ref={endCallMenuRef}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 mb-2 bg-blue-600 text-white rounded-xl shadow-2xl py-2 w-80 z-50"
                  >
                    <button
                      onClick={handleEndRoomForAll}
                      className="w-full px-4 py-3 text-left hover:bg-blue-700 flex items-start gap-3"
                    >
                      <StopCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">End Room For All</div>
                        <div className="text-xs text-blue-100">
                          The session will end for everyone. You can't undo this
                          action.
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={handleConfirmLeaveRoom}
                      className="w-full px-4 py-3 text-left hover:bg-blue-700 flex items-start gap-3"
                    >
                      <LogOutIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Leave Room</div>
                        <div className="text-xs text-blue-100">
                          Others will continue after you leave. You can join the
                          session again.
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <IconButton
                active={raisedHands.includes(1)}
                onClick={handleHandRaise}
                className="w-10 h-10 lg:w-12 lg:h-12"
              >
                <HandIcon />
              </IconButton>

              <div ref={moreButtonRef} className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    showMoreMenu
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-100"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <MoreIcon className="w-6 h-6" />
                </button>

                {/* More Menu */}
                {showMoreMenu && (
                  <div
                    ref={moreMenuRef}
                    className="absolute bottom-full right-0 mb-2 bg-blue-600 text-white rounded-xl shadow-2xl py-2 w-56 z-50"
                  >
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Go Fullscreen
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <MaximizeIcon className="w-4 h-4" />
                      Go Fullscreen
                    </button>
                    <button
                      onClick={() => {
                        handleRecordingClick();
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          isRecording ? "bg-red-500 border-red-500" : ""
                        }`}
                      >
                        {isRecording && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      Recording
                    </button>
                    <button
                      onClick={handleOpenUpload}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <UploadIcon className="w-4 h-4" />
                      Upload Files
                    </button>
                    <button
                      onClick={handleOpenWhiteboard}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <LayoutIcon className="w-4 h-4" />
                      Whiteboard
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Mute All
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <MicOffAllIcon className="w-4 h-4" />
                      Mute All
                    </button>
                    <button
                      onClick={handleOpenPolls}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <PollIcon className="w-4 h-4" />
                      Polls
                    </button>
                    <button
                      onClick={handleShareExternalVideo}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <VideoLinkIcon className="w-4 h-4" />
                      Share an external video
                    </button>
                    <button
                      onClick={handleSelectRandomParticipant}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <UsersIcon className="w-4 h-4" />
                      Select Random Participant
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Invite/Share
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <ShareIcon className="w-4 h-4" />
                      Invite/Share
                    </button>
                    <button
                      onClick={handleOpenSettings}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar - Participants & Chat */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-80 xl:w-96 bg-white border-l border-gray-200 flex flex-col absolute lg:relative inset-0 lg:inset-auto z-10">
            {/* Participants section */}
            <div className="shrink-0 border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Participants
                </h2>
                <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Participant</span>
                </button>
              </div>
              <div className="px-4 pb-3 space-y-1">
                {participants.map((p) => (
                  <ParticipantListItem
                    key={p.id}
                    name={p.name}
                    imageSrc={p.imageSrc}
                    isMuted={p.isMuted}
                    isVideoOff={p.isVideoOff}
                    isYou={p.isYou}
                    hasRaisedHand={p.hasRaisedHand}
                    onMenuClick={(e) => handleMenuClick(p.name, e)}
                  />
                ))}
              </div>
            </div>

            {/* Chat section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Chats</h2>
                <Tabs
                  tabs={["Group", "Personal"]}
                  activeTab={chatTab}
                  onChange={setChatTab}
                />
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    name={msg.name}
                    message={msg.message}
                    time={msg.time}
                    imageSrc={msg.imageSrc}
                    isYou={msg.isYou}
                  />
                ))}
              </div>

              {/* Message input */}
              <div className="shrink-0 p-4 border-t border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type Something..."
                    className="w-full pl-4 pr-20 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                    <SendIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* End Recording Confirmation Dialog */}
      {showEndRecordingDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  End Recording
                </h3>
                <p className="text-sm text-blue-100">
                  Are you sure you want to end recording?
                  <br />
                  You can't undo this action.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelEndRecording}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Don't End
              </button>
              <button
                onClick={handleEndRecording}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                End Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participant Menu */}
      {menuOpen && (
        <ParticipantMenu
          participantName={selectedParticipant}
          position={menuPosition}
          onClose={() => setMenuOpen(null)}
          onChangeRole={handleChangeRole}
          onMuteUser={handleMuteUser}
          onPrivateChat={handlePrivateChat}
          onRemoveUser={handleRemoveUser}
        />
      )}

      {/* Change Role Dialog */}
      {showChangeRoleDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Change Role
            </h3>
            <p className="text-sm text-blue-100 mb-6">
              Change the role of "{selectedParticipant}" to
            </p>

            <div className="relative mb-6">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-blue-700 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Broadcaster">Broadcaster</option>
                <option value="Moderator">Moderator</option>
                <option value="Attendee">Attendee</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowChangeRoleDialog(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChangeRole}
                className="flex-1 bg-white hover:bg-gray-100 text-blue-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove User Dialog */}
      {showRemoveUserDialog && (
        <RemoveUserDialog
          participantName={selectedParticipant}
          onCancel={() => setShowRemoveUserDialog(false)}
          onConfirm={handleConfirmRemoveUser}
        />
      )}

      {/* Screen Share Dialog */}
      {showScreenShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Share screen
            </h3>
            <p className="text-sm text-blue-100 mb-6">
              This meeting wants to share the contents of your screen.
            </p>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-blue-500">
              {["Entire screen", "Window", "Chrome Tab"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedScreenTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedScreenTab === tab
                      ? "text-white border-b-2 border-white"
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Screen selection grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2].map((screenNum) => (
                <button
                  key={screenNum}
                  onClick={() => setSelectedScreen(screenNum)}
                  className={`relative rounded-lg overflow-hidden transition-all ${
                    selectedScreen === screenNum
                      ? "ring-4 ring-white"
                      : "ring-2 ring-blue-400 hover:ring-white"
                  }`}
                >
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">
                      Screen {screenNum} Preview
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-700/90 text-white text-sm py-2 text-center font-medium">
                    Screen {screenNum}
                  </div>
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowScreenShareDialog(false)}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartScreenShare}
                disabled={selectedScreen === null}
                className={`font-medium py-2.5 px-6 rounded-lg transition-colors ${
                  selectedScreen !== null
                    ? "bg-white hover:bg-gray-100 text-blue-600"
                    : "bg-white/50 text-blue-300 cursor-not-allowed"
                }`}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Session Dialog */}
      {showEndSessionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  End Session
                </h3>
                <p className="text-sm text-blue-100">
                  The session will end for everyone and all the activities will
                  stop. You can't undo this action.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEndSessionDialog(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Don't End
              </button>
              <button
                onClick={handleConfirmEndSession}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* External Video Dialog */}
      {showExternalVideoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Add link</h3>

            <input
              type="url"
              value={externalVideoUrl}
              onChange={(e) => setExternalVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-blue-700/50 text-white placeholder-blue-200 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent mb-6"
              autoFocus
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowExternalVideoDialog(false);
                  setExternalVideoUrl("");
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCastExternalVideo}
                disabled={!externalVideoUrl.trim()}
                className={`font-medium py-2.5 px-6 rounded-lg transition-colors ${
                  externalVideoUrl.trim()
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/50 text-blue-300 cursor-not-allowed"
                }`}
              >
                Cast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Video Dialog */}
      {showEndVideoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  End Video
                </h3>
                <p className="text-sm text-blue-100">
                  The session will end for everyone.
                  <br />
                  You can't undo this action.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelEndVideo}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Don't End
              </button>
              <button
                onClick={handleConfirmEndVideo}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                End eCinema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload/Presentation Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Presentation</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="bg-blue-700/50 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUploadDialog(false);
                  }}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {uploadedFiles.length > 0 ? "Upload" : "Confirm"}
                </button>
              </div>
            </div>

            <p className="text-sm text-blue-100 mb-6">
              As a presenter you have the ability to upload any office document
              or PDF file. We recommend PDF file for best results. Please ensure
              that a presentation is selected using the circle checkbox on the
              left hand side.
            </p>

            {/* Current Presentation Section */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">
                    Current presentation
                  </h4>
                  <h4 className="text-white font-medium">Actions</h4>
                </div>

                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-700/30 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleSetCurrentPresentation(file.name)
                          }
                          className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                            file.isCurrent ? "bg-white" : "bg-transparent"
                          }`}
                        >
                          {file.isCurrent && (
                            <svg
                              className="w-3 h-3 text-blue-600"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-white text-sm">{file.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.isCurrent && (
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            CURRENT
                          </span>
                        )}
                        <button className="text-white hover:text-blue-200 p-1">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePresentation(file.name)}
                          className="text-white hover:text-red-300 p-1"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-blue-100 mb-4">
              In the "Export options" menu you have the option to enable
              download of the original presentation and to provide users with a
              downloadable link with annotations in public chat.
            </p>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors ${
                isDragging
                  ? "border-white bg-blue-700/30"
                  : "border-blue-400 bg-transparent"
              }`}
            >
              <svg
                className="w-16 h-16 text-white mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-white text-lg mb-2">
                Drag files here to upload
              </p>
              <label className="text-blue-200 hover:text-white cursor-pointer underline">
                or browse for files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploadingFiles.length > 0 && (
        <div className="fixed bottom-24 left-6 z-50 bg-blue-600 rounded-lg shadow-2xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-white font-medium">
                Uploading {uploadingFiles.length} item
                {uploadingFiles.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white hover:text-blue-200 p-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="17 11 12 6 7 11" />
                  <polyline points="17 18 12 13 7 18" />
                </svg>
              </button>
              <button
                onClick={() => setUploadingFiles([])}
                className="text-white hover:text-blue-200 p-1"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {uploadingFiles.map((file, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-white text-sm flex-1 truncate">
                    {file.name}
                  </span>
                  <span className="text-blue-200 text-xs">
                    {file.progress < 100
                      ? `Uploading (${file.progress}%)`
                      : "Complete"}
                  </span>
                </div>
                <div className="w-full bg-blue-800/50 rounded-full h-1.5">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Poll Creation Dialog */}
      {showPollDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Polls</h3>

            <div className="space-y-4">
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question"
                className="w-full px-4 py-3 bg-blue-700/50 text-white placeholder-blue-200 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                autoFocus
              />

              {pollAnswers.map((answer, index) => (
                <input
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(e) =>
                    handlePollAnswerChange(index, e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                  className="w-full px-4 py-3 bg-blue-500/40 text-white placeholder-blue-200 rounded-lg border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              ))}

              <button
                onClick={handleAddPollAnswer}
                className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
              >
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <PlusIcon className="w-4 h-4" />
                </div>
                <span className="font-medium">Add answers</span>
              </button>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => {
                  setShowPollDialog(false);
                  setPollQuestion("");
                  setPollAnswers(["", "", ""]);
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishPoll}
                disabled={
                  !pollQuestion.trim() || !pollAnswers.some((a) => a.trim())
                }
                className={`font-medium py-2.5 px-6 rounded-lg transition-colors ${
                  pollQuestion.trim() && pollAnswers.some((a) => a.trim())
                    ? "bg-white hover:bg-gray-100 text-blue-600"
                    : "bg-white/50 text-blue-300 cursor-not-allowed"
                }`}
              >
                Publish Polls
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Polls Button (when poll is hidden but active) */}
      {activePoll && !showPollResults && !showWhiteboard && (
        <button
          onClick={() => setShowPollResults(true)}
          className="fixed top-24 right-6 z-20 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          View Polls
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      )}

      {/* Random Participant Dialog */}
      {showRandomParticipantDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Randomly selected participant
            </h3>

            {!selectedRandomParticipant ? (
              <div className="text-center">
                <p className="text-blue-100 mb-8">
                  Select any participant randomly by clicking on the button
                  below.
                </p>
                <button
                  onClick={handleRandomSelect}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold shadow-xl">
                    {selectedRandomParticipant.initials}
                  </div>
                </div>
                <p className="text-white text-2xl font-semibold mb-8">
                  {selectedRandomParticipant.name}
                </p>
                <button
                  onClick={handleRandomSelect}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Select
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowRandomParticipantDialog(false);
                setSelectedRandomParticipant(null);
              }}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute inset-0 bg-black/20 pointer-events-auto"
            onClick={() => setShowSettingsDialog(false)}
          />
          <div className="relative bg-blue-600 w-[90%] max-w-sm sm:max-w-3xl h-[70vh] sm:h-auto sm:max-h-[90vh] shadow-2xl flex flex-col sm:flex-row rounded-2xl overflow-hidden pointer-events-auto transition-all">
            {/* Left sidebar - Menu */}
            <div
              className={`w-full sm:w-80 bg-blue-600 sm:bg-blue-700/30 p-6 ${
                activeMobileView === "menu" ? "block" : "hidden sm:block"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Settings</h2>
                </div>
                <button
                  onClick={() => setShowSettingsDialog(false)}
                  className="sm:hidden text-white hover:text-blue-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSettingsTab("Device Settings");
                    setActiveMobileView("content");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    settingsTab === "Device Settings"
                      ? "bg-blue-500/50 sm:bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Device Settings</span>
                  <ChevronDownIcon className="w-4 h-4 ml-auto -rotate-90 sm:hidden" />
                </button>
                <button
                  onClick={() => {
                    setSettingsTab("Notifications");
                    setActiveMobileView("content");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    settingsTab === "Notifications"
                      ? "bg-blue-500/50 sm:bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="font-medium">Notifications</span>
                  <ChevronDownIcon className="w-4 h-4 ml-auto -rotate-90 sm:hidden" />
                </button>
                <button
                  onClick={() => {
                    setSettingsTab("Waiting Room");
                    setActiveMobileView("content");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    settingsTab === "Waiting Room"
                      ? "bg-blue-500/50 sm:bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  <UsersIcon className="w-5 h-5" />
                  <span className="font-medium">Waiting Room</span>
                  <ChevronDownIcon className="w-4 h-4 ml-auto -rotate-90 sm:hidden" />
                </button>
              </div>
            </div>

            {/* Right content */}
            <div
              className={`flex-1 bg-blue-600 p-6 relative overflow-y-auto ${
                activeMobileView === "content" ? "block" : "hidden sm:block"
              }`}
            >
              {/* Mobile Header for Content View */}
              <div className="flex items-center justify-between mb-6 sm:hidden">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveMobileView("menu")}
                    className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
                    </svg>
                  </button>
                  <h3 className="text-xl font-semibold text-white">
                    {settingsTab}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettingsDialog(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Desktop Close button */}
              <button
                onClick={() => setShowSettingsDialog(false)}
                className="hidden sm:block absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {settingsTab === "Device Settings" && (
                <div>
                  <h3 className="hidden sm:block text-xl font-semibold text-white mb-6">
                    Device Settings
                  </h3>

                  <div className="space-y-5">
                    {/* Video */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">
                        Video
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCamera}
                          onChange={(e) => setSelectedCamera(e.target.value)}
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="HD Camera">HD Camera</option>
                          <option value="Built-in Camera">
                            Built-in Camera
                          </option>
                          <option value="External Camera">
                            External Camera
                          </option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Video Quality */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">
                        Video Quality
                      </label>
                      <div className="relative">
                        <select
                          value={selectedVideoQuality}
                          onChange={(e) =>
                            setSelectedVideoQuality(e.target.value)
                          }
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="High Definition">
                            High Definition
                          </option>
                          <option value="Standard Definition">
                            Standard Definition
                          </option>
                          <option value="Low Definition">Low Definition</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Microphone */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">
                        Microphone
                      </label>
                      <div className="relative">
                        <select
                          value={selectedMicrophone}
                          onChange={(e) =>
                            setSelectedMicrophone(e.target.value)
                          }
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="Default - Intel HP Mic (Built-in)">
                            Default - Intel HP Mic (Built-in)
                          </option>
                          <option value="External Microphone">
                            External Microphone
                          </option>
                          <option value="Headset Microphone">
                            Headset Microphone
                          </option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Speakers */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">
                        Speakers
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="Default - Intel HP Spea...">
                              Default - Intel HP Spea...
                            </option>
                            <option value="External Speakers">
                              External Speakers
                            </option>
                            <option value="Headphones">Headphones</option>
                          </select>
                          <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <button className="bg-blue-700/50 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-blue-500">
                          Test
                        </button>
                      </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-blue-500/30">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        <span className="text-white font-medium">
                          Dark Mode
                        </span>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-blue-700/50 transition-colors">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform translate-x-0" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === "Notifications" && (
                <div>
                  <h3 className="hidden sm:block text-xl font-semibold text-white mb-6">
                    Notifications
                  </h3>

                  <div className="space-y-4">
                    {/* Leave */}
                    <div className="flex items-center justify-between py-3 border-b border-blue-500/30">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="text-white font-medium">Leave</span>
                      </div>
                      <button
                        onClick={() => setNotificationLeave(!notificationLeave)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationLeave ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationLeave
                              ? "translate-x-6 bg-blue-600"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* New Message */}
                    <div className="flex items-center justify-between py-3 border-b border-blue-500/30">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="text-white font-medium">
                          New Message
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationNewMessage(!notificationNewMessage)
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationNewMessage ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationNewMessage
                              ? "translate-x-6 bg-blue-600"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Hand Raise */}
                    <div className="flex items-center justify-between py-3 border-b border-blue-500/30">
                      <div className="flex items-center gap-3">
                        <HandIcon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">
                          Hand Raise
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationHandRaise(!notificationHandRaise)
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationHandRaise ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationHandRaise
                              ? "translate-x-6 bg-blue-600"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Error */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span className="text-white font-medium">Error</span>
                      </div>
                      <button
                        onClick={() => setNotificationError(!notificationError)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationError ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationError
                              ? "translate-x-6 bg-blue-600"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === "Waiting Room" && (
                <div>
                  <h3 className="hidden sm:block text-xl font-semibold text-white mb-6">
                    Waiting Room
                  </h3>

                  <div className="flex gap-3 mb-6">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Allow Everyone
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Deny Everyone
                    </button>
                  </div>

                  <div className="space-y-4">
                    {waitingUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.imageSrc}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                          />
                          <span className="text-white font-medium">
                            {user.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 rounded-full border border-blue-300 text-white hover:bg-blue-700 transition-colors text-sm font-medium">
                            Allow
                          </button>
                          <button className="px-4 py-1.5 rounded-full border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium">
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RemoveUserDialog({
  participantName,
  onCancel,
  onConfirm,
}: {
  participantName: string;
  onCancel: () => void;
  onConfirm: (preventRejoin: boolean) => void;
}) {
  const [preventRejoin, setPreventRejoin] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Remove user ({participantName})
        </h3>

        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={preventRejoin}
            onChange={(e) => setPreventRejoin(e.target.checked)}
            className="w-4 h-4 rounded border-2 border-white bg-transparent checked:bg-white checked:border-white focus:ring-2 focus:ring-white/50"
          />
          <span className="text-sm text-white">
            Prevent this user from rejoining the session.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            No
          </button>
          <button
            onClick={() => onConfirm(preventRejoin)}
            className="flex-1 bg-white hover:bg-gray-100 text-blue-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
