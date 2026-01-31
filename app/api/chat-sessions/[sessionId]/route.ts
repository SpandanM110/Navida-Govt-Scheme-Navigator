import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { sessionId } = await params;
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Chat storage not configured" }, { status: 503 });
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions" as any)
      .select("id, title, scheme_context, created_at")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages" as any)
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Messages fetch error:", messagesError);
      return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
    }

    return NextResponse.json({
      session,
      messages: (messages || []).map((m) => ({ role: m.role, content: m.content })),
    });
  } catch (err) {
    console.error("Chat session get error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
