import { nanoid } from 'nanoid';
import { 
  TrackingService, 
  TrackingEvent, 
  EventType, 
  DocumentError,
  PerformanceMetrics 
} from '@/types';

class TrackingServiceImpl implements TrackingService {
  private sessionId: string;
  private userId: string;
  private events: TrackingEvent[] = [];
  private metrics: Map<string, number> = new Map();
  private performanceMarks: Map<string, number> = new Map();
  private isEnabled: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.startPeriodicFlush();
    this.trackEvent({
      type: 'session.started',
      action: 'session_created',
      details: {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId: 'system',
    });
  }

  private generateSessionId(): string {
    return `session_${nanoid(16)}`;
  }

  getUserId(): string {
    // In a real app, this would come from authentication
    const stored = localStorage.getItem('document_conversion_user_id');
    if (stored) {
      return stored;
    }
    const userId = `user_${nanoid(12)}`;
    localStorage.setItem('document_conversion_user_id', userId);
    return userId;
  }

  trackEvent(event: Omit<TrackingEvent, 'id' | 'timestamp'>): void {
    if (!this.isEnabled) return;

    const trackingEvent: TrackingEvent = {
      ...event,
      id: nanoid(16),
      timestamp: new Date().toISOString(),
    };

    this.events.push(trackingEvent);

    // Auto-flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flushEvents();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Tracking Event:', trackingEvent);
    }
  }

  trackMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    this.metrics.set(name, value);
    
    this.trackEvent({
      type: 'performance.measured',
      action: 'metric_recorded',
      details: { name, value },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId: 'system',
    });
  }

  trackError(error: Error, context?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    this.trackEvent({
      type: 'error.occurred',
      action: 'error_logged',
      details: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context,
      },
      sessionId: this.sessionId,
      userId: this.userId,
              documentId: (context?.documentId as string) || 'system',
    });
  }

  trackPerformance(name: string, duration: number): void {
    if (!this.isEnabled) return;

    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      networkRequests: 0,
      bundleSize: 0,
    };

    // Update specific metric based on name
    switch (name) {
      case 'load':
        metrics.loadTime = duration;
        break;
      case 'render':
        metrics.renderTime = duration;
        break;
      case 'interaction':
        metrics.interactionTime = duration;
        break;
    }

    this.trackEvent({
      type: 'performance.measured',
      action: 'performance_tracked',
      details: { name, duration, metrics },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId: 'system',
      performance: metrics,
    });
  }

  startPerformanceMark(name: string): void {
    this.performanceMarks.set(name, performance.now());
  }

  endPerformanceMark(name: string): number {
    const startTime = this.performanceMarks.get(name);
    if (!startTime) {
      throw new DocumentError(`Performance mark '${name}' not found`, 'PERFORMANCE_MARK_NOT_FOUND');
    }

    const duration = performance.now() - startTime;
    this.performanceMarks.delete(name);
    this.trackPerformance(name, duration);
    return duration;
  }

  trackDocumentOperation(
    operation: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | 'imported',
    documentId: string,
    details?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: `document.${operation}` as EventType,
      action: `document_${operation}`,
      details: {
        documentId,
        operation,
        ...details,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackConversionOperation(
    operation: 'started' | 'completed' | 'failed',
    documentId: string,
    sourceType: string,
    details?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: `conversion.${operation}` as EventType,
      action: `conversion_${operation}`,
      details: {
        documentId,
        sourceType,
        operation,
        ...details,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackEditorAction(
    action: string,
    documentId: string,
    nodeId?: string,
    details?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: 'editor.action',
      action,
      details: {
        documentId,
        nodeId,
        ...details,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackPluginOperation(
    operation: 'loaded' | 'error' | 'action',
    pluginId: string,
    documentId: string,
    details?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: `plugin.${operation}` as EventType,
      action: `plugin_${operation}`,
      details: {
        pluginId,
        documentId,
        operation,
        ...details,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackThemeChange(
    oldTheme: string,
    newTheme: string,
    documentId: string
  ): void {
    this.trackEvent({
      type: 'theme.changed',
      action: 'theme_changed',
      details: {
        oldTheme,
        newTheme,
        documentId,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackSearchOperation(
    query: string,
    resultsCount: number,
    documentId: string,
    filters?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: 'search.performed',
      action: 'search_performed',
      details: {
        query,
        resultsCount,
        documentId,
        filters,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackAccessibilityUsage(
    feature: string,
    documentId: string,
    details?: Record<string, unknown>
  ): void {
    this.trackEvent({
      type: 'accessibility.used',
      action: 'accessibility_feature_used',
      details: {
        feature,
        documentId,
        ...details,
      },
      sessionId: this.sessionId,
      userId: this.userId,
      documentId,
    });
  }

  trackUserPreference(
    preference: string,
    value: unknown,
    documentId?: string
  ): void {
    this.trackEvent({
      type: 'user.preference',
      action: 'preference_changed',
      details: {
        preference,
        value,
        documentId,
      },
      sessionId: this.sessionId,
      userId: this.userId,
              documentId: documentId ?? 'system',
    });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getEvents(): TrackingEvent[] {
    return [...this.events];
  }

  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled;
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      void this.flushEvents();
    }, this.flushInterval);
  }

  private flushEvents(): void {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      // In a real app, this would send to your analytics service
      this.sendToAnalytics(eventsToFlush);
      
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`📊 Flushed ${eventsToFlush.length} tracking events`);
      }
    } catch (error) {
      // Restore events if flush failed
      this.events.unshift(...eventsToFlush);
      
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Failed to flush tracking events:', error.message);
      }
    }
  }

  private sendToAnalytics(events: TrackingEvent[]): void {
    // Simulate sending to analytics service
    // In production, this would be your actual analytics endpoint
    const payload = {
      sessionId: this.sessionId,
      userId: this.userId,
      events,
      timestamp: new Date().toISOString(),
    };

    // For now, just store in localStorage for demo purposes
    const existing = localStorage.getItem('document_conversion_analytics');
    const analytics = existing ? JSON.parse(existing) : [];
    analytics.push(payload);
    
    // Keep only last 100 entries to prevent localStorage overflow
    if (analytics.length > 100) {
      analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('document_conversion_analytics', JSON.stringify(analytics));
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    void this.flushEvents();
  }
}

// Singleton instance
let trackingService: TrackingServiceImpl | null = null;

export function getTrackingService(): TrackingService {
  if (!trackingService) {
    trackingService = new TrackingServiceImpl();
  }
  return trackingService;
}

export function destroyTrackingService(): void {
  if (trackingService) {
    trackingService.destroy();
    trackingService = null;
  }
}

// React hook for tracking
export function useTracking() {
  return getTrackingService();
}
