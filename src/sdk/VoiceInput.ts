/**
 * Voice Input - Web Speech API wrapper with language detection
 * 
 * Provides voice input functionality for low-literacy users
 * with support for Hindi and English.
 * 
 * @example
 * ```typescript
 * import { VoiceInput } from '@/sdk';
 * 
 * const voice = new VoiceInput({
 *   defaultLanguage: 'hi',
 *   continuous: false,
 *   onResult: (text, language) => {
 *     console.log(`Heard: ${text} (${language})`);
 *   },
 *   onError: (error) => console.error(error)
 * });
 * 
 * // Check if supported
 * if (voice.isSupported()) {
 *   voice.start();
 * }
 * ```
 */

import { Language } from './types';

export interface VoiceInputCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (transcript: string, detectedLanguage: Language) => void;
  onInterimResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export interface VoiceInputConfig {
  defaultLanguage?: Language;
  continuous?: boolean;
  interimResults?: boolean;
  callbacks?: VoiceInputCallbacks;
}

// Type definitions for Web Speech API
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export class VoiceInput {
  private recognition: SpeechRecognitionInstance | null = null;
  private language: Language;
  private continuous: boolean;
  private interimResults: boolean;
  private callbacks: VoiceInputCallbacks;
  private _isListening: boolean = false;

  // Hindi character detection regex
  private static hindiPattern = /[\u0900-\u097F]/;

  constructor(config: VoiceInputConfig = {}) {
    this.language = config.defaultLanguage || 'en';
    this.continuous = config.continuous || false;
    this.interimResults = config.interimResults !== false;
    this.callbacks = config.callbacks || {};
    
    this.initRecognition();
  }

  /**
   * Check if Web Speech API is supported
   */
  isSupported(): boolean {
    const win = window as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  /**
   * Check if currently listening
   */
  isListening(): boolean {
    return this._isListening;
  }

  /**
   * Set the recognition language
   */
  setLanguage(language: Language): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = this.getRecognitionLanguage(language);
    }
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.language;
  }

  /**
   * Update callbacks
   */
  setCallbacks(callbacks: VoiceInputCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Start voice recognition
   */
  start(): boolean {
    if (!this.recognition) {
      this.callbacks.onError?.('Voice recognition not supported');
      return false;
    }

    if (this._isListening) {
      return true;
    }

    try {
      this.recognition.lang = this.getRecognitionLanguage(this.language);
      this.recognition.start();
      return true;
    } catch (error) {
      this.callbacks.onError?.('Failed to start voice recognition');
      return false;
    }
  }

  /**
   * Stop voice recognition
   */
  stop(): void {
    if (this.recognition && this._isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Abort voice recognition (discards current results)
   */
  abort(): void {
    if (this.recognition && this._isListening) {
      this.recognition.abort();
    }
  }

  /**
   * Detect language from text content
   */
  static detectLanguage(text: string): Language {
    return VoiceInput.hindiPattern.test(text) ? 'hi' : 'en';
  }

  /**
   * Toggle listening state
   */
  toggle(): boolean {
    if (this._isListening) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  private initRecognition(): void {
    const win = window as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    
    if (!SpeechRecognitionClass) {
      return;
    }

    this.recognition = new SpeechRecognitionClass();
    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this._isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onend = () => {
      this._isListening = false;
      this.callbacks.onEnd?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && this.callbacks.onInterimResult) {
        this.callbacks.onInterimResult(interimTranscript);
      }

      if (finalTranscript && this.callbacks.onResult) {
        const detectedLang = VoiceInput.detectLanguage(finalTranscript);
        this.callbacks.onResult(finalTranscript.trim(), detectedLang);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this._isListening = false;
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not available.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error occurred.',
        'aborted': 'Recognition was aborted.',
        'service-not-allowed': 'Speech service not allowed.',
      };
      const message = errorMessages[event.error] || `Error: ${event.error}`;
      this.callbacks.onError?.(message);
    };
  }

  private getRecognitionLanguage(lang: Language): string {
    return lang === 'hi' ? 'hi-IN' : 'en-IN';
  }
}
