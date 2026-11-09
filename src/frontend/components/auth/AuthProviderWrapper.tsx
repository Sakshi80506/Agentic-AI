"use client";

import React from "react";
import { AuthProvider } from "@descope/nextjs-sdk";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || "P2_PLACEHOLDER";

  return (
    <AuthProvider projectId={projectId}>
      {children}
    </AuthProvider>
  );
};
