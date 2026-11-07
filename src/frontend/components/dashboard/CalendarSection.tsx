"use client";

import React, { useState } from "react";
import { Meeting, CalendarViewType } from "@shared/types/meeting";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@shared/utils/utils";

interface CalendarSectionProps {
  onSelectMeeting: (meeting: Meeting) => void;
  onRequestSchedule: (prompt: string) => void;
}

// Labeled placeholder preview data
export const PREVIEW_MEETINGS: Meeting[] = [
  {
    id: "m-1",
    title: "Product Architecture Review",
    description: "Review Next.js App Router, Mastra agent orchestration, and PostgreSQL persistence architecture.",
    date: "2026-11-07",
    startTime: "10:00",
    endTime: "11:00",
    attendees: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Sarah Tech Lead", email: "sarah@example.com" },
    ],
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "confirmed",
    category: "planning",
  },
  {
    id: "m-2",
    title: "1-on-1 Mentorship Sync",
    description: "Weekly sync on agentic tools, prompt design, and portfolio milestones.",
    date: "2026-11-07",
    startTime: "13:30",
    endTime: "14:15",
    attendees: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Alex Mentor", email: "alex@example.com" },
    ],
    meetLink: "https://meet.google.com/uvw-xyza-bcd",
    status: "confirmed",
    category: "1on1",
  },
  {
    id: "m-3",
    title: "Sprint Standup & Goal Setting",
    description: "Daily synchronization of deliverables and dependency resolution.",
    date: "2026-11-08",
    startTime: "09:30",
    endTime: "10:00",
    attendees: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Dev Team", email: "team@example.com" },
    ],
    status: "confirmed",
    category: "standup",
  },
  {
    id: "m-4",
    title: "External Client Demo: AI Assistant",
    description: "Showcase automated scheduling workflows and human-in-the-loop action approval.",
    date: "2026-11-09",
    startTime: "15:00",
    endTime: "16:00",
    attendees: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Client Partner", email: "partner@enterprise.com" },
    ],
    meetLink: "https://meet.google.com/qrs-tuvw-xyz",
    status: "confirmed",
    category: "client",
  },
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const weekDays = [
  { day: "Mon", date: "Nov 3", fullDate: "2026-11-03" },
  { day: "Tue", date: "Nov 4", fullDate: "2026-11-04" },
  { day: "Wed", date: "Nov 5", fullDate: "2026-11-05" },
  { day: "Thu", date: "Nov 6", fullDate: "2026-11-06" },
  { day: "Fri", date: "Nov 7", fullDate: "2026-11-07", isToday: true },
];

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  onSelectMeeting,
  onRequestSchedule,
}) => {
  const [view, setView] = useState<CalendarViewType>("day");
  const selectedDate = "2026-11-07";

  const categoryColor = (category: string) => {
    switch (category) {
      case "planning":
        return "bg-indigo-600/20 border-indigo-500/50 text-indigo-300";
      case "1on1":
        return "bg-purple-600/20 border-purple-500/50 text-purple-300";
      case "client":
        return "bg-amber-600/20 border-amber-500/50 text-amber-300";
      case "standup":
        return "bg-emerald-600/20 border-emerald-500/50 text-emerald-300";
      default:
        return "bg-slate-700/30 border-slate-600 text-slate-300";
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900/50 p-4 lg:p-6 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>UI Preview Mode:</strong> Displaying labelled mock events. Live Google Calendar
            OAuth sync will be wired in <strong>Stage 5</strong>.
          </span>
        </div>
        <button
          onClick={() => onRequestSchedule("Find a free meeting slot tomorrow.")}
          className="hidden sm:flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/30"
        >
          <Sparkles className="h-3 w-3" />
          Test AI Slot Finder
        </button>
      </div>

      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Calendar Schedule</h2>
            <p className="text-xs text-slate-400">Friday, November 7, 2026</p>
          </div>
        </div>

        {/* View Switcher & Nav Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
            <button
              onClick={() => setView("day")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === "day"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Daily View
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === "week"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Weekly View
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="rounded-lg border border-slate-800 bg-slate-800/60 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              Today
            </button>
            <button
              className="rounded-lg border border-slate-800 bg-slate-800/60 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="mt-4 flex-1">
        {view === "day" ? (
          /* Daily View Grid */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Timeline Column (3/4) */}
            <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-medium text-slate-400">Timeline (Today)</span>
                <span className="text-[11px] font-mono text-indigo-400">Timezone: Local (IST)</span>
              </div>

              <div className="mt-3 space-y-3">
                {timeSlots.map((time) => {
                  const matchingMeetings = PREVIEW_MEETINGS.filter(
                    (m) => m.date === selectedDate && m.startTime.startsWith(time.split(":")[0])
                  );

                  return (
                    <div key={time} className="flex items-start gap-4 group">
                      <span className="w-12 text-right font-mono text-xs text-slate-500 pt-1">
                        {time}
                      </span>
                      <div className="relative flex-1 min-h-[52px] rounded-lg border border-dashed border-slate-800/80 p-1 group-hover:border-slate-700">
                        {matchingMeetings.length > 0 ? (
                          matchingMeetings.map((meeting) => (
                            <div
                              key={meeting.id}
                              onClick={() => onSelectMeeting(meeting)}
                              className={cn(
                                "flex cursor-pointer items-center justify-between rounded-lg border p-2.5 shadow-sm transition-all hover:scale-[1.01]",
                                categoryColor(meeting.category)
                              )}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs text-white">
                                    {meeting.title}
                                  </span>
                                  <span className="rounded bg-slate-800/70 px-1.5 py-0.2 text-[10px] text-slate-300">
                                    {meeting.category}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-300">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {meeting.startTime} - {meeting.endTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {meeting.attendees.length} attendees
                                  </span>
                                </div>
                              </div>
                              <span className="rounded bg-indigo-500/20 px-2 py-1 text-[10px] font-medium text-indigo-300">
                                View Details
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center px-3 text-[11px] text-slate-600">
                            Available slot
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Summary Card (1/4) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Upcoming Meetings
                </h3>
                <div className="space-y-2.5">
                  {PREVIEW_MEETINGS.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => onSelectMeeting(meeting)}
                      className="cursor-pointer rounded-lg border border-slate-800/90 bg-slate-900/60 p-2.5 transition-all hover:border-indigo-500/50 hover:bg-slate-850"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white truncate">
                          {meeting.title}
                        </span>
                        <span className="text-[10px] font-medium text-indigo-400">
                          {meeting.date.slice(5)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {meeting.startTime} - {meeting.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick AI Action Card */}
              <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-4">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Agent Scheduling</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  The AI Agent can automatically detect conflicts, propose optimal slots, and
                  synchronize calendar invites.
                </p>
                <button
                  onClick={() => onRequestSchedule("Schedule a meeting for tomorrow.")}
                  className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white shadow hover:bg-indigo-500 transition-colors"
                >
                  Schedule with Agent
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Weekly View Grid */
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="grid grid-cols-5 gap-3">
              {weekDays.map((wd) => {
                const dayMeetings = PREVIEW_MEETINGS.filter((m) => m.date === wd.fullDate);
                return (
                  <div
                    key={wd.fullDate}
                    className={cn(
                      "rounded-lg border p-3 flex flex-col min-h-[360px]",
                      wd.isToday
                        ? "border-indigo-500/40 bg-indigo-950/10"
                        : "border-slate-800/80 bg-slate-900/30"
                    )}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                      <span className="text-xs font-semibold text-slate-300">{wd.day}</span>
                      <span
                        className={cn(
                          "text-[11px] px-1.5 py-0.2 rounded font-mono",
                          wd.isToday
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-slate-400"
                        )}
                      >
                        {wd.date}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {dayMeetings.length > 0 ? (
                        dayMeetings.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => onSelectMeeting(m)}
                            className={cn(
                              "cursor-pointer rounded-lg border p-2 text-xs transition-all hover:scale-[1.02]",
                              categoryColor(m.category)
                            )}
                          >
                            <p className="font-semibold text-white truncate">{m.title}</p>
                            <p className="text-[10px] text-slate-300 mt-1 font-mono">
                              {m.startTime} - {m.endTime}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-[11px] text-slate-600 italic">
                          No events
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

