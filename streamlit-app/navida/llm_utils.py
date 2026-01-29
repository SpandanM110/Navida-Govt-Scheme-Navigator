"""
LLM utilities for scheme explanations.
Integrates Exa Web Search (URLs) + Groq (clean output).
"""

from typing import Optional

from navida.exa_search import search_scheme_urls
from navida.groq_client import generate_with_groq


def generate_explanation(
    scheme: dict,
    language: str = "English",
    use_exa: bool = True,
    use_groq: bool = True,
) -> tuple[str, list[str]]:
    """
    Generate a clean, understandable explanation using Exa + Groq.

    Flow:
    1. Exa: Search for scheme-related URLs and content
    2. Groq: Synthesize clean explanation from scheme data + Exa context

    Returns:
        tuple of (explanation_text, source_urls)
        Falls back to simple text if APIs unavailable.
    """
    urls: list[str] = []
    exa_context = ""

    # Step 1: Exa search for URLs and context
    if use_exa:
        exa_result = search_scheme_urls(
            scheme_name=scheme.get("name", ""),
            official_link=scheme.get("official_link"),
            num_results=5,
        )
        if exa_result["success"]:
            urls = exa_result["urls"]
            exa_context = exa_result["context"]
        # Always include official link if available
        if scheme.get("official_link") and scheme["official_link"] not in urls:
            urls.insert(0, scheme["official_link"])

    # Step 2: Groq for clean explanation
    if use_groq:
        groq_result = generate_with_groq(
            scheme=scheme,
            language=language,
            exa_context=exa_context if exa_context else None,
        )
        if groq_result["success"]:
            return groq_result["content"], urls

    # Fallback: simple text when APIs unavailable
    base_text = f"""
**Scheme:** {scheme.get('name', 'Unknown')}

**Description:** {scheme.get('description', '')}

**Required Documents:** {', '.join(scheme.get('documents', []))}

**Official Link:** {scheme.get('official_link', 'N/A')}
"""
    if language != "English":
        base_text = f"[Translated to {language}]\n" + base_text

    return base_text.strip(), urls
