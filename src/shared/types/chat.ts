export interface ActionCardData {
  id: string;
  actionType: "schedule" | "reschedule" | "cancel" | "invite";
  title: string;
  summary: string;
  details: {
    title: string;
    date: string;
    time: string;
    duration: string;
    attendees: string[];
    platform?: string;
  };
  status: "pending" | "approved" | "rejected";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  status?: "sending" | "success" | "error";
  actionCard?: ActionCardData;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  iconName?: string;
}

