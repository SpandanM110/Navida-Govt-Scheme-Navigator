def generate_explanation(scheme, language="English"):
    base_text = f"""
    Scheme Name: {scheme['name']}
    Description: {scheme['description']}
    Required Documents: {', '.join(scheme['documents'])}
    """

    if language == "English":
        return base_text

    # Placeholder for open-source LLM call
    # Later replace with Gemma / Qwen inference
    translated_text = f"[Translated to {language}]\n" + base_text
    return translated_text
