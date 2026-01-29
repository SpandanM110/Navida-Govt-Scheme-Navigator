"""
Groq LLM client for generating clean, understandable scheme explanations.
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# Load .env from streamlit-app/ or project root
_base = Path(__file__).resolve().parent.parent
load_dotenv()
load_dotenv(_base / ".env")
load_dotenv(_base.parent / ".env")  # project root

# Default model - fast and capable for explanations
DEFAULT_MODEL = "llama-3.3-70b-versatile"
MODEL_DISPLAY_NAME = "Llama 3.3 70B Versatile"


def generate_guidance(user_profile: dict, exa_context: str, urls: list, language: str = "English") -> dict:
    """
    Generate personalized scheme guidance from Exa search results using Groq.
    No static schemes_data - purely Exa results + user profile.

    Returns:
        dict with keys: content (str), success (bool), error (str|None)
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "content": "",
            "success": False,
            "error": "GROQ_API_KEY not set. Add it to .env in streamlit-app/",
        }

    try:
        from groq import Groq

        client = Groq(api_key=api_key)

        profile_summary = f"""
User Profile:
- Age: {user_profile.get('age', 'Not specified')}
- Annual Income: ₹{user_profile.get('income', 'Not specified')}
- Gender: {user_profile.get('gender', 'Not specified')}
- State/UT: {user_profile.get('state', 'Not specified')}
- Occupation: {user_profile.get('occupation', 'Not specified')}
- Category: {user_profile.get('category', 'Not specified')}
- Business Owner: {user_profile.get('business_owner', False)}
"""

        system_prompt = """You are Navida, a helpful assistant for Indian government welfare schemes.
Your role is to provide clear, personalized guidance to citizens based on their profile and the latest information from web search.

Guidelines:
- Use the web search results (Exa) as your primary source - cite specific schemes mentioned
- Structure your response: 1) Summary of best-fit schemes, 2) Eligibility highlights, 3) Documents needed, 4) How to apply, 5) Official links
- Use simple, plain language - avoid jargon
- Be specific and actionable - tell the user exactly what they can do
- If search results mention official portals (gov.in, nic.in), include them
- Keep it concise but complete - aim for 300-500 words
- Be honest if information is limited - suggest they verify on official portals"""

        user_content = f"""Based on this user profile and the web search results below, provide personalized guidance on which Indian government schemes they may be eligible for and how to apply.

{profile_summary}

Web Search Results (use this as your main source):
{exa_context[:12000] if exa_context else "No search results available."}

Provide clear, actionable guidance. Include source URLs from the search results when relevant."""

        if language != "English":
            user_content += f"\n\nRespond in {language}."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content.strip()},
        ]

        completion = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.3,
            max_completion_tokens=2048,
        )

        content = completion.choices[0].message.content or ""

        # Append source links
        if urls:
            content += "\n\n---\n**Source links (verify on official portals):**\n"
            for url in urls[:8]:
                content += f"- {url}\n"

        return {
            "content": content.strip(),
            "success": True,
            "error": None,
        }

    except ImportError:
        return {
            "content": "",
            "success": False,
            "error": "groq not installed. Run: pip install groq",
        }
    except Exception as e:
        return {
            "content": "",
            "success": False,
            "error": str(e),
        }


def generate_with_groq(
    scheme: dict,
    language: str = "English",
    exa_context: Optional[str] = None,
) -> dict:
    """
    Generate a clean, understandable explanation using Groq.

    Returns:
        dict with keys: content (str), success (bool), error (str|None)
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "content": "",
            "success": False,
            "error": "GROQ_API_KEY not set. Add it to .env in streamlit-app/",
        }

    try:
        from groq import Groq

        client = Groq(api_key=api_key)

        base_info = f"""
Scheme Name: {scheme.get('name', 'Unknown')}
Description: {scheme.get('description', '')}
Required Documents: {', '.join(scheme.get('documents', []))}
Official Link: {scheme.get('official_link', 'N/A')}
"""

        system_prompt = """You are Navida, a helpful assistant for Indian government welfare schemes.
Your role is to explain schemes in simple, clear language that citizens can understand.
- Use short sentences and plain language
- Avoid jargon and bureaucratic terms
- Focus on: What is it? Who can apply? What documents are needed? How to apply?
- Be concise but complete
- If web search context is provided, use it to enrich your explanation with latest info
- Always mention the official website for verification"""

        user_content = f"""Explain this government scheme in a clean, understandable way for a citizen:

{base_info}
"""

        if exa_context:
            user_content += f"""
Additional context from web search (use to enrich your explanation):
{exa_context[:8000]}
"""

        if language != "English":
            user_content += f"\nRespond in {language}."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content.strip()},
        ]

        completion = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.3,
            max_completion_tokens=1024,
        )

        content = completion.choices[0].message.content or ""

        return {
            "content": content.strip(),
            "success": True,
            "error": None,
        }

    except ImportError:
        return {
            "content": "",
            "success": False,
            "error": "groq not installed. Run: pip install groq",
        }
    except Exception as e:
        return {
            "content": "",
            "success": False,
            "error": str(e),
        }
