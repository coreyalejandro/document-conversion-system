import 'fake-indexeddb/auto';
import { TelemetryAnalyzer } from '../analyzer';
import { TrackingEvent, LearningLog } from '@/types';

if (typeof (globalThis as any).structuredClone === 'undefined') {
  (globalThis as any).structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));
}

describe('TelemetryAnalyzer', () => {
  it('aggregates events and derives metrics', () => {
    const analyzer = new TelemetryAnalyzer();
    const events: TrackingEvent[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        type: 'conversion.completed',
        action: 'done',
        details: {},
        sessionId: 's',
        userId: 'u',
        documentId: 'd',
      },
      {
        id: '2',
        timestamp: new Date().toISOString(),
        type: 'conversion.failed',
        action: 'fail',
        details: {},
        sessionId: 's',
        userId: 'u',
        documentId: 'd',
      },
    ];
    analyzer.ingest(events);
    const insights = analyzer.getInsights();
    expect(insights.totalEvents).toBe(2);
    expect(insights.conversions.total).toBe(2);
    expect(insights.conversions.success).toBe(1);
    expect(insights.conversions.failed).toBe(1);
    expect(insights.conversions.successRate).toBe(0.5);
  });

  it('persists analytics and improvement logs', async () => {
    const analyzer = new TelemetryAnalyzer();
    const event: TrackingEvent = {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'conversion.completed',
      action: 'done',
      details: {},
      sessionId: 's',
      userId: 'u',
      documentId: 'd',
    };
    analyzer.ingest([event]);
    await analyzer.persistAnalytics();
    const stored = await analyzer.getStoredAnalytics();
    expect(stored.length).toBe(1);
    expect(stored[0]!.metrics.totalEvents).toBe(1);

    const log: LearningLog = {
      id: 'log1',
      jobId: 'job',
      hypothesis: 'test',
      evidence: [],
      change: { component: 'conv', version: '1', diff: '', riskLevel: 'low' },
      decision: 'rollout',
      trace: [],
      owner: 'tester',
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await analyzer.logImprovement(log);
    const logs = await analyzer.getImprovementLogs();
    expect(logs.length).toBe(1);
    expect(logs[0]!.id).toBe('log1');
  });
});
