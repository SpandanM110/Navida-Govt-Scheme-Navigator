import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCHEMES_INFO = `
Available Government Schemes:
1. PM-KISAN Samman Nidhi - ₹6,000/year for farmers with income <₹2 lakh
2. Pradhan Mantri Ujjwala Yojana - Free LPG for women from BPL families, income <₹1.2 lakh
3. Ayushman Bharat PM-JAY - ₹5 lakh health cover for families with income <₹2.5 lakh
4. Pradhan Mantri Awas Yojana - Housing subsidy up to ₹2.67 lakh, age 21-70, income <₹3 lakh
5. National Social Assistance Programme - Pension for elderly (60+) from BPL families
6. PM Shram Yogi Maan-dhan - ₹3,000/month pension for unorganized workers age 18-40, income <₹1.8 lakh
7. Sukanya Samriddhi Yojana - Savings scheme for girl child under 10 years
8. Pradhan Mantri MUDRA Yojana - Business loans up to ₹10 lakh for self-employed/small business

Eligibility factors: age, gender, annual income, occupation, state, category (General/OBC/SC/ST)
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Navida, a helpful assistant for Indian government welfare schemes. Your role is to:
1. Help citizens understand which schemes they may be eligible for
2. Answer questions about scheme benefits, documents required, and application process
3. Be friendly, patient, and explain things simply for users who may have low literacy
4. ALWAYS use the rule-based eligibility information - never make up eligibility criteria
5. When asked about eligibility, ask clarifying questions about: age, income, occupation, gender if not provided
6. Respond in ${language === 'hi' ? 'Hindi' : 'English'} naturally
7. Keep responses concise but helpful

${SCHEMES_INFO}

Important rules:
- If user mentions they are a farmer, mention PM-KISAN and MUDRA schemes
- For women from poor families, mention Ujjwala Yojana
- For health concerns, mention Ayushman Bharat
- For elderly (60+), mention NSAP pension
- For girls under 10, mention Sukanya Samriddhi
- For housing needs, mention PMAY
- For workers/laborers, mention PM Shram Yogi Maan-dhan

Always encourage users to verify final eligibility through official portals and provide the official website when relevant.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in scheme-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
