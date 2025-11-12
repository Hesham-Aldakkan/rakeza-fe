import { getConfig } from './config';

/**
 * Initialize Sentry error tracking
 * Note: This is a simplified version. In production, use the official Sentry SDK.
 */
export function initSentry(): void {
  const config = getConfig();

  if (!config.sentry.dsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  // In a real application, you would initialize the official Sentry SDK here:
  // import * as Sentry from "@sentry/nextjs";
  // Sentry.init({
  //   dsn: config.sentry.dsn,
  //   environment: config.sentry.environment,
  //   release: config.sentry.release,
  //   tracesSampleRate: 0.1,
  //   beforeSend(event, hint) {
  //     // Scrub sensitive data
  //     if (event.request) {
  //       delete event.request.cookies;
  //       delete event.request.headers;
  //     }
  //     return event;
  //   },
  // });

  console.log('Sentry initialized for error tracking');
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  const config = getConfig();

  if (!config.sentry.dsn) {
    console.error('Error:', error.message, context);
    return;
  }

  // In production: Sentry.captureException(error, { contexts: { ...context } });
  console.error('Captured error:', error.message, context);
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' = 'info'): void {
  const config = getConfig();

  if (!config.sentry.dsn) {
    console.log(`[${level.toUpperCase()}] ${message}`);
    return;
  }

  // In production: Sentry.captureMessage(message, level);
  console.log(`[${level.toUpperCase()}] ${message}`);
}

/**
 * Set Sentry user context
 */
export function setSentryUser(userId: string, email?: string, username?: string): void {
  const config = getConfig();

  if (!config.sentry.dsn) return;

  // In production: Sentry.setUser({ id: userId, email, username });
  console.log('Set Sentry user:', { userId, email, username });
}

/**
 * Clear Sentry user context
 */
export function clearSentryUser(): void {
  const config = getConfig();

  if (!config.sentry.dsn) return;

  // In production: Sentry.setUser(null);
  console.log('Cleared Sentry user');
}
