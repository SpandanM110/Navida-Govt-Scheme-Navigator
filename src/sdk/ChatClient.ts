/**
 * Chat Client - AI-powered conversational eligibility checking
 * 
 * Provides streaming chat interface for natural language queries
 * about government schemes and eligibility.
 * 
 * @example
 * ```typescript
 * import { ChatClient } from '@/sdk';
 * 
 * const chat = new ChatClient({
 *   apiUrl: 'https://your-supabase-url.supabase.co/functions/v1'
 * });
 * 
 * // Send message with streaming response
 * await chat.sendMessage('Am I eligible for farmer schemes?', {
 *   onToken: (token) => console.log(token),
 *   onComplete: (response) => console.log('Done:', response)
 * });
 * 
 * // Access chat history
 * console.log(chat.getHistory());
 * ```
 */

import { Language } from './types';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatOptions {
  language?: Language;
  includeHistory?: boolean;
  maxHistoryMessages?: number;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export interface ChatClientConfig {
  apiUrl: string;
  anonKey?: string;
  defaultLanguage?: Language;
}

export class ChatClient {
  private apiUrl: string;
  private anonKey?: string;
  private language: Language;
  private history: ChatMessage[] = [];
  private abortController: AbortController | null = null;

  constructor(config: ChatClientConfig) {
    this.apiUrl = config.apiUrl;
    this.anonKey = config.anonKey;
    this.language = config.defaultLanguage || 'en';
  }

  /**
   * Set the chat language
   */
  setLanguage(language: Language): void {
    this.language = language;
  }

  /**
   * Get current chat history
   */
  getHistory(): ChatMessage[] {
    return [...this.history];
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Add a message to history without sending to API
   */
  addToHistory(message: ChatMessage): void {
    this.history.push({
      ...message,
      timestamp: message.timestamp || new Date(),
    });
  }

  /**
   * Cancel ongoing request
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Send a message and receive streaming response
   */
  async sendMessage(
    content: string,
    callbacks: StreamCallbacks = {},
    options: ChatOptions = {}
  ): Promise<string> {
    const { onToken, onComplete, onError } = callbacks;
    const { 
      language = this.language, 
      includeHistory = true,
      maxHistoryMessages = 10 
    } = options;

    // Add user message to history
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    this.history.push(userMessage);

    // Prepare messages for API
    const messagesToSend = includeHistory 
      ? this.history.slice(-maxHistoryMessages).map(m => ({ role: m.role, content: m.content }))
      : [{ role: 'user' as const, content }];

    // Create abort controller for this request
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.apiUrl}/scheme-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.anonKey && { 'Authorization': `Bearer ${this.anonKey}` }),
        },
        body: JSON.stringify({ messages: messagesToSend, language }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Process streaming response
      const fullResponse = await this.processStream(response.body, onToken);

      // Add assistant response to history
      this.history.push({
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      });

      onComplete?.(fullResponse);
      return fullResponse;

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const cancelError = new Error('Request cancelled');
        onError?.(cancelError);
        throw cancelError;
      }
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      throw err;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Send a message without streaming (waits for complete response)
   */
  async sendMessageSync(
    content: string,
    options: ChatOptions = {}
  ): Promise<string> {
    let fullResponse = '';
    await this.sendMessage(content, {
      onToken: (token) => { fullResponse += token; },
    }, options);
    return fullResponse;
  }

  private async processStream(
    body: ReadableStream<Uint8Array>,
    onToken?: (token: string) => void
  ): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process line by line
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        // Handle CRLF
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }

        // Skip SSE comments and empty lines
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullResponse += content;
            onToken?.(content);
          }
        } catch {
          // Incomplete JSON - put back and wait for more data
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullResponse += content;
            onToken?.(content);
          }
        } catch { /* ignore */ }
      }
    }

    return fullResponse;
  }
}
