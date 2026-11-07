"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";
import { CalendarSection } from "./CalendarSection";
import { UpcomingMeetingsView } from "./UpcomingMeetingsView";
import { SettingsView } from "./SettingsView";
import { MeetingDetailsModal } from "./MeetingDetailsModal";
import { Meeting } from "@shared/types/meeting";
import {
  Menu,
  Columns,
  Sparkles,
} from "lucide-react";
import { cn } from "@shared/utils/utils";

export const DashboardShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "calendar" | "meetings" | "settings">("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSplitView, setIsSplitView] = useState<boolean>(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleRequestSchedule = (prompt: string) => {
    setActivePrompt(prompt);
    setActiveTab("chat");
  };

  const handleRescheduleWithAI = (meeting: Meeting) => {
    setActivePrompt(`Reschedule my "${meeting.title}" meeting currently on ${meeting.date} at ${meeting.startTime} to a different available slot.`);
    setActiveTab("chat");
  };

  const handleCancelWithAI = (meeting: Meeting) => {
    setActivePrompt(`Cancel the "${meeting.title}" meeting scheduled on ${meeting.date} at ${meeting.startTime}.`);
    setActiveTab("chat");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => {
          setActivePrompt("Hello! What is my schedule today?");
          setActiveTab("chat");
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold capitalize text-white">
                {activeTab === "chat" ? "Agentic Assistant" : activeTab}
              </span>
              <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-700" />
              <span className="hidden sm:inline-block text-[11px] text-slate-400">
                AI Meeting Orchestrator
              </span>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2">
            {activeTab === "chat" && (
              <button
                onClick={() => setIsSplitView(!isSplitView)}
                className={cn(
                  "hidden lg:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isSplitView
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                )}
                title="Toggle Split Screen View (Chat + Calendar)"
              >
                <Columns className="h-3.5 w-3.5" />
                <span>{isSplitView ? "Split Screen On" : "Split Screen"}</span>
              </button>
            )}

            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Gemini Agent</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* View Routing / Render */}
        <main className="flex-1 overflow-hidden">
          {activeTab === "chat" ? (
            isSplitView ? (
              /* Split Screen: Chat (50%) + Calendar (50%) on large screens */
              <div className="grid h-full grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                <div className="h-full overflow-hidden">
                  <ChatInterface
                    externalPrompt={activePrompt}
                    onClearExternalPrompt={() => setActivePrompt(undefined)}
                  />
                </div>
                <div className="hidden lg:block h-full overflow-hidden">
                  <CalendarSection
                    onSelectMeeting={handleSelectMeeting}
                    onRequestSchedule={handleRequestSchedule}
                  />
                </div>
              </div>
            ) : (
              <ChatInterface
                externalPrompt={activePrompt}
                onClearExternalPrompt={() => setActivePrompt(undefined)}
              />
            )
          ) : activeTab === "calendar" ? (
            <CalendarSection
              onSelectMeeting={handleSelectMeeting}
              onRequestSchedule={handleRequestSchedule}
            />
          ) : activeTab === "meetings" ? (
            <UpcomingMeetingsView
              onSelectMeeting={handleSelectMeeting}
              onRequestSchedule={handleRequestSchedule}
            />
          ) : (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onRescheduleWithAI={handleRescheduleWithAI}
        onCancelWithAI={handleCancelWithAI}
      />
    </div>
  );
};

