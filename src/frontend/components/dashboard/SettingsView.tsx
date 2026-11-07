"use client";

import React from "react";
import { Key } from "lucide-react";

export const SettingsView: React.FC = () => {
  const roadmapStages = [
    {
      stage: "Stage 1",
      title: "Project Initialization, Architecture & Dashboard UI",
      status: "Completed",
      desc: "Clean frontend/backend folder separation, responsive dashboard shell, interactive preview components.",
      active: true,
    },
    {
      stage: "Stage 2",
      title: "Descope Auth & PostgreSQL Integration",
      status: "In Progress",
      desc: "Descope OAuth Google sign-in and Neon serverless PostgreSQL with Prisma.",
      active: true,
    },
    {
      stage: "Stage 3",
      title: "Mastra Agent & Gemini API Integration",
      status: "Upcoming",
      desc: "Mastra agentic workflow, system instructions, and Google Gemini free tier connection.",
      active: false,
    },
    {
      stage: "Stage 4",
      title: "Conversational AI & Custom Agent Tools",
      status: "Upcoming",
      desc: "Mastra tool definitions for calendar operations and schedule analysis.",
      active: false,
    },
    {
      stage: "Stage 5",
      title: "Google OAuth & Calendar API Integration",
      status: "Upcoming",
      desc: "Live synchronization of Google Calendar events, token refresh, and meeting creation.",
      active: false,
    },
    {
      stage: "Stage 6",
      title: "Meeting Scheduling, Rescheduling & Cancellation",
      status: "Upcoming",
      desc: "Automated slot discovery, participant conflicts, and human approval flow.",
      active: false,
    },
    {
      stage: "Stage 7",
      title: "Persistent Contextual Memory",
      status: "Upcoming",
      desc: "PostgreSQL conversational recall and participant preference storage.",
      active: false,
    },
    {
      stage: "Stage 8",
      title: "Email Notifications & Human Approvals",
      status: "Upcoming",
      desc: "Gmail API integration and interactive confirmation cards.",
      active: false,
    },
    {
      stage: "Stage 9",
      title: "Testing, Security & Vercel Deployment",
      status: "Upcoming",
      desc: "End-to-end testing, secret validation, and production deployment on Vercel.",
      active: false,
    },
  ];

  return (
    <div className="flex h-full flex-col p-4 lg:p-8 overflow-y-auto bg-slate-900/40">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">System Settings & Architecture Roadmap</h2>
        <p className="text-xs text-slate-400">
          Modular development tracking with separate Frontend and Backend layers
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Environment Overview */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-indigo-400" />
            <span>Separation of Concerns Overview</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Frontend UI components reside in <code className="text-emerald-400">src/frontend</code> and
            never touch secrets or direct database connections. Server-side logic, Prisma ORM, and
            Mastra Agent reside strictly in <code className="text-indigo-400">src/backend</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-slate-400">Frontend Layer</span>
              <p className="font-semibold text-white mt-1">@frontend/*</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-slate-400">Backend Layer</span>
              <p className="font-semibold text-white mt-1">@backend/*</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-slate-400">Shared Models</span>
              <p className="font-semibold text-white mt-1">@shared/*</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-slate-400">Next.js App Routing</span>
              <p className="font-semibold text-white mt-1">src/app/*</p>
            </div>
          </div>
        </div>

        {/* Roadmap Milestones */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Development Stages</h3>
          <div className="space-y-3">
            {roadmapStages.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-indigo-400">{item.stage}:</span>
                    <span className="font-medium text-white">{item.title}</span>
                  </div>
                  <p className="mt-1 text-slate-400 text-[11px]">{item.desc}</p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                    item.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : item.status === "In Progress"
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

