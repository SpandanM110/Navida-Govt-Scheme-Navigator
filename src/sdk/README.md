# Navida SDK

A comprehensive JavaScript/TypeScript SDK for integrating government scheme eligibility checking, AI-powered conversational assistance, and voice input capabilities into any web application.

## Installation

The SDK is included in the Navida project. Import it directly:

```typescript
import { NavidaSDK } from '@/sdk';
```

## Quick Start

```typescript
import { NavidaSDK } from '@/sdk';

// Initialize the SDK
const navida = new NavidaSDK({
  apiUrl: 'https://yqbjkxxqswfxlyogaogs.supabase.co/functions/v1',
  language: 'en' // or 'hi' for Hindi
});

// Check eligibility
const schemes = navida.checkEligibility({
  age: 35,
  income: 150000,
  state: 'Maharashtra',
  occupation: 'farmer',
  gender: 'male',
  category: 'general'
});

console.log(`Found ${schemes.length} eligible schemes`);
```

## Features

### 1. Eligibility Checker

Rule-based, deterministic eligibility checking with no AI hallucinations.

```typescript
import { EligibilityChecker } from '@/sdk';

const checker = new EligibilityChecker('en');

// Full eligibility check
const result = checker.check({
  age: 35,
  income: 150000,
  state: 'Maharashtra',
  occupation: 'farmer',
  gender: 'male',
  category: 'general'
});

console.log(result.summary); // { total: 3, byMinistry: {...} }
console.log(result.schemes); // Array of eligible Scheme objects

// Progressive filtering (as user fills form)
const partialMatch = checker.getMatchingSchemes({
  age: 35,
  occupation: 'farmer'
});

// Search schemes
const farmerSchemes = checker.searchSchemes('farmer');

// Get scheme by ID
const pmkisan = checker.getSchemeById('pmkisan');

// Get localized display info
const display = checker.getSchemeDisplay(pmkisan);
console.log(display.name); // "PM-KISAN Samman Nidhi" or "पीएम-किसान सम्मान निधि"
```

### 2. AI Chat Client

Streaming chat interface for natural language queries.

```typescript
import { ChatClient } from '@/sdk';

const chat = new ChatClient({
  apiUrl: 'https://yqbjkxxqswfxlyogaogs.supabase.co/functions/v1',
  defaultLanguage: 'en'
});

// Send message with streaming
await chat.sendMessage('Am I eligible for farmer schemes?', {
  onToken: (token) => {
    // Called for each token as it arrives
    process.stdout.write(token);
  },
  onComplete: (fullResponse) => {
    console.log('\nComplete response:', fullResponse);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  }
});

// Get chat history
const history = chat.getHistory();

// Clear history
chat.clearHistory();

// Cancel ongoing request
chat.cancel();

// Sync version (waits for complete response)
const response = await chat.sendMessageSync('What documents do I need?');
```

### 3. Voice Input

Web Speech API wrapper with Hindi/English language detection.

```typescript
import { VoiceInput } from '@/sdk';

const voice = new VoiceInput({
  defaultLanguage: 'hi',
  continuous: false,
  interimResults: true,
  callbacks: {
    onStart: () => console.log('Listening...'),
    onEnd: () => console.log('Stopped listening'),
    onResult: (transcript, detectedLanguage) => {
      console.log(`Heard: ${transcript} (${detectedLanguage})`);
    },
    onInterimResult: (transcript) => {
      console.log(`Interim: ${transcript}`);
    },
    onError: (error) => console.error(error)
  }
});

// Check if supported
if (voice.isSupported()) {
  // Start listening
  voice.start();
  
  // Check state
  console.log(voice.isListening()); // true
  
  // Stop listening
  voice.stop();
  
  // Or toggle
  voice.toggle();
}

// Static language detection
const lang = VoiceInput.detectLanguage('नमस्ते'); // 'hi'
const lang2 = VoiceInput.detectLanguage('Hello'); // 'en'
```

### 4. Unified SDK

All features combined with convenient helpers.

```typescript
import { NavidaSDK } from '@/sdk';

const navida = new NavidaSDK({
  apiUrl: 'https://yqbjkxxqswfxlyogaogs.supabase.co/functions/v1',
  language: 'en',
  voiceConfig: {
    continuous: false,
    interimResults: true
  }
});

// Change language globally
navida.setLanguage('hi');

// Quick eligibility check
const schemes = navida.checkEligibility(profile);

// Quick chat
const response = await navida.askQuestion('What schemes are available?', 
  (token) => console.log(token)
);

// Voice-to-chat flow (automatically sends speech to AI)
navida.startVoiceChat(
  (token) => updateUI(token),
  (response) => console.log('AI response:', response)
);

// Stop voice chat
navida.stopVoiceChat();

// Reset everything
navida.reset();

// Access static data
console.log(NavidaSDK.schemes);      // All schemes
console.log(NavidaSDK.states);       // All states
console.log(NavidaSDK.occupations);  // All occupations
console.log(NavidaSDK.categories);   // All categories
console.log(NavidaSDK.version);      // "1.0.0"
```

## Types

```typescript
import { 
  Scheme, 
  UserProfile, 
  Language,
  ChatMessage,
  EligibilityResult 
} from '@/sdk';

// User profile for eligibility check
const profile: UserProfile = {
  age: 35,
  income: 150000,
  state: 'Maharashtra',
  occupation: 'farmer',
  gender: 'male',
  category: 'general'
};

// Scheme structure
interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  benefits: string[];
  benefitsHi: string[];
  documents: string[];
  documentsHi: string[];
  officialLink: string;
  ministry: string;
  eligibility: SchemeEligibility;
}
```

## React Integration Example

```tsx
import { useState, useCallback } from 'react';
import { NavidaSDK, Scheme } from '@/sdk';

const navida = new NavidaSDK({
  apiUrl: import.meta.env.VITE_SUPABASE_URL + '/functions/v1',
  language: 'en'
});

function SchemeChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const sendMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, `You: ${text}`]);
    setIsLoading(true);
    setCurrentResponse('');

    await navida.chat.sendMessage(text, {
      onToken: (token) => {
        setCurrentResponse(prev => prev + token);
      },
      onComplete: (response) => {
        setMessages(prev => [...prev, `Navida: ${response}`]);
        setCurrentResponse('');
        setIsLoading(false);
      },
      onError: (error) => {
        setMessages(prev => [...prev, `Error: ${error.message}`]);
        setIsLoading(false);
      }
    });
  }, []);

  const startVoice = () => {
    navida.voice.setCallbacks({
      onResult: (transcript) => sendMessage(transcript)
    });
    navida.voice.start();
  };

  return (
    <div>
      {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      {currentResponse && <p>Navida: {currentResponse}</p>}
      <button onClick={startVoice}>🎤 Speak</button>
    </div>
  );
}
```

## API Reference

### NavidaSDK

| Property/Method | Description |
|----------------|-------------|
| `eligibility` | EligibilityChecker instance |
| `chat` | ChatClient instance |
| `voice` | VoiceInput instance |
| `language` | Current language setting |
| `setLanguage(lang)` | Set language for all components |
| `checkEligibility(profile)` | Quick eligibility check |
| `askQuestion(text, onToken)` | Quick chat helper |
| `startVoiceChat(onToken, onComplete)` | Start voice-to-chat flow |
| `stopVoiceChat()` | Stop voice input |
| `reset()` | Clear history and stop voice |

### EligibilityChecker

| Method | Description |
|--------|-------------|
| `check(profile)` | Full eligibility check |
| `checkScheme(profile, schemeId)` | Check specific scheme |
| `getMatchingSchemes(partial)` | Progressive filtering |
| `getAllSchemes()` | Get all schemes |
| `getSchemeById(id)` | Get scheme by ID |
| `searchSchemes(keyword)` | Search schemes |
| `getSchemeDisplay(scheme)` | Get localized info |
| `getEligibilityExplanation(scheme)` | Get requirements |

### ChatClient

| Method | Description |
|--------|-------------|
| `sendMessage(text, callbacks, options)` | Send with streaming |
| `sendMessageSync(text, options)` | Send and wait |
| `getHistory()` | Get chat history |
| `clearHistory()` | Clear history |
| `cancel()` | Cancel ongoing request |

### VoiceInput

| Method | Description |
|--------|-------------|
| `isSupported()` | Check browser support |
| `isListening()` | Check if active |
| `start()` | Start recognition |
| `stop()` | Stop recognition |
| `toggle()` | Toggle state |
| `setLanguage(lang)` | Set recognition language |
| `setCallbacks(callbacks)` | Update callbacks |

## License

MIT
