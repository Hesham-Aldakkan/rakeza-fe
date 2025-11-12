import { getConfig } from './config';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

class Analytics {
  private enabled: boolean;
  private consentGiven: boolean;

  constructor() {
    const config = getConfig();
    this.enabled = config.analytics.enabled && !!config.analytics.key;
    this.consentGiven = this.getConsentStatus();
  }

  /**
   * Check if analytics consent has been given
   */
  private getConsentStatus(): boolean {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem('analytics-consent');
    if (stored !== null) {
      return stored === 'true';
    }

    // Default to false (opt-in)
    return false;
  }

  /**
   * Request analytics consent from user
   */
  public requestConsent(): boolean {
    if (typeof window === 'undefined') return false;

    // This would typically show a banner
    // For now, return the current status
    return this.consentGiven;
  }

  /**
   * Grant analytics consent
   */
  public grantConsent(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('analytics-consent', 'true');
    this.consentGiven = true;
  }

  /**
   * Revoke analytics consent
   */
  public revokeConsent(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('analytics-consent', 'false');
    this.consentGiven = false;
  }

  /**
   * Track an event
   */
  public track(event: AnalyticsEvent): void {
    if (!this.enabled || !this.consentGiven) {
      return;
    }

    const config = getConfig();

    const payload = {
      name: event.name,
      properties: event.properties || {},
      timestamp: event.timestamp || new Date().toISOString(),
    };

    // Send to analytics backend
    // Example: Post Hog, Plausible, Mixpanel, etc.
    if (typeof fetch !== 'undefined') {
      fetch(`${config.api.baseUrl}/analytics/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => {
        console.warn('Failed to send analytics:', err);
      });
    }
  }

  /**
   * Track page view
   */
  public pageView(pathname: string): void {
    this.track({
      name: 'pageview',
      properties: {
        pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      },
    });
  }

  /**
   * Track user action
   */
  public action(action: string, properties?: Record<string, unknown>): void {
    this.track({
      name: `action:${action}`,
      properties,
    });
  }

  /**
   * Track error
   */
  public error(error: Error, properties?: Record<string, unknown>): void {
    this.track({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...properties,
      },
    });
  }

  /**
   * Track sign up
   */
  public signUp(userId: string): void {
    this.track({
      name: 'signup',
      properties: { userId },
    });
  }

  /**
   * Track sign in
   */
  public signIn(userId: string): void {
    this.track({
      name: 'signin',
      properties: { userId },
    });
  }

  /**
   * Track chat message
   */
  public chatMessage(models: string[], tokenCount?: number): void {
    this.track({
      name: 'chat:message',
      properties: {
        models,
        tokenCount,
      },
    });
  }

  /**
   * Track model selection
   */
  public selectModel(modelId: string): void {
    this.track({
      name: 'model:select',
      properties: { modelId },
    });
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null;

export function getAnalytics(): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  return analyticsInstance;
}

/**
 * Convenience functions
 */
export const analytics = {
  track: (event: AnalyticsEvent) => getAnalytics().track(event),
  pageView: (pathname: string) => getAnalytics().pageView(pathname),
  action: (action: string, props?: Record<string, unknown>) =>
    getAnalytics().action(action, props),
  error: (error: Error, props?: Record<string, unknown>) =>
    getAnalytics().error(error, props),
  signUp: (userId: string) => getAnalytics().signUp(userId),
  signIn: (userId: string) => getAnalytics().signIn(userId),
  chatMessage: (models: string[], tokens?: number) =>
    getAnalytics().chatMessage(models, tokens),
  selectModel: (modelId: string) => getAnalytics().selectModel(modelId),
  requestConsent: () => getAnalytics().requestConsent(),
  grantConsent: () => getAnalytics().grantConsent(),
  revokeConsent: () => getAnalytics().revokeConsent(),
};
