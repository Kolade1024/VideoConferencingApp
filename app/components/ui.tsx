"use client";

import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, SoundWaveIcon, MoreIcon } from "./icons";
import { useState, useRef, useEffect } from "react";

export function Avatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover border-2 border-white"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
}

export function IconButton({
  children,
  variant = "default",
  active = false,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105";
  const variantClasses = {
    default: active ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} shadow-md ${className}`}>
      {children}
    </button>
  );
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="inline-flex bg-gray-100 rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function ParticipantCard({
  name,
  isActive,
  isMuted,
  isVideoOff,
  imageSrc,
}: {
  name: string;
  isActive?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  imageSrc?: string;
}) {
  return (
    <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden group">
      {!isVideoOff && imageSrc ? (
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <Avatar name={name} size={80} />
        </div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        {name}
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        {isMuted ? (
          <div className="bg-red-500/90 text-white p-1.5 rounded-full">
            <MicOffIcon className="w-4 h-4" />
          </div>
        ) : isActive && (
          <div className="bg-white/90 text-gray-700 p-1.5 rounded-full">
            <SoundWaveIcon className="w-4 h-4" />
          </div>
        )}
        {isVideoOff && (
          <div className="bg-black/70 text-white p-1.5 rounded-full">
            <VideoOffIcon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export function ParticipantListItem({
  name,
  imageSrc,
  isMuted,
  isVideoOff,
  isYou,
  onMenuClick,
}: {
  name: string;
  imageSrc?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isYou?: boolean;
  onMenuClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3">
        <Avatar name={name} src={imageSrc} size={36} />
        <span className="text-sm font-medium text-gray-900">{isYou ? "You" : name}</span>
        {isYou && (
          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isMuted ? (
          <MicOffIcon className="w-4 h-4 text-red-500" />
        ) : (
          <MicIcon className="w-4 h-4 text-blue-600" />
        )}
        {isVideoOff ? (
          <VideoOffIcon className="w-4 h-4 text-gray-400" />
        ) : (
          <VideoIcon className="w-4 h-4 text-blue-600" />
        )}
        {!isYou && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
          >
            <MoreIcon className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({
  name,
  message,
  time,
  imageSrc,
  isYou,
}: {
  name: string;
  message: string;
  time: string;
  imageSrc?: string;
  isYou?: boolean;
}) {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar name={name} src={imageSrc} size={32} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-900">{isYou ? "You" : name}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-gray-800">
          {message}
        </div>
      </div>
    </div>
  );
}

export function ParticipantMenu({
  participantName,
  position,
  onClose,
  onChangeRole,
  onMuteUser,
  onPrivateChat,
  onRemoveUser,
}: {
  participantName: string;
  position: { top: number; left: number };
  onClose: () => void;
  onChangeRole: () => void;
  onMuteUser: () => void;
  onPrivateChat: () => void;
  onRemoveUser: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-blue-600 text-white rounded-lg shadow-2xl py-2 w-48 z-50"
      style={{ top: position.top, left: position.left }}
    >
      <button
        onClick={onChangeRole}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-700 flex items-center gap-3"
      >
        <RefreshIcon className="w-4 h-4" />
        Change Role
      </button>
      <button
        onClick={onMuteUser}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-700 flex items-center gap-3"
      >
        <MicOffIcon className="w-4 h-4" />
        Mute User
      </button>
      <button
        onClick={onPrivateChat}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-700 flex items-center gap-3"
      >
        <MessageSquareIcon className="w-4 h-4" />
        private chat
      </button>
      <button
        onClick={onRemoveUser}
        className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-700 flex items-center gap-3"
      >
        <UserMinusIcon className="w-4 h-4" />
        Remove User
      </button>
    </div>
  );
}

function RefreshIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  );
}

function MessageSquareIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function UserMinusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  );
}
