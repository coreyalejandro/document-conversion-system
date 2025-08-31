import { openDB, IDBPDatabase } from 'idb';
import { TrackingEvent, LearningLog } from '@/types';

export interface AnalyzerInsights {
  totalEvents: number;
  eventsByType: Record<string, number>;
  conversions: {
    total: number;
    success: number;
    failed: number;
    successRate: number;
  };
}

interface StoredAnalytics {
  id?: number;
  timestamp: string;
  metrics: AnalyzerInsights;
}

export class TelemetryAnalyzer {
  private events: TrackingEvent[] = [];
  private insights: AnalyzerInsights = {
    totalEvents: 0,
    eventsByType: {},
    conversions: { total: 0, success: 0, failed: 0, successRate: 0 },
  };
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('telemetry', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('analytics')) {
          db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('improvements')) {
          db.createObjectStore('improvements', { keyPath: 'id' });
        }
      },
    });
  }

  ingest(events: TrackingEvent[]): void {
    for (const event of events) {
      this.events.push(event);
      this.insights.totalEvents++;
      this.insights.eventsByType[event.type] =
        (this.insights.eventsByType[event.type] || 0) + 1;
      if (event.type === 'conversion.completed') {
        this.insights.conversions.total++;
        this.insights.conversions.success++;
      } else if (event.type === 'conversion.failed') {
        this.insights.conversions.total++;
        this.insights.conversions.failed++;
      }
    }
    const { success, failed, total } = this.insights.conversions;
    this.insights.conversions.successRate = total ? success / total : 0;
  }

  getInsights(): AnalyzerInsights {
    return { ...this.insights, eventsByType: { ...this.insights.eventsByType } };
  }

  async persistAnalytics(): Promise<void> {
    const db = await this.dbPromise;
    const record: StoredAnalytics = {
      timestamp: new Date().toISOString(),
      metrics: this.getInsights(),
    };
    await db.add('analytics', record);
  }

  async getStoredAnalytics(): Promise<StoredAnalytics[]> {
    const db = await this.dbPromise;
    return db.getAll('analytics');
  }

  async logImprovement(log: LearningLog): Promise<void> {
    const db = await this.dbPromise;
    await db.put('improvements', log);
  }

  async getImprovementLogs(): Promise<LearningLog[]> {
    const db = await this.dbPromise;
    return db.getAll('improvements');
  }

  async adjustConversionRules(): Promise<void> {
    if (this.insights.conversions.total === 0) return;
    if (this.insights.conversions.successRate < 0.5) {
      localStorage.setItem('conversion_rule', 'fallback');
    }
  }
}

let analyzer: TelemetryAnalyzer | null = null;

export function getTelemetryAnalyzer(): TelemetryAnalyzer {
  if (!analyzer) {
    analyzer = new TelemetryAnalyzer();
  }
  return analyzer;
}

export function useTelemetryAnalyzer(): TelemetryAnalyzer {
  return getTelemetryAnalyzer();
}

export default getTelemetryAnalyzer;
