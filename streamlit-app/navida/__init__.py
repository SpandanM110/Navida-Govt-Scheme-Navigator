"""
Navida Core – Government scheme eligibility and explanation logic.
"""

from navida.schemes_data import SCHEMES
from navida.eligibility_engine import check_eligibility
from navida.llm_utils import generate_explanation

__all__ = ["SCHEMES", "check_eligibility", "generate_explanation"]
