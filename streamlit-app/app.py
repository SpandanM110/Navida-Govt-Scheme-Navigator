"""
Navida – AI Logic Layer (Streamlit)
Exa-first flow: User input → Exa search → Llama-4-scout-17b-16e-instruct guidance.
No static schemes_data – dynamic search from the web.
"""

import streamlit as st
from navida.schemes_data import INDIAN_STATES, OCCUPATIONS
from navida.exa_search import search_by_profile
from navida.groq_client import generate_guidance, MODEL_DISPLAY_NAME

st.set_page_config(page_title="Navida – Benefits Navigator", layout="centered")

st.title("Navida – Accessible Benefits Navigator")
st.caption(f"Enter your details → Exa searches the web → {MODEL_DISPLAY_NAME} gives you personalized guidance")

st.divider()

# --- User Inputs ---
st.subheader("Your Profile")

age = st.number_input("Age", min_value=0, max_value=100, value=25)
income = st.number_input("Annual Income (₹)", min_value=0, value=150000)
gender = st.selectbox("Gender", ["Male", "Female", "Other"])

# All Indian States and Union Territories
state_options = [""] + INDIAN_STATES
state = st.selectbox("State / Union Territory", state_options, index=0)

# Occupation with readable labels
occupation_labels = {
    "farmer": "Farmer",
    "agricultural_laborer": "Agricultural Laborer",
    "laborer": "Daily Wage Laborer",
    "construction_worker": "Construction Worker",
    "street_vendor": "Street Vendor",
    "domestic_worker": "Domestic Worker",
    "self_employed": "Self Employed",
    "small_business": "Small Business Owner",
    "artisan": "Artisan / Craftsman",
    "student": "Student",
    "homemaker": "Homemaker",
    "retired": "Retired",
    "unemployed": "Unemployed",
    "others": "Others",
}
occupation_options = [""] + OCCUPATIONS
occupation = st.selectbox(
    "Occupation",
    occupation_options,
    format_func=lambda x: "Select..." if not x else occupation_labels.get(x, x.replace("_", " ").title()),
    index=0,
)

business_owner = st.checkbox("Are you a business owner / MSME?", value=False)
category = st.selectbox(
    "Category (if applicable)",
    ["", "General", "OBC", "SC", "ST"],
    index=0,
)
language = st.selectbox("Preferred Language", ["English", "Hindi", "Tamil", "Bengali"])

user_profile = {
    "age": age,
    "income": income,
    "gender": gender,
    "state": state.strip() or None,
    "occupation": occupation.strip() or None,
    "business_owner": business_owner,
    "category": category.strip() or None,
}

st.divider()

if st.button("Find schemes for me", type="primary"):
    with st.spinner("Searching the web for relevant schemes..."):
        exa_result = search_by_profile(user_profile, num_results=10)

    if not exa_result["success"]:
        st.error(f"Search failed: {exa_result.get('error', 'Unknown error')}")
        st.info("Make sure EXA_API_KEY is set in your .env file.")
    else:
        urls = exa_result["urls"]
        context = exa_result["context"]

        if not context:
            st.warning("No results found from search. Try adjusting your profile or check your Exa API key.")
        else:
            with st.spinner(f"Generating personalized guidance with {MODEL_DISPLAY_NAME}..."):
                groq_result = generate_guidance(
                    user_profile=user_profile,
                    exa_context=context,
                    urls=urls,
                    language=language,
                )

            if not groq_result["success"]:
                st.error(f"Guidance failed: {groq_result.get('error', 'Unknown error')}")
                st.info("Make sure GROQ_API_KEY is set in your .env file (used for Llama model).")
            else:
                st.success("Here's your personalized guidance:")
                st.markdown(groq_result["content"])
                st.caption(f"Powered by Exa Search + {MODEL_DISPLAY_NAME}")
