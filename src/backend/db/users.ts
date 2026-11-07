import prisma from "./prisma";

export async function findOrCreateUserByDescope(descopeUser: {
  descopeId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}) {
  return await prisma.user.upsert({
    where: { email: descopeUser.email },
    update: {
      descopeId: descopeUser.descopeId,
      name: descopeUser.name,
      avatarUrl: descopeUser.avatarUrl,
    },
    create: {
      email: descopeUser.email,
      descopeId: descopeUser.descopeId,
      name: descopeUser.name ?? "User",
      avatarUrl: descopeUser.avatarUrl,
      preferences: {
        create: {
          workingHoursStart: "09:00",
          workingHoursEnd: "17:00",
          defaultDurationMinutes: 30,
          timezone: "UTC",
          preferredDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
    },
    include: {
      preferences: true,
    },
  });
}

export async function getUserPreferences(userId: string) {
  return await prisma.meetingPreference.findUnique({
    where: { userId },
  });
}

