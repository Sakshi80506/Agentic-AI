import prisma from "./prisma";

/**
 * Retrieves all conversations belonging to the authenticated user.
 */
export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { messages: true },
      },
    },
  });
}

/**
 * Creates a new conversation for the authenticated user.
 */
export async function createConversation(userId: string, title: string = "New Conversation") {
  return await prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

/**
 * Retrieves a conversation and its messages.
 * Verifies that the conversation belongs to the authenticated user.
 */
export async function getConversationById(id: string, userId: string) {
  return await prisma.conversation.findFirst({
    where: {
      id,
      userId, // User-level isolation
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/**
 * Deletes a conversation.
 * Verifies ownership before deletion.
 */
export async function deleteConversation(id: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId, // Security check
    },
  });

  if (!conversation) {
    return null;
  }

  return await prisma.conversation.delete({
    where: { id },
  });
}

/**
 * Adds a message to a conversation.
 * Verifies that the conversation belongs to the user and updates conversation.updatedAt.
 */
export async function addMessageToConversation(params: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  actionCardData?: unknown;
}) {
  // Verify ownership
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: params.conversationId,
      userId: params.userId,
    },
  });

  if (!conversation) {
    return null;
  }

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId: params.conversationId,
        role: params.role,
        content: params.content,
        actionCardData: (params.actionCardData ?? undefined) as any,
      },
    }),
    prisma.conversation.update({
      where: { id: params.conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return message;
}
