/**
 * Navida SDK - Government Scheme Navigator
 * 
 * A comprehensive SDK for integrating government scheme eligibility
 * checking, AI chatbot, and voice input capabilities into any web application.
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
 * // Check eligibility
 * const schemes = navida.eligibility.check({
 *   age: 35,
 *   income: 150000,
 *   state: 'Maharashtra',
 *   occupation: 'farmer',
 *   gender: 'male',
 *   category: 'general'
 * });
 * 
 * // Chat with AI assistant
 * await navida.chat.sendMessage('Am I eligible for farmer schemes?', {
 *   onToken: (token) => console.log(token),
 *   onComplete: (response) => console.log('Full response:', response)
 * });
 * ```
 */

// Export all SDK components
export { NavidaSDK, type NavidaSDKConfig } from './NavidaSDK';
export { EligibilityChecker } from './EligibilityChecker';
export { ChatClient, type ChatMessage, type ChatOptions, type StreamCallbacks } from './ChatClient';
export { VoiceInput, type VoiceInputConfig, type VoiceInputCallbacks } from './VoiceInput';
export { 
  type Scheme, 
  type UserProfile, 
  schemes, 
  states, 
  occupations,
  categories 
} from './types';
