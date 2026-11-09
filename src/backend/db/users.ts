import prisma from "./prisma";

export interface SyncUserData {
  descopeUserId: string;
  email: string;
  name?: string | null;
  profileImage?: string | null;
}

/**
 * Upserts a User record when authenticated via Descope.
 * Automatically provisions default UserPreferences if new.
 */
export async function findOrCreateUser(userData: SyncUserData) {
  return await prisma.user.upsert({
    where: { descopeUserId: userData.descopeUserId },
    update: {
      email: userData.email,
      name: userData.name ?? undefined,
      profileImage: userData.profileImage ?? undefined,
    },
    create: {
      descopeUserId: userData.descopeUserId,
      email: userData.email,
      name: userData.name ?? "User",
      profileImage: userData.profileImage,
      preferences: {
        create: {
          preferredMeetingDuration: 30,
          workingHoursStart: "09:00",
          workingHoursEnd: "17:00",
          timezone: "UTC",
        },
      },
    },
    include: {
      preferences: true,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      preferences: true,
    },
  });
}

export async function getUserByDescopeId(descopeUserId: string) {
  return await prisma.user.findUnique({
    where: { descopeUserId },
    include: {
      preferences: true,
    },
  });
}

export async function updateUserPreferences(
  userId: string,
  data: {
    preferredMeetingDuration?: number;
    workingHoursStart?: string;
    workingHoursEnd?: string;
    timezone?: string;
  }
) {
  return await prisma.userPreference.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      preferredMeetingDuration: data.preferredMeetingDuration ?? 30,
      workingHoursStart: data.workingHoursStart ?? "09:00",
      workingHoursEnd: data.workingHoursEnd ?? "17:00",
      timezone: data.timezone ?? "UTC",
    },
  });
}
