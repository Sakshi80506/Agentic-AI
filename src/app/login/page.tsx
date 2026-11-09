"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Descope } from "@descope/nextjs-sdk";
import { useSession } from "@descope/nextjs-sdk/client";
import { Bot, Shield, Sparkles, Key, CheckCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isSessionLoading } = useSession();
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;

  useEffect(() => {
    if (isAuthenticated && !isSessionLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isSessionLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Branding Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/30">
            <Bot className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Agentic AI Assistant
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in or register to orchestrate your schedule & meetings
          </p>
        </div>

        {/* Descope Auth Widget or Setup Notice */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
          {projectId ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Authentication Portal</span>
                <span className="flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                  <Shield className="h-3 w-3" />
                  Secured by Descope
                </span>
              </div>

              {/* Official Descope Flow Component */}
              <div className="min-h-[320px] flex items-center justify-center">
                <Descope
                  flowId="sign-up-or-in"
                  onSuccess={(e) => {
                    console.log("Descope authentication success:", e);
                    router.push("/");
                  }}
                  onError={(err) => {
                    console.error("Descope authentication error:", err);
                  }}
                />
              </div>
            </div>
          ) : (
            /* Setup Helper if NEXT_PUBLIC_DESCOPE_PROJECT_ID is not configured yet */
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                <Key className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Configuration Required:</strong> Descope Project ID is not yet set in{" "}
                  <code className="text-white">.env.local</code>.
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-white">How to connect Descope (Free):</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>
                    Create a free account at{" "}
                    <a
                      href="https://app.descope.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 underline"
                    >
                      app.descope.com
                    </a>
                  </li>
                  <li>Copy your <strong>Project ID</strong> from Project Settings.</li>
                  <li>
                    Add it to your <code className="text-white">.env.local</code> file:
                  </li>
                </ol>
                <pre className="rounded-lg bg-slate-950 p-2 text-[11px] font-mono text-indigo-300 border border-slate-800">
                  NEXT_PUBLIC_DESCOPE_PROJECT_ID=P2...
                </pre>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors"
                >
                  <span>Preview Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Supports Google Single Sign-On and Passwordless Email Authentication.
        </p>
      </div>
    </div>
  );
}

