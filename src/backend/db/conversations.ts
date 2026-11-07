import prisma from "./prisma";

export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getConversationMessages(conversationId: string) {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function saveMessage(params: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  actionCardData?: unknown;
}) {
  return await prisma.message.create({
    data: {
      conversationId: params.conversationId,
      role: params.role,
      content: params.content,
      actionCardData: (params.actionCardData ?? undefined) as any,
    },
  });
}

