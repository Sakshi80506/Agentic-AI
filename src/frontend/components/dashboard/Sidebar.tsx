"use client";

import React from "react";
import {
  Bot,
  Calendar as CalendarIcon,
  MessageSquare,
  Clock,
  Settings,
  Plus,
  LogOut,
  Sparkles,
  ShieldCheck,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@shared/utils/utils";

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface SidebarProps {
  activeTab: "chat" | "calendar" | "meetings" | "settings";
  setActiveTab: (tab: "chat" | "calendar" | "meetings" | "settings") => void;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  conversations?: ConversationSummary[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  userProfile?: {
    name?: string | null;
    email?: string | null;
    profileImage?: string | null;
  } | null;
  onLogout?: () => void;
  isLoadingConversations?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onNewChat,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  userProfile,
  onLogout,
  isLoadingConversations = false,
}) => {
  const displayName = userProfile?.name || "Productivity User";
  const displayEmail = userProfile?.email || "user@descope.com";
  const userInitials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* App Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-white tracking-tight">Agentic AI</span>
                <span className="rounded bg-indigo-500/10 dark:bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-300">
                  v0.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Meeting & Productivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              setActiveTab("chat");
              onClose();
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 px-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-2 space-y-1">
          <button
            onClick={() => {
              setActiveTab("chat");
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              activeTab === "chat"
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/15 dark:text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("calendar");
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              activeTab === "calendar"
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/15 dark:text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar View</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("meetings");
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              activeTab === "meetings"
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/15 dark:text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Clock className="h-4 w-4" />
            <span>Upcoming Meetings</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("settings");
              onClose();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              activeTab === "settings"
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/15 dark:text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* PostgreSQL Chat History Section */}
        <div className="mt-2 flex-1 overflow-y-auto px-3 py-2">
          <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Conversations (Neon DB)</span>
            <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
          </div>

          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-6 text-xs text-slate-500 gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
              <span>Loading history...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-800 p-3 text-center text-xs text-slate-500">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((item) => {
                const isActive = activeConversationId === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors",
                      isActive
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-600/20 dark:text-white dark:border-indigo-500/30 font-medium"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                    )}
                  >
                    <button
                      onClick={() => {
                        onSelectConversation?.(item.id);
                        setActiveTab("chat");
                        onClose();
                      }}
                      className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                    >
                      <MessageSquare
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </button>

                    {onDeleteConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this conversation?")) {
                            onDeleteConversation(item.id);
                          }
                        }}
                        title="Delete conversation"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Database & Auth Status */}
        <div className="mx-3 mb-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Backend Systems
            </span>
            <span className="text-[10px] rounded bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
              Stage 2 Live
            </span>
          </div>
          <div className="mt-2 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Descope Auth</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">Google OAuth</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Neon PostgreSQL</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">Prisma ORM</span>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 p-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-transparent p-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {userProfile?.profileImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userProfile.profileImage}
                  alt={displayName}
                  className="h-8 w-8 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 font-semibold text-xs text-indigo-600 dark:text-indigo-300">
                  {userInitials}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="truncate text-xs font-medium text-slate-900 dark:text-white">{displayName}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                  <span className="truncate text-[10px] text-slate-500 dark:text-slate-400">{displayEmail}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400 shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
