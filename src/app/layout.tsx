import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Navida – Government Scheme Navigator",
  description:
    "AI-powered platform to help Indian citizens discover, understand, and access government welfare schemes.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerk = clerkKey && !clerkKey.startsWith("YOUR_");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
  return hasClerk ? <ClerkProvider>{content}</ClerkProvider> : content;
}
