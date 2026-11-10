"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDescope, useSession, useUser } from "@descope/nextjs-sdk/client";
import { Sidebar, ConversationSummary } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";
import { CalendarSection } from "./CalendarSection";
import { UpcomingMeetingsView } from "./UpcomingMeetingsView";
import { SettingsView } from "./SettingsView";
import { MeetingDetailsModal } from "./MeetingDetailsModal";
import { Meeting } from "@shared/types/meeting";
import { ChatMessage } from "@shared/types/chat";
import {
  Menu,
  Columns,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@frontend/context/ThemeContext";
import { cn } from "@shared/utils/utils";

export const DashboardShell: React.FC = () => {
  const router = useRouter();
  const descope = useDescope();
  const { isAuthenticated } = useSession();
  const { user: descopeUser } = useUser();

  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"chat" | "calendar" | "meetings" | "settings">("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSplitView, setIsSplitView] = useState<boolean>(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  // Database State (Neon PostgreSQL)
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [dbUserProfile, setDbUserProfile] = useState<{
    name?: string | null;
    email?: string | null;
    profileImage?: string | null;
  } | null>(null);

  // 1. Fetch User Profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setDbUserProfile(data.user);
      } else if (descopeUser) {
        setDbUserProfile({
          name: descopeUser.name || "User",
          email: descopeUser.email || "",
          profileImage: descopeUser.picture || null,
        });
      }
    } catch (err) {
      console.warn("Could not fetch user profile from DB (using session fallback):", err);
    }
  }, [descopeUser]);

  // 2. Fetch Conversations from PostgreSQL
  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        // Automatically select the first conversation if none selected
        if (data.conversations && data.conversations.length > 0 && !activeConversationId) {
          setActiveConversationId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.warn("Could not fetch conversations from DB:", err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [activeConversationId]);

  // 3. Fetch Messages for Active Conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.conversation?.messages) {
          const formatted: ChatMessage[] = data.conversation.messages.map((m: any) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            actionCard: m.actionCardData || undefined,
          }));
          setCurrentMessages(formatted);
        }
      }
    } catch (err) {
      console.warn("Could not fetch messages for conversation:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchUserProfile();
    fetchConversations();
  }, [fetchUserProfile, fetchConversations]);

  // Load messages whenever activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  // 4. Create New Conversation in PostgreSQL
  const handleNewConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      if (res.ok) {
        const data = await res.json();
        const newConv = data.conversation;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setCurrentMessages([]);
        setActivePrompt("Hello! What is my schedule today?");
      } else {
        // Fallback for UI if DB is offline
        const localId = `local-${Date.now()}`;
        setConversations((prev) => [
          {
            id: localId,
            title: "New Conversation",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setActiveConversationId(localId);
        setCurrentMessages([]);
      }
    } catch (err) {
      console.warn("Failed creating conversation:", err);
    }
  };

  // 5. Delete Conversation in PostgreSQL
  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConversationId === id) {
          const remaining = conversations.filter((c) => c.id !== id);
          if (remaining.length > 0) {
            setActiveConversationId(remaining[0].id);
          } else {
            setActiveConversationId(null);
            setCurrentMessages([]);
          }
        }
      }
    } catch (err) {
      console.error("Failed deleting conversation:", err);
    }
  };

  // 6. Save Message in PostgreSQL
  const handleSaveMessageToDb = async (msg: {
    role: "user" | "assistant";
    content: string;
    actionCardData?: unknown;
  }) => {
    let targetConvId = activeConversationId;

    // If no active conversation exists, auto-create one first
    if (!targetConvId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: msg.content.slice(0, 32) || "New Discussion",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          targetConvId = data.conversation.id;
          setActiveConversationId(targetConvId);
          setConversations((prev) => [data.conversation, ...prev]);
        }
      } catch (e) {
        console.warn("Could not create conversation for message:", e);
      }
    }

    if (!targetConvId || targetConvId.startsWith("local-")) {
      return;
    }

    try {
      await fetch(`/api/conversations/${targetConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch (err) {
      console.error("Failed saving message to DB:", err);
    }
  };

  // 7. Logout Handler
  const handleLogout = async () => {
    try {
      if (descope?.logout) {
        await descope.logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
    }
  };

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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewConversation}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onDeleteConversation={handleDeleteConversation}
        userProfile={dbUserProfile}
        onLogout={handleLogout}
        isLoadingConversations={isLoadingConversations}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar / Taskbar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold capitalize text-slate-900 dark:text-white">
                {activeTab === "chat" ? "Agentic Assistant" : activeTab}
              </span>
              <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400">
                AI Meeting Orchestrator
              </span>
            </div>
          </div>

          {/* Quick Header Controls / Top Taskbar Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all shadow-sm active:scale-95",
                theme === "dark"
                  ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark/light mode"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400 animate-in fade-in zoom-in duration-200" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-600 animate-in fade-in zoom-in duration-200" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {activeTab === "chat" && (
              <button
                onClick={() => setIsSplitView(!isSplitView)}
                className={cn(
                  "hidden lg:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors shadow-sm",
                  isSplitView
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
                title="Toggle Split Screen View (Chat + Calendar)"
              >
                <Columns className="h-3.5 w-3.5" />
                <span>{isSplitView ? "Split Screen On" : "Split Screen"}</span>
              </button>
            )}

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 shadow-sm">
              <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
              <span className="hidden sm:inline">Descope + Neon DB</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* View Routing / Render */}
        <main className="flex-1 overflow-hidden">
          {activeTab === "chat" ? (
            isSplitView ? (
              /* Split Screen: Chat (50%) + Calendar (50%) on large screens */
              <div className="grid h-full grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
                <div className="h-full overflow-hidden">
                  <ChatInterface
                    externalPrompt={activePrompt}
                    onClearExternalPrompt={() => setActivePrompt(undefined)}
                    conversationId={activeConversationId}
                    savedMessages={currentMessages}
                    onSaveMessageToDb={handleSaveMessageToDb}
                    isConversationLoading={isLoadingMessages}
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
                conversationId={activeConversationId}
                savedMessages={currentMessages}
                onSaveMessageToDb={handleSaveMessageToDb}
                isConversationLoading={isLoadingMessages}
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
