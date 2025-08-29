// Core Document Types
export interface DocNode {
  id: string;
  type: DocNodeType;
  text?: string;
  lang?: string;
  meta?: Record<string, unknown>;
  children?: DocNode[];
  items?: Array<{ text: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export type DocNodeType = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'blockquote' | 'code' | 'list' | 'table'
  | 'image' | 'video' | 'audio' | 'mermaid' | 'math'
  | 'toggle' | 'callout' | 'task' | 'divider';

export interface Document {
  id: string;
  title: string;
  theme: ThemeType;
  version: number;
  createdAt: string;
  updatedAt: string;
  meta: DocumentMeta;
  nodes: DocNode[];
  tracking: TrackingData;
}

export interface DocumentMeta {
  tags: string[];
  source: SourceInfo;
  authors: string[];
  description?: string;
  thumbnail?: string;
  wordCount?: number;
  readingTime?: number;
}

export interface SourceInfo {
  type: 'markdown' | 'pdf' | 'docx' | 'manual';
  path?: string;
  originalName?: string;
  size?: number;
  checksum?: string;
}

// Theme Types
export type ThemeType = 'material3-dark' | 'carbon-dark' | 'shadcn-dark' | 'material3-light' | 'carbon-light' | 'shadcn-light';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: ThemeColors;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  motion: MotionConfig;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface MotionConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  reducedMotion: boolean;
}

// Tracking and Telemetry Types
export interface TrackingData {
  sessionId: string;
  userId: string;
  events: TrackingEvent[];
  metrics: DocumentMetrics;
  lastActivity: string;
  version: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  type: EventType;
  action: string;
  details: Record<string, unknown>;
  sessionId: string;
  userId: string;
  documentId: string;
  performance?: PerformanceMetrics;
}

export type EventType = 
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'document.viewed'
  | 'document.exported'
  | 'document.imported'
  | 'document.shared'
  | 'conversion.started'
  | 'conversion.completed'
  | 'conversion.failed'
  | 'editor.action'
  | 'plugin.loaded'
  | 'plugin.error'
  | 'theme.changed'
  | 'search.performed'
  | 'export.generated'
  | 'import.processed'
  | 'error.occurred'
  | 'performance.measured'
  | 'accessibility.used'
  | 'user.preference'
  | 'page.viewed'
  | 'file.selected'
  | 'link.clicked'
  | 'ui.interaction'
  | 'navigation.clicked'
  | 'app.initialized'
  | 'session.started';

export interface DocumentMetrics {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  complexity: number;
  accessibility: AccessibilityMetrics;
  performance: PerformanceMetrics;
  conversion: ConversionMetrics;
}

export interface AccessibilityMetrics {
  wcagLevel: 'A' | 'AA' | 'AAA';
  contrastRatio: number;
  fontSize: number;
  lineSpacing: number;
  motionReduced: boolean;
  screenReaderCompatible: boolean;
  keyboardNavigable: boolean;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkRequests: number;
  bundleSize: number;
}

export interface ConversionMetrics {
  sourceType: string;
  sourceSize: number;
  conversionTime: number;
  fidelityScore: number;
  errorCount: number;
  warningCount: number;
  successRate: number;
}

// Plugin Types
export type PluginCapability = 'block' | 'inline' | 'panel' | 'toolbar' | 'exporter' | 'importer';

export interface DocPlugin {
  id: string;
  name: string;
  version: string;
  capabilities: PluginCapability[];
  styles?: Record<string, string>;
  init(ctx: PluginContext): Promise<void>;
  render(node: DocNode, ctx: RenderContext): HTMLElement | Promise<HTMLElement>;
  panel?(ctx: PanelContext): HTMLElement | Promise<HTMLElement>;
  toolbarItems?(): ToolbarItem[];
  onEvent?(event: DocEvent, ctx: PluginContext): void;
  serialize?(node: DocNode): unknown;
  deserialize?(data: unknown): DocNode;
  dispose?(): void;
}

export interface PluginContext {
  documentId: string;
  theme: ThemeType;
  tracking: TrackingService;
  storage: StorageService;
  utils: PluginUtils;
}

export interface RenderContext {
  node: DocNode;
  theme: ThemeConfig;
  isEditing: boolean;
  isSelected: boolean;
  onUpdate: (node: DocNode) => void;
  onDelete: () => void;
}

export interface PanelContext {
  documentId: string;
  theme: ThemeConfig;
  onClose: () => void;
}

export interface ToolbarItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export interface DocEvent {
  type: string;
  data: unknown;
  timestamp: string;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  entry: string;
  sandbox: 'iframe' | 'worker' | 'none';
  permissions?: ('fs.read' | 'fs.write' | 'net.fetch')[];
  capabilities: PluginCapability[];
  description?: string;
  author?: string;
  license?: string;
}

// Service Types
export interface TrackingService {
  trackEvent(event: Omit<TrackingEvent, 'id' | 'timestamp'>): void;
  trackMetric(name: string, value: number): void;
  trackError(error: Error, context?: Record<string, unknown>): void;
  trackPerformance(name: string, duration: number): void;
  startPerformanceMark(name: string): void;
  endPerformanceMark(name: string): number;
  trackDocumentOperation(
    operation: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | 'imported',
    documentId: string,
    details?: Record<string, unknown>
  ): void;
  trackConversionOperation(
    operation: 'started' | 'completed' | 'failed',
    documentId: string,
    sourceType: string,
    details?: Record<string, unknown>
  ): void;
  trackThemeChange(oldTheme: string, newTheme: string, documentId: string): void;
  getSessionId(): string;
  getUserId(): string;
  getEvents(): TrackingEvent[];
  getMetrics(): Map<string, number>;
}

export interface StorageService {
  saveDocument(doc: Document): Promise<void>;
  loadDocument(id: string): Promise<Document | null>;
  deleteDocument(id: string): Promise<void>;
  listDocuments(): Promise<Document[]>;
  exportDocument(id: string, format: ExportFormat): Promise<Blob>;
  importDocument(file: File): Promise<Document>;
}

export interface PluginUtils {
  generateId(): string;
  formatDate(date: Date): string;
  sanitizeHtml(html: string): string;
  validateNode(node: DocNode): boolean;
  debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T;
  throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T;
}

// Export/Import Types
export type ExportFormat = 'markdown' | 'pdf' | 'html' | 'json' | 'zip';

export interface ExportOptions {
  format: ExportFormat;
  includeAssets: boolean;
  includeMetadata: boolean;
  theme?: ThemeType;
  compress?: boolean;
}

export interface ImportOptions {
  validateContent: boolean;
  extractAssets: boolean;
  preserveFormatting: boolean;
  autoConvert: boolean;
}

// Search Types
export interface SearchResult {
  documentId: string;
  documentTitle: string;
  nodeId: string;
  nodeType: DocNodeType;
  text: string;
  score: number;
  highlights: SearchHighlight[];
}

export interface SearchHighlight {
  start: number;
  end: number;
  text: string;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'title';
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  documentIds?: string[];
  nodeTypes?: DocNodeType[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  authors?: string[];
}

// Learning and Self-Improvement Types
export interface LearningLog {
  id: string;
  jobId: string;
  hypothesis: string;
  evidence: LearningEvidence[];
  change: SystemChange;
  decision: 'rollout' | 'rollback' | 'experiment' | 'monitor';
  trace: string[];
  owner: string;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningEvidence {
  type: 'metric' | 'user_feedback' | 'error_rate' | 'performance';
  name: string;
  before: number;
  after: number;
  unit?: string;
  confidence?: number;
}

export interface SystemChange {
  component: string;
  version: string;
  diff: string;
  rollbackPlan?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Experiment {
  id: string;
  goal: string;
  metric: string;
  targetDelta: number;
  guardrails: ExperimentGuardrails;
  variants: ExperimentVariant[];
  allocation: Record<string, number>;
  rollout: ExperimentRollout;
  status: 'draft' | 'running' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentGuardrails {
  regressionMax: number;
  errorRateMax: number;
  performanceThreshold: number;
  userSatisfactionMin: number;
}

export interface ExperimentVariant {
  id: string;
  params: Record<string, unknown>;
  description?: string;
}

export interface ExperimentRollout {
  phase: 'canary' | 'beta' | 'full';
  percent: number;
  regions?: string[];
  userSegments?: string[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type EventHandler<T = unknown> = (event: T) => void | Promise<void>;

export type AsyncFunction<T = unknown, R = unknown> = (arg: T) => Promise<R>;

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

// Error Types
export class DocumentError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}

export class ConversionError extends DocumentError {
  constructor(
    message: string,
    public sourceType: string,
    public details?: Record<string, unknown>
  ) {
    super(message, 'CONVERSION_ERROR', { sourceType, details });
    this.name = 'ConversionError';
  }
}

export class PluginError extends DocumentError {
  constructor(
    message: string,
    public pluginId: string,
    public capability?: PluginCapability
  ) {
    super(message, 'PLUGIN_ERROR', { pluginId, capability });
    this.name = 'PluginError';
  }
}

export class StorageError extends DocumentError {
  constructor(
    message: string,
    public operation: string,
    public documentId?: string
  ) {
    super(message, 'STORAGE_ERROR', { operation, documentId });
    this.name = 'StorageError';
  }
}

// Export nanoid for use in components
export { nanoid } from 'nanoid';
