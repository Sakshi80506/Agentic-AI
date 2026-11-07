export type CalendarViewType = "day" | "week";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  attendees: {
    name: string;
    email: string;
    avatar?: string;
  }[];
  location?: string;
  meetLink?: string;
  status: "confirmed" | "tentative" | "cancelled";
  category: "standup" | "client" | "planning" | "1on1" | "other";
}

