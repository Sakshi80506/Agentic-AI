import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    application: "Agentic AI Meeting & Productivity Assistant",
    architecture: {
      frontend: "src/frontend (@frontend/*)",
      backend: "src/backend (@backend/*)",
      shared: "src/shared (@shared/*)",
      routes: "src/app (App Router)",
    },
    services: {
      nextjs: "ready",
      database: "prisma_neon_configured (Stage 2)",
      auth: "descope_configured (Stage 2)",
      agent: "mastra_gemini_pending (Stage 3)",
      calendar: "google_calendar_pending (Stage 5)",
    },
    timestamp: new Date().toISOString(),
  });
}
