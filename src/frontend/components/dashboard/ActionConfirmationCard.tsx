"use client";

import React, { useState } from "react";
import { ActionCardData } from "@shared/types/chat";
import { CheckCircle2, XCircle, Calendar, Clock, Users, Video } from "lucide-react";

interface ActionConfirmationCardProps {
  data: ActionCardData;
  onAction?: (actionId: string, approved: boolean) => void;
}

export const ActionConfirmationCard: React.FC<ActionConfirmationCardProps> = ({
  data,
  onAction,
}) => {
  const [currentStatus, setCurrentStatus] = useState<"pending" | "approved" | "rejected">(
    data.status
  );

  const handleApprove = () => {
    setCurrentStatus("approved");
    onAction?.(data.id, true);
  };

  const handleReject = () => {
    setCurrentStatus("rejected");
    onAction?.(data.id, false);
  };

  return (
    <div className="mt-3 rounded-xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-lg backdrop-blur transition-all">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Action Approval Required
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Tool: {data.actionType === "schedule" ? "calendar_create_event" : data.actionType}
        </span>
      </div>

      {/* Summary */}
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-white">{data.title}</h4>
        <p className="mt-1 text-xs text-slate-300">{data.summary}</p>
      </div>

      {/* Event Details Grid */}
      <div className="mt-3 space-y-2 rounded-lg bg-slate-800/60 p-3 text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium text-slate-400">Date:</span>
          <span>{data.details.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium text-slate-400">Time:</span>
          <span>{data.details.time} ({data.details.duration})</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium text-slate-400">Attendees:</span>
          <span className="truncate">{data.details.attendees.join(", ")}</span>
        </div>
        {data.details.platform && (
          <div className="flex items-center gap-2">
            <Video className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-slate-400">Platform:</span>
            <span>{data.details.platform}</span>
          </div>
        )}
      </div>

      {/* Actions / Status */}
      <div className="mt-4 flex items-center justify-between">
        {currentStatus === "pending" ? (
          <div className="flex w-full items-center justify-end gap-2">
            <button
              onClick={handleReject}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <XCircle className="h-3.5 w-3.5 text-rose-400" />
              Decline Action
            </button>
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirm & Execute Tool
            </button>
          </div>
        ) : currentStatus === "approved" ? (
          <div className="flex w-full items-center justify-between rounded-md bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">Action Approved</span>
            </div>
            <span className="text-[11px] text-emerald-300/80">Calendar event created</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between rounded-md bg-rose-950/40 border border-rose-500/30 px-3 py-2 text-xs text-rose-400">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-400" />
              <span className="font-semibold">Action Cancelled</span>
            </div>
            <span className="text-[11px] text-rose-300/80">No changes made to calendar</span>
          </div>
        )}
      </div>
    </div>
  );
};

