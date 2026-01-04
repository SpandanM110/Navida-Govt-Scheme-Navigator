/**
 * Navida SDK - Main entry point
 * 
 * Unified SDK for government scheme eligibility checking,
 * AI-powered chat, and voice input capabilities.
 * 
 * @example
 * ```typescript
 * import { NavidaSDK } from '@/sdk';
 * 
 * const navida = new NavidaSDK({
 *   apiUrl: 'https://yqbjkxxqswfxlyogaogs.supabase.co/functions/v1',
 *   language: 'en'
 * });
 * 
 * // Check eligibility using rule-based engine
 * const result = navida.eligibility.check({
 *   age: 35,
 *   income: 150000,
 *   state: 'Maharashtra',
 *   occupation: 'farmer',
 *   gender: 'male',
 *   category: 'general'
 * });
 * 
 * // Chat with AI assistant
 * await navida.chat.sendMessage('What schemes are available for farmers?', {
 *   onToken: (token) => process.stdout.write(token),
 *   onComplete: (response) => console.log('\nDone!')
 * });
 * 
 * // Use voice input
 * navida.voice.setCallbacks({
 *   onResult: (text, lang) => {
 *     console.log(`User said: ${text} (${lang})`);
 *     navida.chat.sendMessage(text, callbacks);
 *   }
 * });
 * navida.voice.start();
 * ```
 */

import { EligibilityChecker } from './EligibilityChecker';
import { ChatClient } from './ChatClient';
import { VoiceInput, VoiceInputCallbacks } from './VoiceInput';
import { Language, Scheme, UserProfile, schemes, states, occupations, categories } from './types';

export interface NavidaSDKConfig {
  apiUrl: string;
  anonKey?: string;
  language?: Language;
  voiceConfig?: {
    continuous?: boolean;
    interimResults?: boolean;
    callbacks?: VoiceInputCallbacks;
  };
}

export class NavidaSDK {
  /**
   * Rule-based eligibility checker
   */
  public readonly eligibility: EligibilityChecker;

  /**
   * AI-powered chat client with streaming
   */
  public readonly chat: ChatClient;

  /**
   * Voice input with language detection
   */
  public readonly voice: VoiceInput;

  /**
   * Current language setting
   */
  private _language: Language;

  /**
   * Static reference to all schemes
   */
  public static readonly schemes = schemes;

  /**
   * Static reference to all states
   */
  public static readonly states = states;

  /**
   * Static reference to all occupations
   */
  public static readonly occupations = occupations;

  /**
   * Static reference to all categories
   */
  public static readonly categories = categories;

  constructor(config: NavidaSDKConfig) {
    this._language = config.language || 'en';

    this.eligibility = new EligibilityChecker(this._language);
    
    this.chat = new ChatClient({
      apiUrl: config.apiUrl,
      anonKey: config.anonKey,
      defaultLanguage: this._language,
    });

    this.voice = new VoiceInput({
      defaultLanguage: this._language,
      continuous: config.voiceConfig?.continuous || false,
      interimResults: config.voiceConfig?.interimResults !== false,
      callbacks: config.voiceConfig?.callbacks,
    });
  }

  /**
   * Get current language
   */
  get language(): Language {
    return this._language;
  }

  /**
   * Set language for all SDK components
   */
  setLanguage(language: Language): void {
    this._language = language;
    this.eligibility.setLanguage(language);
    this.chat.setLanguage(language);
    this.voice.setLanguage(language);
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.0.0';
  }

  /**
   * Quick eligibility check helper
   */
  checkEligibility(profile: UserProfile): Scheme[] {
    return this.eligibility.check(profile).schemes;
  }

  /**
   * Quick chat helper with voice result integration
   */
  async askQuestion(
    question: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    return this.chat.sendMessage(question, { onToken });
  }

  /**
   * Start voice-to-chat flow
   * Automatically sends recognized speech to chat
   */
  startVoiceChat(
    onToken?: (token: string) => void,
    onComplete?: (response: string) => void
  ): void {
    this.voice.setCallbacks({
      onResult: async (transcript, detectedLang) => {
        this.setLanguage(detectedLang);
        await this.chat.sendMessage(transcript, { onToken, onComplete });
      },
    });
    this.voice.start();
  }

  /**
   * Stop voice chat
   */
  stopVoiceChat(): void {
    this.voice.stop();
  }

  /**
   * Reset SDK state (clear chat history, stop voice)
   */
  reset(): void {
    this.chat.clearHistory();
    this.voice.stop();
  }
}
