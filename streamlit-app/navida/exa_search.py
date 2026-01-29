"""
Exa Web Search integration for fetching scheme-related URLs and content.
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


def search_by_profile(user_profile: dict, num_results: int = 10) -> dict:
    """
    Search Exa for government schemes based on user profile (age, income, gender, state, occupation, etc.).
    Returns URLs and full text context for Groq to synthesize into guidance.

    Returns:
        dict with keys: urls (list), context (str), success (bool), error (str|None)
    """
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": "EXA_API_KEY not set. Add it to .env in streamlit-app/",
        }

    try:
        from exa_py import Exa

        exa = Exa(api_key)

        # Build rich search query from user profile
        parts = ["Indian government welfare schemes eligibility 2024"]
        if user_profile.get("age") is not None:
            parts.append(f"age {user_profile['age']}")
        if user_profile.get("income"):
            parts.append(f"income {user_profile['income']} rupees")
        if user_profile.get("gender") and user_profile["gender"] != "Other":
            parts.append(user_profile["gender"].lower())
        if user_profile.get("state"):
            parts.append(user_profile["state"])
        if user_profile.get("occupation"):
            occ = user_profile["occupation"].replace("_", " ")
            parts.append(occ)
        if user_profile.get("category") and user_profile["category"] not in ("", "General"):
            parts.append(user_profile["category"])
        if user_profile.get("business_owner"):
            parts.append("MSME business owner")

        query = " ".join(parts)

        result = exa.search_and_contents(
            query,
            type="auto",
            num_results=num_results,
            text=True,
            contents={"text": {"maxCharacters": 3000}},
        )

        urls = []
        context_parts = []

        if result.results:
            for r in result.results:
                urls.append(r.url)
                if getattr(r, "text", None):
                    context_parts.append(f"[Source: {r.url}]\n{r.text[:3000]}")

        return {
            "urls": urls,
            "context": "\n\n---\n\n".join(context_parts) if context_parts else "",
            "success": True,
            "error": None,
        }

    except ImportError:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": "exa-py not installed. Run: pip install exa-py",
        }
    except Exception as e:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": str(e),
        }


def search_scheme_urls(scheme_name: str, official_link: Optional[str] = None, num_results: int = 5) -> dict:
    """
    Search Exa for URLs and content related to a government scheme.

    Returns:
        dict with keys: urls (list), context (str), success (bool), error (str|None)
    """
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": "EXA_API_KEY not set. Add it to .env in streamlit-app/",
        }

    try:
        from exa_py import Exa

        exa = Exa(api_key)

        # Build search query for Indian government scheme
        query = f"{scheme_name} India government scheme eligibility application official"

        result = exa.search_and_contents(
            query,
            type="auto",
            num_results=num_results,
            text=True,
            contents={"text": {"maxCharacters": 2000}},
        )

        urls = []
        context_parts = []

        if result.results:
            for r in result.results:
                urls.append(r.url)
                if getattr(r, "text", None):
                    context_parts.append(f"[Source: {r.url}]\n{r.text[:2000]}")

        return {
            "urls": urls,
            "context": "\n\n---\n\n".join(context_parts) if context_parts else "",
            "success": True,
            "error": None,
        }

    except ImportError:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": "exa-py not installed. Run: pip install exa-py",
        }
    except Exception as e:
        return {
            "urls": [],
            "context": "",
            "success": False,
            "error": str(e),
        }
