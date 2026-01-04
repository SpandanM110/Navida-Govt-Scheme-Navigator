/**
 * Eligibility Checker - Rule-based eligibility engine
 * 
 * Deterministic eligibility checking with no AI hallucinations.
 * All eligibility decisions are based on defined rules.
 * 
 * @example
 * ```typescript
 * import { EligibilityChecker } from '@/sdk';
 * 
 * const checker = new EligibilityChecker();
 * 
 * const eligibleSchemes = checker.check({
 *   age: 35,
 *   income: 150000,
 *   state: 'Maharashtra',
 *   occupation: 'farmer',
 *   gender: 'male',
 *   category: 'general'
 * });
 * 
 * console.log(`Found ${eligibleSchemes.length} schemes`);
 * ```
 */

import { Scheme, UserProfile, schemes, Language } from './types';

export interface EligibilityResult {
  eligible: boolean;
  schemes: Scheme[];
  summary: {
    total: number;
    byMinistry: Record<string, number>;
  };
}

export interface PartialProfile {
  age?: number;
  income?: number;
  state?: string;
  occupation?: string;
  gender?: string;
  category?: string;
}

export class EligibilityChecker {
  private schemes: Scheme[];
  private language: Language;

  constructor(language: Language = 'en') {
    this.schemes = schemes;
    this.language = language;
  }

  /**
   * Set the display language for scheme information
   */
  setLanguage(language: Language): void {
    this.language = language;
  }

  /**
   * Get all available schemes
   */
  getAllSchemes(): Scheme[] {
    return [...this.schemes];
  }

  /**
   * Get a specific scheme by ID
   */
  getSchemeById(id: string): Scheme | undefined {
    return this.schemes.find(s => s.id === id);
  }

  /**
   * Search schemes by keyword
   */
  searchSchemes(keyword: string): Scheme[] {
    const lower = keyword.toLowerCase();
    return this.schemes.filter(s => 
      s.name.toLowerCase().includes(lower) ||
      s.nameHi.includes(keyword) ||
      s.description.toLowerCase().includes(lower) ||
      s.descriptionHi.includes(keyword) ||
      s.ministry.toLowerCase().includes(lower)
    );
  }

  /**
   * Check eligibility for all schemes based on user profile
   */
  check(profile: UserProfile): EligibilityResult {
    const eligibleSchemes = this.schemes.filter((scheme) => {
      return this.isEligible(profile, scheme);
    });

    const byMinistry: Record<string, number> = {};
    eligibleSchemes.forEach(s => {
      byMinistry[s.ministry] = (byMinistry[s.ministry] || 0) + 1;
    });

    return {
      eligible: eligibleSchemes.length > 0,
      schemes: eligibleSchemes,
      summary: {
        total: eligibleSchemes.length,
        byMinistry,
      },
    };
  }

  /**
   * Check eligibility for a specific scheme
   */
  checkScheme(profile: UserProfile, schemeId: string): boolean {
    const scheme = this.getSchemeById(schemeId);
    if (!scheme) return false;
    return this.isEligible(profile, scheme);
  }

  /**
   * Get schemes that match partial profile
   * Useful for progressive filtering as user fills form
   */
  getMatchingSchemes(partial: PartialProfile): Scheme[] {
    return this.schemes.filter((scheme) => {
      const e = scheme.eligibility;

      // Age check (if provided)
      if (partial.age !== undefined) {
        if (e.minAge && partial.age < e.minAge) return false;
        if (e.maxAge && partial.age > e.maxAge) return false;
      }

      // Income check (if provided)
      if (partial.income !== undefined) {
        if (e.maxIncome && partial.income > e.maxIncome) return false;
      }

      // Gender check (if provided)
      if (partial.gender !== undefined && e.gender && e.gender !== 'all') {
        if (partial.gender !== e.gender) return false;
      }

      // Occupation check (if provided)
      if (partial.occupation !== undefined && e.occupations && e.occupations.length > 0) {
        if (!e.occupations.includes(partial.occupation) && !e.occupations.includes('others')) {
          return false;
        }
      }

      // State check (if provided)
      if (partial.state !== undefined && e.states && e.states.length > 0) {
        if (!e.states.includes(partial.state)) return false;
      }

      return true;
    });
  }

  /**
   * Get scheme display info based on current language
   */
  getSchemeDisplay(scheme: Scheme): {
    name: string;
    description: string;
    benefits: string[];
    documents: string[];
  } {
    if (this.language === 'hi') {
      return {
        name: scheme.nameHi,
        description: scheme.descriptionHi,
        benefits: scheme.benefitsHi,
        documents: scheme.documentsHi,
      };
    }
    return {
      name: scheme.name,
      description: scheme.description,
      benefits: scheme.benefits,
      documents: scheme.documents,
    };
  }

  /**
   * Get eligibility explanation for a scheme
   */
  getEligibilityExplanation(scheme: Scheme): string[] {
    const e = scheme.eligibility;
    const requirements: string[] = [];

    if (e.minAge) {
      requirements.push(this.language === 'hi' 
        ? `न्यूनतम आयु: ${e.minAge} वर्ष`
        : `Minimum age: ${e.minAge} years`);
    }
    if (e.maxAge) {
      requirements.push(this.language === 'hi'
        ? `अधिकतम आयु: ${e.maxAge} वर्ष`
        : `Maximum age: ${e.maxAge} years`);
    }
    if (e.maxIncome) {
      requirements.push(this.language === 'hi'
        ? `अधिकतम आय: ₹${e.maxIncome.toLocaleString('en-IN')}/वर्ष`
        : `Maximum income: ₹${e.maxIncome.toLocaleString('en-IN')}/year`);
    }
    if (e.gender && e.gender !== 'all') {
      requirements.push(this.language === 'hi'
        ? `लिंग: ${e.gender === 'female' ? 'महिला' : 'पुरुष'}`
        : `Gender: ${e.gender}`);
    }
    if (e.occupations && e.occupations.length > 0) {
      requirements.push(this.language === 'hi'
        ? `व्यवसाय: विशिष्ट व्यवसाय आवश्यक`
        : `Occupation: Specific occupations required`);
    }

    return requirements;
  }

  private isEligible(profile: UserProfile, scheme: Scheme): boolean {
    const e = scheme.eligibility;

    // Age check
    if (e.minAge && profile.age < e.minAge) return false;
    if (e.maxAge && profile.age > e.maxAge) return false;

    // Income check
    if (e.maxIncome && profile.income > e.maxIncome) return false;

    // Gender check
    if (e.gender && e.gender !== 'all' && profile.gender !== e.gender) return false;

    // Occupation check
    if (e.occupations && e.occupations.length > 0) {
      if (!e.occupations.includes(profile.occupation) && !e.occupations.includes('others')) {
        return false;
      }
    }

    // State check (if specified)
    if (e.states && e.states.length > 0) {
      if (!e.states.includes(profile.state)) return false;
    }

    return true;
  }
}
