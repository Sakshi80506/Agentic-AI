"use client";

import React from "react";
import { Meeting } from "@shared/types/meeting";
import {
  X,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  RotateCcw,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface MeetingDetailsModalProps {
  meeting: Meeting | null;
  onClose: () => void;
  onRescheduleWithAI?: (meeting: Meeting) => void;
  onCancelWithAI?: (meeting: Meeting) => void;
}

export const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({
  meeting,
  onClose,
  onRescheduleWithAI,
  onCancelWithAI,
}) => {
  if (!meeting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400 capitalize">
                {meeting.category}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                Preview Data
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-300">
          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-800/50 p-2.5 border border-slate-800">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400">Date</p>
                <p className="font-medium text-white">{meeting.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-800/50 p-2.5 border border-slate-800">
              <Clock className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="font-medium text-white">
                  {meeting.startTime} - {meeting.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {meeting.description && (
            <div className="rounded-lg bg-slate-800/30 p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FileText className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Description</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{meeting.description}</p>
            </div>
          )}

          {/* Attendees */}
          <div className="rounded-lg bg-slate-800/30 p-3 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">
                  Attendees ({meeting.attendees.length})
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              {meeting.attendees.map((attendee, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-slate-800/60 px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-[10px] font-semibold text-indigo-300">
                      {attendee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{attendee.name}</p>
                      <p className="text-[10px] text-slate-400">{attendee.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400">Accepted</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Link */}
          {meeting.meetLink && (
            <a
              href={meeting.meetLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-indigo-600/20 border border-indigo-500/30 p-3 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Video className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold">Join Google Meet</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => {
              onCancelWithAI?.(meeting);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Cancel with AI
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onRescheduleWithAI?.(meeting);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-500 shadow-md transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reschedule with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

