export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  descopeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  workingHoursStart: string; // e.g. "09:00"
  workingHoursEnd: string;   // e.g. "17:00"
  defaultDurationMinutes: number; // e.g. 30
  timezone: string;          // e.g. "UTC"
  preferredDays: string[];   // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}

