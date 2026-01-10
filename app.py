import streamlit as st
from schemes_data import SCHEMES
from eligibility_engine import check_eligibility
from llm_utils import generate_explanation

st.set_page_config(page_title="Navida – AI Logic Layer", layout="centered")

st.title("Navida – Accessible Benefits Navigator")
st.caption("AI & Eligibility Logic Prototype (Streamlit Layer)")

st.divider()

# --- User Inputs ---
age = st.number_input("Age", min_value=0, max_value=100, value=25)
income = st.number_input("Annual Income (₹)", min_value=0, value=150000)
gender = st.selectbox("Gender", ["Male", "Female", "Other"])
language = st.selectbox("Preferred Language", ["English", "Hindi", "Tamil", "Bengali"])

user_profile = {
    "age": age,
    "income": income,
    "gender": gender
}

if st.button("Check Eligible Schemes"):
    eligible = check_eligibility(user_profile, SCHEMES)

    if not eligible:
        st.warning("No schemes found for your profile.")
    else:
        st.success(f"You are eligible for {len(eligible)} scheme(s).")

        for scheme in eligible:
            with st.expander(scheme["name"]):
                explanation = generate_explanation(scheme, language)
                st.text(explanation)
