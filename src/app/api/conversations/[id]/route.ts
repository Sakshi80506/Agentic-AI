import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/backend/auth/session";
import { getConversationById, deleteConversation } from "@/backend/db/conversations";

export async function GET(
  _req: NextRequest,
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
    const conversation = await getConversationById(params.id, user.id);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Failed to retrieve conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error retrieving conversation." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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
    const deleted = await deleteConversation(params.id, user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Conversation deleted successfully." });
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error deleting conversation." },
      { status: 500 }
    );
  }
}

