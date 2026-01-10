# schemes_data.py
# Structured scheme registry derived from official Indian government sources

SCHEMES = [
    {
        "id": "PMJAY_UP",
        "name": "Ayushman Bharat – PMJAY (Uttar Pradesh)",
        "description": "Government-backed health insurance scheme providing coverage up to ₹5 lakh per family per year.",
        "official_link": "https://ayushmanup.in",
        "is_active": True,
        "status_reason": "PMJAY-UP is an active implementation of the national Ayushman Bharat scheme.",

        # --- Deterministic Eligibility Rules ---
        "criteria": {
            "income_max": 250000,
            "age_min": 0,
            "state": "Uttar Pradesh"
        },

        "documents": [
            "Aadhaar Card",
            "Ration Card",
            "Income Certificate"
        ]
    },

    {
        "id": "UDYAM_REG",
        "name": "Udyam Registration",
        "description": "Government of India initiative for MSME registration to enable access to subsidies and benefits.",
        "official_link": "https://udyamregistration.gov.in",
        "is_active": True,
        "status_reason": "Udyam Registration is the official MSME registration framework.",

        "criteria": {
            "business_owner": True,
            "age_min": 18
        },

        "documents": [
            "Aadhaar Card",
            "PAN Card",
            "Business Details"
        ]
    },

    {
        "id": "ORUNODOI_ASSAM",
        "name": "Orunodoi Scheme (Assam)",
        "description": "Income support scheme for economically weaker households in Assam.",
        "official_link": "https://assam.gov.in",
        "is_active": True,
        "status_reason": "Orunodoi 3.0 is currently active in Assam.",

        "criteria": {
            "income_max": 200000,
            "female_required": True,
            "state": "Assam"
        },

        "documents": [
            "Aadhaar Card",
            "Bank Account Details",
            "Residence Proof"
        ]
    },

    {
        "id": "E_UTTHAAN",
        "name": "e-Utthaan (SC Development Program)",
        "description": "Development Action Plan for Scheduled Castes focusing on education and livelihood.",
        "official_link": "https://e-utthaan.gov.in",
        "is_active": True,
        "status_reason": "The scheme is operational under the Ministry of Social Justice.",

        "criteria": {
            "category": "SC",
            "income_max": 300000
        },

        "documents": [
            "Caste Certificate",
            "Aadhaar Card",
            "Income Certificate"
        ]
    },

    {
        "id": "NPTEL",
        "name": "NPTEL – Online Education Initiative",
        "description": "Government-funded platform offering free online courses from IITs and IISc.",
        "official_link": "https://nptel.ac.in",
        "is_active": True,
        "status_reason": "NPTEL is a nationally recognized education initiative.",

        "criteria": {
            "age_min": 0
        },

        "documents": [
            "Valid Email ID"
        ]
    }
]
