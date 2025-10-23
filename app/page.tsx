"use client";

import { useState, useEffect, useRef } from "react";
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

export default function Home() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEndRecordingDialog, setShowEndRecordingDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  const [selectedVideoQuality, setSelectedVideoQuality] = useState("High Definition");
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Intel HP Mic (Built-in)");
  const [selectedSpeaker, setSelectedSpeaker] = useState("Default - Intel HP Spea...");
  const [notificationLeave, setNotificationLeave] = useState(true);
  const [notificationNewMessage, setNotificationNewMessage] = useState(true);
  const [notificationHandRaise, setNotificationHandRaise] = useState(true);
  const [notificationError, setNotificationError] = useState(true);
  
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
      if (endCallMenuRef.current && !endCallMenuRef.current.contains(event.target as Node)) {
        setShowEndCallMenu(false);
      }
    }

    if (showEndCallMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  // Format recording time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  const handleMenuClick = (participantName: string, event: React.MouseEvent) => {
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
    console.log("Remove user:", selectedParticipant, "Prevent rejoin:", preventRejoin);
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
      if (externalVideoUrl.includes('youtube.com/watch?v=')) {
        const videoId = externalVideoUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (externalVideoUrl.includes('youtu.be/')) {
        const videoId = externalVideoUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (externalVideoUrl.includes('youtube.com/embed/')) {
        embedUrl = externalVideoUrl.includes('?') ? externalVideoUrl : `${externalVideoUrl}?autoplay=1`;
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
  };

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
    { id: 1, name: "You", isYou: true, isMuted: !isMicOn, isVideoOff: !isVideoOn, imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    { id: 2, name: "Bolade ola", isMuted: true, isVideoOff: true, imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { id: 3, name: "Ajibade fola", isMuted: true, isVideoOff: false, imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: 4, name: "Kathryn Murphy", isMuted: true, isVideoOff: false, imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  ];

  const messages = [
    { id: 1, name: "Kathryn Murphy", message: "Good afternoon, everyone.", time: "11:01 AM", imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
    { id: 2, name: "Ajibade fola", message: "We will start this meeting", time: "11:02 AM", imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: 3, name: "Ajibade fola", message: "Yes, Let's start this meeting", time: "11:02 AM", imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: 4, name: "You", message: "Today, we are here to discuss last week's sales.", time: "12:04 AM", isYou: true, imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  ];

  const activeParticipant = participants[0];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left side - Meeting info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-900">[Internal] Weekly Report Marketing + Sales</h1>
              <p className="text-xs text-gray-500">June 12th, 2023 | 11:00 AM</p>
            </div>
            {/* Recording timer badge */}
            {isRecording && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">{formatTime(recordingTime)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Participants & Meeting link */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Participant avatars */}
            <div className="hidden md:flex items-center">
              <div className="flex -space-x-2">
                {participants.slice(0, 4).map((p) => (
                  <div key={p.id} className="ring-2 ring-white">
                    <Avatar name={p.name} src={p.imageSrc} size={32} />
                  </div>
                ))}
              </div>
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">+9</span>
            </div>

            {/* Meeting link */}
            <button className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
              <LinkIcon className="w-4 h-4" />
              <span>cem-jmnt-hsu</span>
            </button>

            {/* Moderator info */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200">
              <Avatar name="Adam Joseph" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" size={36} />
              <div>
                <p className="text-sm font-medium text-gray-900">Adam Joseph</p>
                <p className="text-xs text-gray-500">Moderator</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
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
          {/* Video grid */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-6">
            {isPlayingExternalVideo ? (
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
                        <p className="text-xl font-semibold mb-2">You are sharing your screen</p>
                        <button
                          onClick={handleStopScreenShare}
                          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Control bar */}
          <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-center gap-2 lg:gap-3 flex-wrap">
              <IconButton
                active={!isMicOn}
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              <IconButton
                active={isVideoOn}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
              </IconButton>

              <IconButton
                active={isScreenSharing}
                onClick={handleScreenShareClick}
              >
                <ShareScreenIcon />
              </IconButton>

              <IconButton
                active={isRecording}
                onClick={handleRecordingClick}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <RecordIcon className="w-3 h-3 text-white" />
                </div>
              </IconButton>

              <IconButton
                active={isSidebarOpen}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <ChatIcon />
              </IconButton>

              <IconButton>
                <HandIcon />
              </IconButton>

              <div ref={moreButtonRef} className="relative">
                <IconButton 
                  active={showMoreMenu}
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  <MoreIcon />
                </IconButton>

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
                        setShowMoreMenu(false);
                        // Handle Upload Files
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-700 flex items-center gap-3 text-sm"
                    >
                      <UploadIcon className="w-4 h-4" />
                      Upload Files
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Whiteboard
                      }}
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
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Polls
                      }}
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
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Handle Select Random Participant
                      }}
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

              <div className="relative">
                <IconButton variant="danger" onClick={handleEndCallClick}>
                  <PhoneIcon />
                </IconButton>

                {/* End Call Menu */}
                {showEndCallMenu && (
                  <div 
                    ref={endCallMenuRef}
                    className="absolute bottom-full right-0 mb-2 bg-blue-600 text-white rounded-xl shadow-2xl py-2 w-80 z-50"
                  >
                    <button
                      onClick={handleEndRoomForAll}
                      className="w-full px-4 py-3 text-left hover:bg-blue-700 flex items-start gap-3"
                    >
                      <StopCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">End Room For All</div>
                        <div className="text-xs text-blue-100">
                          The session will end for everyone. You can't undo this action.
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
                          Others will continue after you leave. You can join the session again.
                        </div>
                      </div>
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
                <h2 className="text-sm font-semibold text-gray-900">Participants</h2>
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
                    onMenuClick={(e) => handleMenuClick(p.name, e)}
                  />
                ))}
              </div>
            </div>

            {/* Chat section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Chats</h2>
                <Tabs tabs={["Group", "Personal"]} activeTab={chatTab} onChange={setChatTab} />
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
                <h3 className="text-lg font-semibold text-white mb-2">End Recording</h3>
                <p className="text-sm text-blue-100">
                  Are you sure you want to end recording?<br />
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
            <h3 className="text-lg font-semibold text-white mb-2">Change Role</h3>
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
            <h3 className="text-xl font-semibold text-white mb-2">Share screen</h3>
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
                    <div className="text-gray-500 text-sm">Screen {screenNum} Preview</div>
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
                <h3 className="text-lg font-semibold text-white mb-2">End Session</h3>
                <p className="text-sm text-blue-100">
                  The session will end for everyone and all the activities will stop. You can't undo this action.
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
                <h3 className="text-lg font-semibold text-white mb-2">End Video</h3>
                <p className="text-sm text-blue-100">
                  The session will end for everyone.<br />
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

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-600 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl flex">
            {/* Left sidebar */}
            <div className="w-80 bg-blue-700/30 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSettingsTab("Device Settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    settingsTab === "Device Settings"
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Device Settings</span>
                </button>
                <button
                  onClick={() => setSettingsTab("Notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    settingsTab === "Notifications"
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="font-medium">Notifications</span>
                </button>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 bg-blue-600 p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setShowSettingsDialog(false)}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {settingsTab === "Device Settings" ? (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Device Settings</h3>
                  
                  <div className="space-y-5">
                    {/* Video */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">Video</label>
                      <div className="relative">
                        <select
                          value={selectedCamera}
                          onChange={(e) => setSelectedCamera(e.target.value)}
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500"
                        >
                          <option value="HD Camera">HD Camera</option>
                          <option value="Built-in Camera">Built-in Camera</option>
                          <option value="External Camera">External Camera</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Video Quality */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">Video Quality</label>
                      <div className="relative">
                        <select
                          value={selectedVideoQuality}
                          onChange={(e) => setSelectedVideoQuality(e.target.value)}
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500"
                        >
                          <option value="High Definition">High Definition</option>
                          <option value="Standard Definition">Standard Definition</option>
                          <option value="Low Definition">Low Definition</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Microphone */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">Microphone</label>
                      <div className="relative">
                        <select
                          value={selectedMicrophone}
                          onChange={(e) => setSelectedMicrophone(e.target.value)}
                          className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500"
                        >
                          <option value="Default - Intel HP Mic (Built-in)">Default - Intel HP Mic (Built-in)</option>
                          <option value="External Microphone">External Microphone</option>
                          <option value="Headset Microphone">Headset Microphone</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Speakers */}
                    <div>
                      <label className="text-sm text-blue-100 mb-2 block">Speakers</label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="w-full bg-blue-700/50 text-white px-4 py-3 pr-10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500"
                          >
                            <option value="Default - Intel HP Spea...">Default - Intel HP Spea...</option>
                            <option value="External Speakers">External Speakers</option>
                            <option value="Headphones">Headphones</option>
                          </select>
                          <ChevronDownIcon className="w-5 h-5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <button className="bg-blue-700/50 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-blue-500">
                          Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Notifications</h3>
                  
                  <div className="space-y-4">
                    {/* Leave */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            notificationLeave ? "translate-x-6 bg-blue-600" : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* New Message */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="text-white font-medium">New Message</span>
                      </div>
                      <button
                        onClick={() => setNotificationNewMessage(!notificationNewMessage)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationNewMessage ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationNewMessage ? "translate-x-6 bg-blue-600" : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Hand Raise */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <HandIcon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Hand Raise</span>
                      </div>
                      <button
                        onClick={() => setNotificationHandRaise(!notificationHandRaise)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notificationHandRaise ? "bg-white" : "bg-blue-700/50"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                            notificationHandRaise ? "translate-x-6 bg-blue-600" : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Error */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            notificationError ? "translate-x-6 bg-blue-600" : "translate-x-0 bg-white"
                          }`}
                        />
                      </button>
                    </div>
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
          <span className="text-sm text-white">Prevent this user from rejoining the session.</span>
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
