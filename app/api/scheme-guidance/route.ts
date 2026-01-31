import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkAndIncrementRateLimit, ASK_LIMIT, WINDOW_HOURS } from "@/lib/rate-limit";

const MODEL_DISPLAY_NAME = "Llama 3.3 70B";

function buildExaQuery(profile: Record<string, unknown>): string {
  const parts = ["Indian government welfare schemes eligibility 2024"];
  if (profile.age != null) parts.push(`age ${profile.age}`);
  if (profile.income) parts.push(`income ${profile.income} rupees`);
  if (profile.gender && profile.gender !== "other")
    parts.push(String(profile.gender).toLowerCase());
  if (profile.state) parts.push(String(profile.state));
  if (profile.occupation) {
    parts.push(String(profile.occupation).replace(/_/g, " "));
  }
  if (profile.category && profile.category !== "general")
    parts.push(String(profile.category));
  if (profile.business_owner) parts.push("MSME business owner");
  return parts.join(" ");
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required to check eligibility" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
      ?? user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email required for rate limiting" }, { status: 400 });
    }

    const rateLimit = await checkAndIncrementRateLimit(userId, email);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can run ${ASK_LIMIT} eligibility check(s) per ${WINDOW_HOURS} hours. Try again later.`,
          resetAt: rateLimit.resetAt?.toISOString(),
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { profile, language = "en" } = body || {};
    const EXA_API_KEY = process.env.EXA_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!EXA_API_KEY) {
      return NextResponse.json(
        { error: "EXA_API_KEY is not configured" },
        { status: 500 }
      );
    }
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const query = buildExaQuery(profile || {});
    const exaRes = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: 10,
        text: true,
      }),
    });

    if (!exaRes.ok) {
      const errText = await exaRes.text();
      console.error("Exa error:", exaRes.status, errText);
      return NextResponse.json(
        { error: "Search failed", details: errText },
        { status: 502 }
      );
    }

    const exaData = await exaRes.json();
    const results = exaData.results || [];
    const urls: string[] = results
      .map((r: { url?: string }) => r.url)
      .filter(Boolean);
    const contextParts = results
      .filter((r: { text?: string }) => r.text)
      .map(
        (r: { url?: string; text?: string }) =>
          `[Source: ${r.url}]\n${(r.text || "").slice(0, 3000)}`
      );
    const exaContext = contextParts.join("\n\n---\n\n");
    const hasExaContext = exaContext.length > 0;

    const langMap: Record<string, string> = {
      hi: "Hindi",
      bn: "Bengali",
      ta: "Tamil",
      te: "Telugu",
      mr: "Marathi",
    };
    const langLabel = langMap[language as string] || "English";
    const profileSummary = `
User Profile:
- Age: ${profile?.age ?? "Not specified"}
- Annual Income: ₹${profile?.income ?? "Not specified"}
- Gender: ${profile?.gender ?? "Not specified"}
- State/UT: ${profile?.state ?? "Not specified"}
- Occupation: ${profile?.occupation ?? "Not specified"}
- Category: ${profile?.category ?? "Not specified"}
- Business Owner: ${profile?.business_owner ?? false}
`;

    const systemPrompt = `You are Navida, a helpful assistant for Indian government welfare schemes.
Your role is to provide clear, personalized guidance to citizens based on their profile and the latest information from web search.

Guidelines:
- Use the web search results (Exa) as your primary source - cite specific schemes mentioned
- Structure your response: 1) Summary of best-fit schemes, 2) Eligibility highlights, 3) Documents needed, 4) How to apply, 5) Official links
- Use simple, plain language - avoid jargon
- Be specific and actionable - tell the user exactly what they can do
- If search results mention official portals (gov.in, nic.in), include them
- Keep it concise but complete - aim for 300-500 words
- Be honest if information is limited - suggest they verify on official portals`;

    const userContent = hasExaContext
      ? `Based on this user profile and the web search results below, provide personalized guidance on which Indian government schemes they may be eligible for and how to apply.

${profileSummary}

Web Search Results (use this as your main source):
${exaContext.slice(0, 12000)}

Provide clear, actionable guidance. Include source URLs from the search results when relevant.${
        langLabel !== "English" ? `\n\nRespond in ${langLabel}.` : ""
      }`
      : `Based on this user profile, provide personalized guidance on which Indian government schemes they may be eligible for. Suggest common schemes like PM-KISAN, Ayushman Bharat, PM Awas Yojana, and others based on their age, income, state, occupation, and category. Include how to apply and where to find official information.

${profileSummary}

Provide clear, actionable guidance. Suggest they visit official government portals (gov.in, state government sites) for the latest details.${
        langLabel !== "English" ? `\n\nRespond in ${langLabel}.` : ""
      }`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent.trim() },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", groqRes.status, errText);
      return NextResponse.json(
        { error: "Guidance generation failed", details: errText },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();
    let guidance = groqData.choices?.[0]?.message?.content || "";

    if (urls.length > 0) {
      guidance += "\n\n---\n**Source links (verify on official portals):**\n";
      urls.slice(0, 8).forEach((u: string) => {
        guidance += `- ${u}\n`;
      });
    }

    return NextResponse.json({
      guidance: guidance.trim(),
      urls,
      modelName: MODEL_DISPLAY_NAME,
    });
  } catch (error) {
    console.error("scheme-guidance error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
