/**
 * Backend External Services
 * Google Calendar API, Gmail API, and OAuth integrations (Stage 5 & Stage 8)
 */

export interface CalendarService {
  getFreeSlots: (date: string) => Promise<string[]>;
  createEvent: (eventDetails: unknown) => Promise<{ eventId: string; meetUrl: string }>;
  cancelEvent: (eventId: string) => Promise<boolean>;
}

