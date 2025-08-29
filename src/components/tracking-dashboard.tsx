'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Activity, Users, Clock, TrendingUp, Eye, Download, Search } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';
import { TrackingEvent } from '@/types';

export function TrackingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'metrics' | 'performance'>('overview');
  const tracking = useTracking();
  const [events, setEvents] = useState<TrackingEvent[]>(tracking.getEvents());
  const [metrics, setMetrics] = useState<Map<string, number>>(tracking.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(tracking.getEvents());
      setMetrics(tracking.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [tracking]);

  const getEventTypeCount = (type: string) => {
    return events.filter((event: TrackingEvent) => event.type === type).length;
  };

  const getRecentEvents = () => {
    return events
      .sort((a: TrackingEvent, b: TrackingEvent) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  };

  const getMetricsData = () => {
    const data = Array.from(metrics.entries()).map(([key, value]: [string, number]) => ({
      name: key,
      value,
    }));
    return data.sort((a, b) => b.value - a.value);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Activity },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Clock },
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tracking Dashboard</h2>
            <p className="text-muted-foreground">
              Real-time analytics and performance monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'events' | 'metrics' | 'performance')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{events.length}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{tracking.getUserId()}</p>
                    <p className="text-sm text-muted-foreground">User ID</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.size}</p>
                    <p className="text-sm text-muted-foreground">Metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round((events.length / Math.max(1, Date.now() - new Date(events[0]?.timestamp ?? Date.now()).getTime() / 1000)) * 100) / 100}
                    </p>
                    <p className="text-sm text-muted-foreground">Events/sec</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Event Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Document Views</span>
                    </div>
                    <span className="font-medium">{getEventTypeCount('document.viewed')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Conversions</span>
                    </div>
                    <span className="font-medium">{getEventTypeCount('conversion.completed')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Searches</span>
                    </div>
                    <span className="font-medium">{getEventTypeCount('search.performed')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getRecentEvents().map((event: TrackingEvent) => (
                    <div key={event.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{event.type}</span>
                      <span className="text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Events</h3>
              <span className="text-sm text-muted-foreground">{events.length} total</span>
            </div>
            <div className="bg-muted/50 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Type</th>
                      <th className="text-left p-3 text-sm font-medium">Action</th>
                      <th className="text-left p-3 text-sm font-medium">Document</th>
                      <th className="text-left p-3 text-sm font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event: TrackingEvent) => (
                      <tr key={event.id} className="border-t border-border">
                        <td className="p-3 text-sm">{event.type}</td>
                        <td className="p-3 text-sm">{event.action}</td>
                        <td className="p-3 text-sm">{event.documentId}</td>
                        <td className="p-3 text-sm">{formatTimestamp(event.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
              <span className="text-sm text-muted-foreground">{metrics.size} metrics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getMetricsData().map((metric: { name: string; value: number }) => (
                <div key={metric.name} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className="text-lg font-bold">{metric.value.toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`bg-primary h-2 rounded-full transition-all ${
                          Math.min((metric.value / 100) * 100, 100) <= 25
                            ? 'w-1/4'
                            : Math.min((metric.value / 100) * 100, 100) <= 50
                            ? 'w-1/2'
                            : Math.min((metric.value / 100) * 100, 100) <= 75
                            ? 'w-3/4'
                            : 'w-full'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Session Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono">{tracking.getSessionId()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono">{tracking.getUserId()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events/sec:</span>
                    <span>{events.length > 0 ? (events.length / Math.max(1, (Date.now() - new Date(events[0]?.timestamp ?? Date.now()).getTime()) / 1000)).toFixed(2) : '0'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">System Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tracking Status:</span>
                    <span className="text-green-500">● Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="text-green-500">● Local</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sync Status:</span>
                    <span className="text-yellow-500">● Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
