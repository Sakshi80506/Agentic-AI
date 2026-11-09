import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/backend/auth/session";
import { addMessageToConversation } from "@/backend/db/conversations";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in with Descope." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { role, content, actionCardData } = body;

    if (!role || (role !== "user" && role !== "assistant")) {
      return NextResponse.json(
        { error: "Invalid message role. Must be 'user' or 'assistant'." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const message = await addMessageToConversation({
      conversationId: params.id,
      userId: user.id, // Enforces user-level isolation
      role,
      content: content.trim(),
      actionCardData,
    });

    if (!message) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json(
      { error: "Internal Server Error saving message." },
      { status: 500 }
    );
  }
}

