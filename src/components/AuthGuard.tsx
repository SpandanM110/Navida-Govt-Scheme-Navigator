"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";

const hasClerk =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("YOUR_");

export function AuthSignedIn({ children }: { children: React.ReactNode }) {
  if (!hasClerk) return null;
  return <SignedIn>{children}</SignedIn>;
}

export function AuthSignedOut({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!hasClerk) return <>{fallback ?? children}</>;
  return <SignedOut>{children}</SignedOut>;
}
