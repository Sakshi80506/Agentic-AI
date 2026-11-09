import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/backend/auth/session";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in with Descope." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      descopeUserId: user.descopeUserId,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      preferences: user.preferences,
      createdAt: user.createdAt,
    },
  });
}

