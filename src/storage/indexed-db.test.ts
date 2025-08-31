import { saveDocument, getDocument, listDocuments, deleteDocument } from './indexed-db';
import type { Document } from '@/types';

const baseDocument: Document = {
  id: 'doc-1',
  title: 'Test Doc',
  theme: 'material3-dark',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  meta: {
    tags: [],
    source: { type: 'markdown' },
    authors: [],
    wordCount: 0,
    readingTime: 0,
  },
  nodes: [],
  tracking: {
    sessionId: 's',
    userId: 'u',
    events: [],
    metrics: {
      wordCount: 0,
      characterCount: 0,
      readingTime: 0,
      complexity: 0,
      accessibility: {
        wcagLevel: 'AA',
        contrastRatio: 0,
        fontSize: 0,
        lineSpacing: 0,
        motionReduced: false,
        screenReaderCompatible: true,
        keyboardNavigable: true,
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
        sourceType: 'markdown',
        sourceSize: 0,
        conversionTime: 0,
        fidelityScore: 0,
        errorCount: 0,
        warningCount: 0,
        successRate: 1,
      },
    },
    lastActivity: new Date().toISOString(),
    version: '1',
  },
};

beforeEach(async () => {
  const existing = await listDocuments();
  await Promise.all(existing.map((d) => deleteDocument(d.id)));
});

test('saves and retrieves a document', async () => {
  await saveDocument(baseDocument);
  const doc = await getDocument(baseDocument.id);
  expect(doc?.id).toBe(baseDocument.id);
});

test('lists documents', async () => {
  await saveDocument(baseDocument);
  await saveDocument({ ...baseDocument, id: 'doc-2', title: 'Doc 2' });
  const docs = await listDocuments();
  expect(docs).toHaveLength(2);
});

test('deletes a document', async () => {
  await saveDocument(baseDocument);
  await deleteDocument(baseDocument.id);
  const doc = await getDocument(baseDocument.id);
  expect(doc).toBeUndefined();
});

test('works offline', async () => {
  await saveDocument(baseDocument);
  Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
  const doc = await getDocument(baseDocument.id);
  expect(doc?.id).toBe(baseDocument.id);
});
