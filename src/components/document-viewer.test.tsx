import React from 'react';
import { render, screen } from '@testing-library/react';
import { DocumentViewer } from './document-viewer';
import { pluginRegistry } from '@/plugins/registry';
import { ExamplePlugin } from '@/plugins/example';
import { Document } from '@/types';
import { destroyTrackingService } from '@/telemetry/tracking';
import { act } from '@testing-library/react';

jest.mock('@/telemetry/tracking', () => ({
  useTracking: () => ({
    trackDocumentOperation: jest.fn(),
    trackEvent: jest.fn(),
    getSessionId: () => 'session',
    getUserId: () => 'user',
  }),
  destroyTrackingService: jest.fn(),
}));

const doc: Document = {
  id: '1',
  title: 'Test Document',
  theme: 'shadcn-dark',
  version: 1,
  createdAt: '',
  updatedAt: '',
  meta: {
    tags: [],
    source: { type: 'markdown' },
    authors: [],
    wordCount: 0,
    readingTime: 0,
  },
  nodes: [{ id: 'n1', type: 'p', text: 'hello' }],
  tracking: {
    sessionId: '',
    userId: '',
    events: [],
    metrics: {
      wordCount: 0,
      characterCount: 0,
      readingTime: 0,
      complexity: 0,
      accessibility: {
        wcagLevel: 'A',
        contrastRatio: 0,
        fontSize: 0,
        lineSpacing: 0,
        motionReduced: false,
        screenReaderCompatible: false,
        keyboardNavigable: false,
      },
      performance: {
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkRequests: 0,
        bundleSize: 0,
      },
      conversion: {
        sourceType: '',
        sourceSize: 0,
        conversionTime: 0,
        fidelityScore: 0,
        errorCount: 0,
        warningCount: 0,
        successRate: 0,
      },
    },
    lastActivity: '',
    version: '',
  },
};

describe('DocumentViewer plugin slot', () => {
  beforeEach(() => {
    pluginRegistry.register(ExamplePlugin);
    pluginRegistry.enable(ExamplePlugin.id);
  });

  afterEach(() => {
    act(() => {
      pluginRegistry.unregister(ExamplePlugin.id);
    });
    destroyTrackingService();
  });

  it('renders plugin component when enabled', () => {
    render(<DocumentViewer document={doc} />);
    expect(screen.getByTestId('example-plugin')).toBeInTheDocument();
  });
});
