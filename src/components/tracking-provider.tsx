'use client';

import { ReactNode, useEffect } from 'react';
import { getTrackingService, destroyTrackingService } from '@/telemetry/tracking';

interface TrackingProviderProps {
  children: ReactNode;
}

export function TrackingProvider({ children }: TrackingProviderProps) {
  useEffect(() => {
    // Initialize tracking service
    const tracking = getTrackingService();
    
    // Track app initialization
    tracking.trackEvent({
      type: 'app.initialized',
      action: 'app_started',
      details: {
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });

    // Cleanup on unmount
    return () => {
      destroyTrackingService();
    };
  }, []);

  return <>{children}</>;
}
