"use client";

import React from "react";
import { Meeting } from "@shared/types/meeting";
import { PREVIEW_MEETINGS } from "./CalendarSection";
import { Clock, Calendar, Users, Sparkles } from "lucide-react";

interface UpcomingMeetingsViewProps {
  onSelectMeeting: (meeting: Meeting) => void;
  onRequestSchedule: (prompt: string) => void;
}

export const UpcomingMeetingsView: React.FC<UpcomingMeetingsViewProps> = ({
  onSelectMeeting,
  onRequestSchedule,
}) => {
  return (
    <div className="flex h-full flex-col p-4 lg:p-8 overflow-y-auto bg-slate-900/40">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-white">Upcoming Meetings & Agendas</h2>
          <p className="text-xs text-slate-400">
            Chronological view of confirmed sessions and planned discussions
          </p>
        </div>
        <button
          onClick={() => onRequestSchedule("Schedule a new sync session.")}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 shadow-sm transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Meeting via AI</span>
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {PREVIEW_MEETINGS.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting)}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-850"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 uppercase">
                    {meeting.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {meeting.title}
                  </h3>
                </div>
                {meeting.description && (
                  <p className="text-xs text-slate-400 line-clamp-1">{meeting.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{meeting.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>
                    {meeting.startTime} - {meeting.endTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span>{meeting.attendees.map((a) => a.name).join(", ")}</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-medium group-hover:underline">
                View & Edit Details →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

