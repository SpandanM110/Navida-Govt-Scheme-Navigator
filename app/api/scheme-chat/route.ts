import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

const SCHEMES_INFO = `
Available Government Schemes (reference):
1. PM-KISAN Samman Nidhi - ₹6,000/year for farmers with income <₹2 lakh
2. Pradhan Mantri Ujjwala Yojana - Free LPG for women from BPL families
3. Ayushman Bharat PM-JAY - ₹5 lakh health cover for families with income <₹2.5 lakh
4. Pradhan Mantri Awas Yojana - Housing subsidy up to ₹2.67 lakh
5. National Social Assistance Programme - Pension for elderly (60+) from BPL families
6. PM Shram Yogi Maan-dhan - ₹3,000/month pension for unorganized workers
7. Sukanya Samriddhi Yojana - Savings scheme for girl child under 10 years
8. Pradhan Mantri MUDRA Yojana - Business loans up to ₹10 lakh
`;

function buildSystemPrompt(language: string, schemeContext?: string): string {
  const langInstruction =
    language === "hi"
      ? "Respond naturally in Hindi (हिंदी)."
      : language === "bn"
      ? "Respond naturally in Bengali (বাংলা)."
      : language === "ta"
      ? "Respond naturally in Tamil (தமிழ்)."
      : language === "te"
      ? "Respond naturally in Telugu (తెలుగు)."
      : language === "mr"
      ? "Respond naturally in Marathi (मराठी)."
      : "Respond in English.";

  let base = `You are Navida, a helpful assistant for Indian government welfare schemes. Your role is to:
1. Help citizens understand which schemes they may be eligible for
2. Answer questions about scheme benefits, documents required, and application process
3. Be friendly, patient, and explain things simply for users who may have low literacy
4. ALWAYS use the rule-based eligibility information - never make up eligibility criteria
5. When asked about eligibility, ask clarifying questions about: age, income, occupation, gender if not provided
6. ${langInstruction}
7. Keep responses concise but helpful
8. Use minimal formatting: **bold** only for scheme names or key terms. Avoid ## headers, use plain paragraphs and bullet points (-) for lists. Output clean, readable text.

**CRITICAL - CONVERSATION MEMORY:** You have the full conversation history. ALWAYS remember and reference what was discussed earlier. When the user says "the first one", "Mudra Yojana", "tell me more", "that scheme", or similar, use the context from your previous messages. Continue the discussion naturally in a flowing conversation. Never ask for information you already have.

${SCHEMES_INFO}`;

  if (schemeContext?.trim()) {
    base += `

**User's previous scheme guidance (use this context to answer follow-up questions):**
${schemeContext.trim()}

The user may ask follow-up questions about the schemes above. Use this context to give accurate, personalized answers.`;
  }

  return base;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required to chat" }, { status: 401 });
    }

    // Rate limit applies only to eligibility checks (scheme-guidance), not chat.
    // Users can chat freely after running eligibility.

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      messages,
      language = "en",
      schemeContext,
    }: {
      messages: { role: string; content: string }[];
      language?: string;
      schemeContext?: string;
    } = body || {};

    if (!messages?.length) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const systemPrompt = buildSystemPrompt(language, schemeContext);

    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) {
              const data = `data: ${JSON.stringify({
                choices: [{ delta: { content }, index: 0 }],
              })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("scheme-chat error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
