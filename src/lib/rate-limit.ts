import { createServerSupabaseClient } from "./supabase-server";

// Configurable via env: 2 eligibility checks per 24h by default
export const ASK_LIMIT = Math.max(1, parseInt(process.env.RATE_LIMIT_ELIGIBILITY_CHECKS || "2", 10) || 2);
export const WINDOW_HOURS = Math.max(1, parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || "24", 10) || 24);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date | null;
  error?: string;
}

export async function checkAndIncrementRateLimit(
  userId: string,
  email: string
): Promise<RateLimitResult> {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return { allowed: true, remaining: ASK_LIMIT, resetAt: null };
    }
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

    const { data: existing, error: fetchError } = await supabase
      .from("rate_limits" as any)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Rate limit fetch error:", fetchError);
      return { allowed: false, remaining: 0, resetAt: null, error: "Rate limit check failed" };
    }

    const windowStartDate = existing?.window_start
      ? new Date(existing.window_start)
      : null;
    const isWindowExpired = windowStartDate
      ? windowStartDate < windowStart
      : true;
    const currentCount = isWindowExpired ? 0 : (existing?.ask_count ?? 0);

    if (currentCount >= ASK_LIMIT) {
      const resetAt = windowStartDate
        ? new Date(windowStartDate.getTime() + WINDOW_HOURS * 60 * 60 * 1000)
        : now;
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("rate_limits" as any)
        .update({
          ask_count: isWindowExpired ? 1 : currentCount + 1,
          window_start: isWindowExpired ? now.toISOString() : existing.window_start,
          updated_at: now.toISOString(),
        })
        .eq("user_id", userId);
      if (updateError) {
        console.error("Rate limit update error:", updateError);
        return { allowed: false, remaining: 0, resetAt: null };
      }
    } else {
      const { error: insertError } = await supabase
        .from("rate_limits" as any)
        .insert({
          user_id: userId,
          email,
          ask_count: 1,
          window_start: now.toISOString(),
        });
      if (insertError) {
        console.error("Rate limit insert error:", insertError);
        return { allowed: false, remaining: 0, resetAt: null };
      }
    }

    return {
      allowed: true,
      remaining: ASK_LIMIT - currentCount - 1,
      resetAt: new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000),
    };
  } catch (err) {
    console.error("Rate limit error:", err);
    return { allowed: false, remaining: 0, resetAt: null, error: "Rate limit check failed" };
  }
}
