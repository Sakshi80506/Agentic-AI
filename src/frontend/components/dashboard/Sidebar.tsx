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
} from "lucide-react";
import { cn } from "@shared/utils/utils";

interface SidebarProps {
  activeTab: "chat" | "calendar" | "meetings" | "settings";
  setActiveTab: (tab: "chat" | "calendar" | "meetings" | "settings") => void;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

const mockChatHistory = [
  { id: "1", title: "Schedule Q3 Engineering Sync", date: "Today" },
  { id: "2", title: "Reschedule 1-on-1 with Sarah", date: "Yesterday" },
  { id: "3", title: "Check free slots for Friday", date: "Nov 5" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onNewChat,
}) => {
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* App Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white tracking-tight">Agentic AI</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Meeting & Productivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
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
                ? "bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
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
                ? "bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
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
                ? "bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
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
                ? "bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Chat History Section */}
        <div className="mt-2 flex-1 overflow-y-auto px-3 py-2">
          <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Recent Conversations</span>
            <Sparkles className="h-3 w-3 text-indigo-400" />
          </div>
          <div className="space-y-1">
            {mockChatHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab("chat");
                  onClose();
                }}
                className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{item.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Integration Status Pill */}
        <div className="mx-3 mb-2 rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Architecture Layers
            </span>
            <span className="text-[10px] rounded bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
              Clean Separation
            </span>
          </div>
          <div className="mt-2 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>Frontend Layer</span>
              <span className="text-emerald-400 font-mono">@frontend/*</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend Layer</span>
              <span className="text-indigo-400 font-mono">@backend/*</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shared Models</span>
              <span className="text-amber-400 font-mono">@shared/*</span>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-800/80 p-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 font-semibold text-xs text-indigo-300">
                JD
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-medium text-white">John Doe</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-indigo-400" />
                  <span className="text-[10px] text-slate-400">Descope Auth (Stage 2)</span>
                </div>
              </div>
            </div>
            <button
              title="Logout placeholder (Descope in Stage 2)"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

