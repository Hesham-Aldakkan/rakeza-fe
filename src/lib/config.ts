import { z } from 'zod';

const configSchema = z.object({
  // API Configuration
  api: z.object({
    baseUrl: z.string().url('Invalid API base URL'),
    timeoutMs: z.number().int().positive().default(30000),
    maxRetries: z.number().int().nonnegative().default(3),
    retryDelayMs: z.number().int().nonnegative().default(1000),
  }),

  // Localization
  i18n: z.object({
    defaultLocale: z.enum(['ar', 'en']).default('ar'),
    supportedLocales: z.array(z.enum(['ar', 'en'])).default(['ar', 'en']),
  }),

  // Features
  features: z.object({
    chat: z.boolean().default(true),
    parallel: z.boolean().default(true),
    mediator: z.boolean().default(true),
    models: z.boolean().default(true),
    usage: z.boolean().default(true),
    billing: z.boolean().default(true),
  }),

  // Streaming
  streaming: z.object({
    heartbeatMs: z.number().int().positive().default(30000),
    maxModelsPerRequest: z.number().int().positive().default(5),
  }),

  // Site Configuration
  site: z.object({
    name: z.string().default('Rakeza'),
    description: z
      .string()
      .default('Unified access to the world\'s most powerful AI models'),
    baseUrl: z.string().url('Invalid base URL'),
    ogImageUrl: z.string().url('Invalid OG image URL').optional(),
  }),

  // Analytics & Observability
  analytics: z.object({
    key: z.string().optional(),
    enabled: z.boolean().default(false),
  }),

  sentry: z.object({
    dsn: z.string().url().optional(),
    environment: z.string().default('development'),
    release: z.string().optional(),
  }),

  // Security
  security: z.object({
    cspNonceHeader: z.string().default('x-nonce'),
  }),

  // Stripe
  stripe: z.object({
    publishableKey: z.string().optional(),
    secretKey: z.string().optional(),
  }),

  // Contact Form
  contact: z.object({
    endpoint: z.string().url().optional(),
  }),
});

type Config = z.infer<typeof configSchema>;

function parseEnv(): Config {
  const supportedLocalesStr = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'ar,en';
  const supportedLocales = supportedLocalesStr
    .split(',')
    .map((l) => l.trim()) as ['ar', 'en'] | ['ar'] | ['en'];

  const raw = {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      timeoutMs: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || '30000', 10),
      maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3', 10),
      retryDelayMs: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY_MS || '1000', 10),
    },
    i18n: {
      defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ar',
      supportedLocales: supportedLocales,
    },
    features: {
      chat: process.env.NEXT_PUBLIC_FEATURE_CHAT !== 'false',
      parallel: process.env.NEXT_PUBLIC_FEATURE_PARALLEL !== 'false',
      mediator: process.env.NEXT_PUBLIC_FEATURE_MEDIATOR !== 'false',
      models: process.env.NEXT_PUBLIC_FEATURE_MODELS !== 'false',
      usage: process.env.NEXT_PUBLIC_FEATURE_USAGE !== 'false',
      billing: process.env.NEXT_PUBLIC_FEATURE_BILLING !== 'false',
    },
    streaming: {
      heartbeatMs: parseInt(process.env.NEXT_PUBLIC_STREAM_HEARTBEAT_MS || '30000', 10),
      maxModelsPerRequest: parseInt(
        process.env.NEXT_PUBLIC_MAX_MODELS_PER_REQUEST || '5',
        10
      ),
    },
    site: {
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Rakeza',
      description:
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        'Unified access to the world\'s most powerful AI models',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      ogImageUrl: process.env.NEXT_PUBLIC_OG_IMAGE_URL,
    },
    analytics: {
      key: process.env.NEXT_PUBLIC_ANALYTICS_KEY,
      enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
      release: process.env.SENTRY_RELEASE,
    },
    security: {
      cspNonceHeader: process.env.NEXT_PUBLIC_CSP_NONCE_HEADER || 'x-nonce',
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
    contact: {
      endpoint: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT,
    },
  };

  return configSchema.parse(raw);
}

let config: Config | null = null;

export function getConfig(): Config {
  if (!config) {
    config = parseEnv();
  }
  return config;
}

export function resetConfig(): void {
  config = null;
}

export type { Config };
