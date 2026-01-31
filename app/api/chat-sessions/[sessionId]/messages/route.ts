import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content || !["user", "assistant"].includes(role)) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Chat storage not configured" }, { status: 503 });
    }

    const { data: session } = await supabase
      .from("chat_sessions" as any)
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: message, error } = await supabase
      .from("chat_messages" as any)
      .insert({ session_id: sessionId, role, content })
      .select("id, role, content, created_at")
      .single();

    if (error) {
      console.error("Message insert error:", error);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    await supabase
      .from("chat_sessions" as any)
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ message });
  } catch (err) {
    console.error("Chat message save error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
