export interface UserProfileForGuidance {
  age: number;
  income: number;
  state: string;
  occupation: string;
  gender: string;
  category: string;
  business_owner?: boolean;
}

export interface SchemeGuidanceResponse {
  guidance: string;
  urls: string[];
  modelName?: string;
}

// Next.js: API routes are same-origin at /api/scheme-guidance
export async function fetchSchemeGuidance(
  profile: UserProfileForGuidance,
  language: string = "en"
): Promise<SchemeGuidanceResponse> {
  const url = "/api/scheme-guidance";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: {
        age: profile.age,
        income: profile.income,
        state: profile.state || undefined,
        occupation: profile.occupation || undefined,
        gender: profile.gender || undefined,
        category: profile.category || undefined,
        business_owner: profile.business_owner ?? false,
      },
      language,
    }),
  });

  let data: { guidance?: string; urls?: string[]; modelName?: string; error?: string };
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from server. Please try again.");
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Sign in required to check eligibility. Please sign in and try again.");
    }
    if (res.status === 429) {
      const err = new Error(data?.error || "Rate limit exceeded. You can make 2 checks per 24 hours.") as Error & { resetAt?: string };
      err.resetAt = (data as { resetAt?: string })?.resetAt;
      throw err;
    }
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }

  if (data?.error && !data?.guidance) {
    throw new Error(data.error);
  }

  return {
    guidance: data?.guidance ?? "",
    urls: data?.urls ?? [],
    modelName: data?.modelName,
  };
}
