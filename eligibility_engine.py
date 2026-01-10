def check_eligibility(user_profile, schemes):
    eligible_schemes = []

    for scheme in schemes:
        criteria = scheme["criteria"]
        eligible = True

        if "income_max" in criteria:
            if user_profile["income"] > criteria["income_max"]:
                eligible = False

        if "age_min" in criteria:
            if user_profile["age"] < criteria["age_min"]:
                eligible = False

        if "female_required" in criteria:
            if criteria["female_required"] and user_profile["gender"] != "Female":
                eligible = False

        if eligible:
            eligible_schemes.append(scheme)

    return eligible_schemes
