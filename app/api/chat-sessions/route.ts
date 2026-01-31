import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ sessions: [] });
    }
    const { data, error } = await supabase
      .from("chat_sessions" as any)
      .select("id, title, scheme_context, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Chat sessions fetch error:", error);
      return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
    }

    return NextResponse.json({ sessions: data || [] });
  } catch (err) {
    console.error("Chat sessions error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { title = "New Chat", scheme_context } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Chat storage not configured" }, { status: 503 });
    }
    const { data, error } = await supabase
      .from("chat_sessions" as any)
      .insert({ user_id: userId, title, scheme_context })
      .select("id, title, created_at")
      .single();

    if (error) {
      console.error("Chat session create error:", error);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (err) {
    console.error("Chat session create error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
