"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, SuggestedPrompt } from "@shared/types/chat";
import { ActionConfirmationCard } from "./ActionConfirmationCard";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@shared/utils/utils";

const DEFAULT_SUGGESTIONS: SuggestedPrompt[] = [
  {
    id: "p1",
    label: "What is my schedule today?",
    prompt: "What is my schedule today?",
  },
  {
    id: "p2",
    label: "Find a free meeting slot tomorrow",
    prompt: "Find a free meeting slot tomorrow.",
  },
  {
    id: "p3",
    label: "Schedule a meeting for tomorrow",
    prompt: "Schedule a meeting for tomorrow with Sarah at 2:00 PM for 45 minutes.",
  },
  {
    id: "p4",
    label: "Show my upcoming meetings",
    prompt: "Show my upcoming meetings for this week.",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Hello! I'm your Agentic AI Meeting & Productivity Assistant. I can check your schedule, discover open calendar slots, schedule or reschedule meetings, and keep your workday organized. How can I assist you today?",
    timestamp: "10:15 AM",
  },
  {
    id: "msg-2",
    role: "user",
    content: "Schedule a sprint sync meeting with Sarah tomorrow at 2:00 PM.",
    timestamp: "10:16 AM",
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "I evaluated your schedule for tomorrow (Saturday, Nov 8). You have an open slot from 2:00 PM to 2:45 PM with no conflicts. Before I execute the calendar tool to create this event and invite Sarah, please review and confirm the action details below:",
    timestamp: "10:16 AM",
    actionCard: {
      id: "act-1",
      actionType: "schedule",
      title: "Sprint Sync Meeting",
      summary: "AI agent detected zero conflicts and drafted a 45-minute calendar invitation.",
      details: {
        title: "Sprint Sync with Sarah",
        date: "Tomorrow (Nov 8, 2026)",
        time: "2:00 PM - 2:45 PM",
        duration: "45 minutes",
        attendees: ["sarah@example.com", "you (host)"],
        platform: "Google Meet",
      },
      status: "pending",
    },
  },
];

interface ChatInterfaceProps {
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(
    (textToSend?: string) => {
      const text = textToSend || input;
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Simulate Agentic reasoning & response for the initial UI preview
      setTimeout(() => {
        let aiResponse: ChatMessage;

        const lower = text.toLowerCase();
        if (lower.includes("schedule")) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content:
              "I checked your calendar availability. You are free for this slot. I've prepared the booking request for your approval:",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            actionCard: {
              id: `act-${Date.now()}`,
              actionType: "schedule",
              title: "Confirmed Calendar Event",
              summary: "AI agent verified no overlapping events on your Google Calendar schedule.",
              details: {
                title: "Scheduled Session",
                date: "Tomorrow, 2:00 PM",
                time: "2:00 PM - 2:30 PM",
                duration: "30 minutes",
                attendees: ["participant@example.com"],
                platform: "Google Meet",
              },
              status: "pending",
            },
          };
        } else if (lower.includes("schedule today") || lower.includes("today")) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content:
              "Here is your agenda for today (Friday, Nov 7):\n\n• 10:00 AM - 11:00 AM: Product Architecture Review (Sarah)\n• 1:30 PM - 2:15 PM: 1-on-1 Mentorship Sync (Alex)\n\nYou have 4.5 hours of uninterrupted focus time available.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        } else if (lower.includes("free") || lower.includes("slot")) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content:
              "I analyzed your calendar for tomorrow. The best available meeting windows are:\n\n1. 10:30 AM - 11:30 AM (Morning focus)\n2. 2:00 PM - 3:30 PM (Afternoon open slot)\n3. 4:30 PM - 5:15 PM (End of day)\n\nWhich slot would you like me to reserve?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        } else {
          aiResponse = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: `Understood! I've logged your request: "${text}". In Stage 3 & 4, Mastra Agent and Gemini API will process this prompt with real tool-calling workflows.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1200);
    },
    [input, isLoading]
  );

  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt, handleSend, onClearExternalPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-3.5 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Assistant Session</span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mastra Agent Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Google Gemini 1.5 / 2.0 Free Tier</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-400 border border-slate-700">
            Frontend UI
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 lg:px-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3.5 max-w-3xl",
              msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-600/20">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[85%] sm:max-w-[75%]",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Action Confirmation Card if present */}
              {msg.actionCard && (
                <ActionConfirmationCard
                  data={msg.actionCard}
                  onAction={(id: string, approved: boolean) => {
                    console.log(`Action ${id} user decided:`, approved);
                  }}
                />
              )}

              <div
                className={cn(
                  "mt-2 text-[10px]",
                  msg.role === "user" ? "text-indigo-200 text-right" : "text-slate-500"
                )}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 mr-auto max-w-md">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-none border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
              <span>Agent is orchestrating tools & evaluating schedule...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Section */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 px-4 pt-3 pb-2 lg:px-8">
        <div className="flex items-center gap-1.5 pb-2 text-[11px] font-medium text-slate-400">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Suggested Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SUGGESTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSend(item.prompt)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-[11px] text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <Zap className="h-2.5 w-2.5 text-indigo-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 lg:px-8 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to find slots, schedule, reschedule, or check meetings..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-3.5 pl-4 pr-24 text-xs text-white placeholder-slate-500 shadow-inner outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <span>Send</span>
            <Send className="h-3 w-3" />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-slate-500">
          AI Agent uses Google Calendar API & Mastra tools. Critical actions require your explicit
          approval.
        </p>
      </div>
    </div>
  );
};

