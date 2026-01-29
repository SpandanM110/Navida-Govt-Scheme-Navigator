"""
Deterministic eligibility engine – rule-based, no AI involvement in qualification logic.
Supports: income, age, gender, state, occupation, category, business_owner, farmer.
"""


def check_eligibility(user_profile: dict, schemes: list) -> list:
    """
    Check user eligibility against scheme criteria.

    user_profile: age, income, gender, state, occupation, category, business_owner
    """
    eligible_schemes = []

    for scheme in schemes:
        criteria = scheme.get("criteria", {})
        eligible = True

        # Income check
        if "income_max" in criteria:
            if user_profile.get("income", 0) > criteria["income_max"]:
                eligible = False

        # Age check
        if "age_min" in criteria:
            if user_profile.get("age", 0) < criteria["age_min"]:
                eligible = False
        if "age_max" in criteria:
            if user_profile.get("age", 999) > criteria["age_max"]:
                eligible = False

        # Gender check
        if "gender" in criteria:
            user_gender = (user_profile.get("gender") or "").strip()
            required = str(criteria["gender"]).strip()
            if required and user_gender.lower() != required.lower():
                eligible = False
        elif "female_required" in criteria and criteria["female_required"]:
            if user_profile.get("gender") != "Female":
                eligible = False

        # State check – single state
        if "state" in criteria:
            user_state = (user_profile.get("state") or "").strip()
            if user_state and user_state.lower() != str(criteria["state"]).strip().lower():
                eligible = False

        # States check – list of states (scheme available in specific states)
        if "states" in criteria:
            user_state = (user_profile.get("state") or "").strip()
            allowed = [s.strip().lower() for s in criteria["states"]]
            if user_state and user_state.lower() not in allowed:
                eligible = False

        # Business owner check
        if "business_owner" in criteria and criteria["business_owner"]:
            if not user_profile.get("business_owner", False):
                eligible = False

        # Farmer check (occupation: farmer or agricultural_laborer)
        if "farmer" in criteria and criteria["farmer"]:
            occ = (user_profile.get("occupation") or "").strip().lower()
            if occ not in ("farmer", "agricultural_laborer"):
                eligible = False

        # Category check – single (SC, ST, OBC, General)
        if "category" in criteria:
            user_cat = (user_profile.get("category") or "").strip().upper()
            required = str(criteria["category"]).strip().upper()
            if not user_cat or user_cat != required:
                eligible = False

        # Categories check – list (scheme for SC or ST or OBC)
        if "categories" in criteria:
            user_cat = (user_profile.get("category") or "").strip().upper()
            allowed = [c.strip().upper() for c in criteria["categories"]]
            if not user_cat or user_cat not in allowed:
                eligible = False

        # Categories OR Female (e.g. Stand-Up India: SC/ST or women)
        if "categories_or_female" in criteria:
            user_cat = (user_profile.get("category") or "").strip().upper()
            user_gender = (user_profile.get("gender") or "").strip().lower()
            allowed = [c.strip().upper() for c in criteria["categories_or_female"]]
            cat_ok = user_cat and user_cat in allowed
            female_ok = user_gender == "female"
            if not (cat_ok or female_ok):
                eligible = False

        # Occupation check
        if "occupations" in criteria:
            user_occ = (user_profile.get("occupation") or "").strip().lower()
            allowed = [o.strip().lower() for o in criteria["occupations"]]
            if not user_occ:
                eligible = False
            elif "others" in allowed:
                # "others" acts as catch-all
                pass
            elif user_occ not in allowed:
                eligible = False

        if eligible:
            eligible_schemes.append(scheme)

    return eligible_schemes
