jest.mock('nanoid', () => ({ nanoid: () => 'id' }));
import { getTrackingService, destroyTrackingService } from '../tracking';

describe('TrackingService', () => {
  beforeEach(() => {
    localStorage.clear();
    destroyTrackingService();
  });

  afterEach(() => {
    destroyTrackingService();
  });

  it('tracks events', () => {
    const tracking = getTrackingService();
    const initial = tracking.getEvents().length;
    tracking.trackEvent({
      type: 'page.viewed',
      action: 'test',
      details: {},
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'doc1',
    });
    expect(tracking.getEvents()).toHaveLength(initial + 1);
  });

  it('tracks metrics', () => {
    const tracking = getTrackingService();
    tracking.trackMetric('loadTime', 123);
    expect(tracking.getMetrics().get('loadTime')).toBe(123);
  });

  it('can be disabled', () => {
    const tracking = getTrackingService();
    const initial = tracking.getEvents().length;
    (tracking as any).disable();
    tracking.trackEvent({
      type: 'page.viewed',
      action: 'test',
      details: {},
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'doc1',
    });
    expect(tracking.getEvents()).toHaveLength(initial);
  });
});
