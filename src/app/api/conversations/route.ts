import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/backend/auth/session";
import { getUserConversations, createConversation } from "@/backend/db/conversations";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in with Descope." },
      { status: 401 }
    );
  }

  try {
    const conversations = await getUserConversations(user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching conversations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in with Descope." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title && typeof body.title === "string" ? body.title.trim() : "New Conversation";

    const conversation = await createConversation(user.id, title);
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error creating conversation." },
      { status: 500 }
    );
  }
}

