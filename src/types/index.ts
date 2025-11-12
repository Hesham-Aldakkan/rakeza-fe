// Common Types
export type Locale = 'ar' | 'en';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  traceId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  organization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  masked: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// Chat & Message Types
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  model?: string;
  createdAt: string;
  updatedAt: string;
  tokens?: {
    input: number;
    output: number;
  };
  metadata?: Record<string, unknown>;
}

export interface Chat {
  id: string;
  title: string;
  description?: string;
  userId: string;
  messages: ChatMessage[];
  models: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isFavorite: boolean;
  metadata?: Record<string, unknown>;
}

export interface StreamingMessage {
  type: 'content' | 'token_usage' | 'error' | 'done';
  content?: string;
  tokens?: { input: number; output: number };
  error?: { code: string; message: string };
}

// Model Types
export interface ModelCapability {
  type: 'text' | 'image' | 'audio' | 'vision';
  enabled: boolean;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  capabilities: ModelCapability[];
  contextWindow?: number;
  maxTokens?: number;
  inputCostPerToken?: number;
  outputCostPerToken?: number;
  latencyMs?: number;
  availability: 'available' | 'degraded' | 'unavailable';
  description?: {
    ar: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Usage & Analytics Types
export interface Usage {
  modelId: string;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  date: string;
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  period: {
    start: string;
    end: string;
  };
  breakdown: {
    byModel: Record<string, Usage>;
    byDay: Record<string, Usage>;
  };
}

// Billing Types
export interface Balance {
  available: number;
  reserved: number;
  currency: string;
}

export interface BillingInfo {
  balance: Balance;
  nextBillingDate?: string;
  billingEmail?: string;
  paymentMethod?: {
    type: 'card' | 'bank_account';
    last4: string;
    expiryDate?: string;
  };
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  locale: Locale;
  emailNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
}

// Request/Response Types for API
export interface CreateChatRequest {
  title: string;
  models: string[];
  description?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  models: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface StreamingRequest {
  chatId: string;
  content: string;
  models: string[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark' | 'system';
  locale?: Locale;
  emailNotifications?: boolean;
  marketingEmails?: boolean;
}

// Error Types
export interface ApiError extends Error {
  code: string;
  statusCode: number;
  traceId?: string;
  details?: Record<string, unknown>;
}

// Feature Flag Types
export interface FeatureFlags {
  chat: boolean;
  parallel: boolean;
  mediator: boolean;
  models: boolean;
  usage: boolean;
  billing: boolean;
}
