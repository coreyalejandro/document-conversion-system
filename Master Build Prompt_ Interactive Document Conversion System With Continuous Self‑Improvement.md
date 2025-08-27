# Master Build Prompt: Interactive Document Conversion System With Continuous Self‑Improvement

You are an expert multi‑agent system tasked with delivering a production‑grade, neurodivergent‑first, interactive document system that converts Markdown and PDF files into interactive web documents, plus a built‑in self‑improvement mechanism that learns from every job. Do not ask questions. When uncertain, make reasonable, clearly labeled assumptions and proceed. Implement everything below.

## 1) Objectives

- Convert .md and .pdf documents (especially ChatGPT outputs) into fully interactive documents that are easier to manage, edit, search, and reuse than static files.
- Provide a built‑in editor, a storage system, and a design‑system switcher supporting three themes: Google Material 3 (Dark), IBM Carbon, and shadcn/ui.
- Make each interactive element an autonomous, plug‑and‑play component (mini‑app) with a stable plugin API.
- Build a closed‑loop, continuous self‑improvement mechanism: learn from every job; document learning; analyze results; trace each improvement to measurable outcomes.

## 2) Non‑Negotiable Directives

- Implement all requested features; prioritize the self‑improvement mechanism.
- No clarifying questions. Make explicit assumptions and proceed.
- Produce complete deliverables, ready to run locally and deploy to production.
- Cite sources for any research and include a research appendix with links and timestamps.
- Design for neurodivergent‑first accessibility: predictable structure, motion controls, readable typography, and reduced cognitive load.

## 3) Deliverables

- Running web app (local dev + production build) with:
  - Conversion pipeline for Markdown and PDF
  - Interactive viewer with theme switcher
  - Built‑in editor (WYSIWYG + Markdown hybrid)
  - Storage system (local‑first sync)
  - Plugin framework for autonomous interactive elements
  - Self‑improvement telemetry, analysis, and learning logs
- Documentation:
  - Architecture overview
  - Plugin API spec
  - Data schemas
  - Admin playbook for experiments and rollbacks
  - Research report with sources
- Test suite:
  - Unit, integration, accessibility, performance
  - Conversion fidelity snapshots
- CI/CD workflow and infra-as-code (if applicable)

## 4) Research Tasks

- Identify what users want from document conversion tools and interactive docs.
- Produce a prioritized list of use cases with rationale and links to sources.
- Benchmark common tools (e.g., Notion, Obsidian, Confluence, Google Docs, Adobe Acrobat, Readability/Reader apps, Docusaurus) and summarize gaps.
- Output: “Research.md” with citations, date/time, and an executive summary.

## 5) Table‑Stakes Interaction Features (Must‑Have)

- Import: .md (frontmatter, code blocks, tables, images, mermaid), .pdf (text, images, headings detection)
- Viewer:
  - Expand/collapse sections
  - Persistent table of contents
  - Search with highlights and hit navigation
  - Copy code, copy section, linkable headings
  - Footnotes, references, and citations rendering
  - Media embeds (images, audio, video, mermaid, math (LaTeX))
  - Keyboard navigation and command palette
  - Motion control: high/medium/calm; respect prefers‑reduced‑motion
- Editor:
  - Inline edit, Markdown slash commands, WYSIWYG toggling
  - Block types: heading, paragraph, list, table, code, callout, quote, task, toggle, mermaid
  - Quick formatting, link insertion, paste sanitization
  - Versioning with diff and undo history
- Storage:
  - Local‑first with background sync
  - Versioned documents
  - Import/export: .md, .pdf (export), .zip bundle with assets
- Accessibility:
  - WCAG 2.2 AA
  - Dyslexia‑aware typography options
  - Adjustable line length, spacing, and contrast
  - Caption/transcript support for media
- Performance:
  - Instant load for typical docs (&lt;2s TTI at 1 MB)
  - Virtualized long docs
  - Offline viewing and editing

## 6) Value‑Add Features (Delighters)

- AI features:
  - Summarize, outline, and generate TOC
  - Semantic search and cross‑doc references
  - Auto‑tagging and knowledge graph of entities
  - Smart cleanup of pasted ChatGPT content (normalize headings, fix lists/tables)
- Collaboration:
  - Comments, suggestions, and inline annotations
  - Share links with role‑based access (viewer/commenter/editor)
- Reading modes:
  - Focus/Zen mode
  - Presenter mode (slide‑like flow)
  - Study mode (auto‑generated flashcards, Q&A)
- Automation:
  - Doc templates and presets
  - Scheduled re‑render on source updates
  - Webhooks and CLI ingestion
- Export:
  - Static HTML bundle with assets
  - PDF export with style preservation
  - JSON snapshot of structure and metadata
- Governance:
  - Audit log of edits and conversions
  - Content lifecycle states (draft/review/published)
  - Policy checks (PII linting, link rot detector)
- Theming:
  - Material 3 (Dark), IBM Carbon, shadcn/ui theme tokens and switcher
  - Per‑doc theme override

## 7) Use Cases (Include and Prioritize)

- Convert ChatGPT outputs (md/pdf) to interactive docs with clean structure and TOC
- Technical specs and RFCs with code blocks and mermaid diagrams
- Research notes, literature reviews with citations
- Knowledge bases and SOPs with task lists and checklists
- Design docs with component galleries and theme previews
- Curriculum/learning modules with quizzes and study mode
- Meeting notes with action items and follow‑ups
- Release notes with diff and change log views
- Long‑form essays with footnotes and references
- Mixed media reports (audio/video embeds, transcripts)
- Documentation sites built from multiple documents
- Onboarding handbooks with progressive disclosure
- Legal/policy docs with clause linking and compare
- Data reports with interactive tables and filters
- Personal knowledge management with tags and backlinks
- Migration of folder of .md to a single navigable site
- Accessibility‑friendly modes for ADHD/autistic users (motion, focus, spacing)
- Offline field handbooks with periodic sync
- Classroom materials with graded interactivity
- Developer guides with copy‑install snippets and environment checks

## 8) Conversion Pipeline Requirements

- Markdown:
  - Preserve frontmatter, headings, lists, tables, code, math, mermaid
  - Parse fenced blocks and language tags; apply syntax highlighting
  - Resolve relative links and image paths; ingest assets
- PDF:
  - Text extraction with heading inference
  - Preserve images and basic layout; reconstruct lists/tables where feasible
  - Detect code blocks by font heuristics; allow manual correction
- Normalization:
  - Clean stray whitespace, fix malformed lists/tables, consolidate heading levels
  - Build canonical document AST
- Mapping to Interactive Blocks:
  - Headings → section nodes with anchors
  - Lists → toggle/checkbox blocks (optional)
  - Code → copyable blocks with language badges
  - Mermaid/math → renderers
- Fidelity Testing:
  - Snapshot test: source vs interactive render diffs
  - Round‑trip export to Markdown for equivalence check

## 9) Editor Requirements

- Block‑based editing with inline Markdown shortcuts
- Slash menu for inserting block types and plugins
- Multi‑cursor, undo/redo timeline, and change history
- Find/replace with regex option
- Link and media insertion with validation
- Commenting and suggestion mode (toggle)
- Keyboard accessibility and command palette

## 10) Storage System Requirements

- Local‑first (IndexedDB) with optional cloud sync (S3/Object storage + metadata DB)
- Versioning (immutable snapshots) and named releases
- Encryption at rest (cloud) and during sync; redact secrets
- Search index: per‑doc and global (title, headings, code, tags)
- Import/export bundles with assets and manifest

## 11) Design Systems and Theming

- Implement theme tokens for:
  - Material 3 (Dark)
  - IBM Carbon
  - shadcn/ui
- Theme switcher with persistence; per‑doc override
- Token mapping for colors, typography, spacing, radii, shadows
- Motion scales aligned to neurodivergent‑first profiles (high/medium/calm)

## 12) Plugin Architecture (Autonomous Mini‑Apps)

- Each interactive element is a self‑contained plugin:
  - Manifest, capabilities, lifecycle methods, events, sandboxing
- Plugin contract (TypeScript):

```ts
export type PluginCapability = "block" | "inline" | "panel" | "toolbar" | "exporter" | "importer";

export interface DocPlugin {
  id: string;
  name: string;
  version: string;
  capabilities: PluginCapability[];
  styles?: Record<string, string>; // CSS vars/tokens
  init(ctx: PluginContext): Promise<void>;
  render(node: DocNode, ctx: RenderContext): HTMLElement | Promise<HTMLElement>;
  panel?(ctx: PanelContext): HTMLElement | Promise<HTMLElement>;
  toolbarItems?(): ToolbarItem[];
  onEvent?(event: DocEvent, ctx: PluginContext): void;
  serialize?(node: DocNode): any;
  deserialize?(data: any): DocNode;
  dispose?(): void;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  entry: string; // ESM module
  sandbox: "iframe" | "worker" | "none";
  permissions?: ("fs.read"|"fs.write"|"net.fetch")[];
}
```

- Registration:

```ts
registerPlugin(manifest: PluginManifest, module: DocPlugin): void
```

- Security:
  - Default sandbox in iframe/worker; strict CSP; no inline scripts; permission gating
- Distribution:
  - Drop‑in plugins via `manifest.json` and ESM entry; hot‑load at runtime

## 13) Data Models and Schemas

- Document AST (JSON):

```json
{
  "id": "doc_123",
  "title": "My Document",
  "theme": "material3-dark",
  "version": 7,
  "createdAt": "2025-08-23T12:00:00Z",
  "updatedAt": "2025-08-23T12:30:00Z",
  "meta": {
    "tags": ["spec", "conversion"],
    "source": {"type": "markdown", "path": "docs/spec.md"},
    "authors": ["owner"]
  },
  "nodes": [
    { "id": "n1", "type": "h1", "text": "Title" },
    { "id": "n2", "type": "p", "text": "Intro paragraph." },
    { "id": "n3", "type": "code", "lang": "bash", "text": "echo hello", "meta": {"copy": true} },
    { "id": "n4", "type": "h2", "text": "Section" },
    { "id": "n5", "type": "list", "ordered": false, "items": [
      {"text": "Item A"}, {"text": "Item B"}
    ]},
    { "id": "n6", "type": "toggle", "title": "Details", "children": [
      {"id": "n6a", "type": "p", "text": "Hidden content."}
    ] }
  ]
}
```

- Storage manifest:

```json
{
  "bundleVersion": 1,
  "documents": [{"id":"doc_123","path":"docs/doc_123.json","checksum":"sha256:..."}],
  "assets": [{"path":"assets/image.png","checksum":"sha256:..."}],
  "index": {"titles":{"doc_123":"My Document"}}
}
```

- Version log:

```json
{
  "docId": "doc_123",
  "revisions": [
    {"v": 6, "at":"2025-08-23T12:10:00Z","by":"owner","summary":"Fixed headings"},
    {"v": 7, "at":"2025-08-23T12:30:00Z","by":"owner","summary":"Updated code block"}
  ]
}
```

- Telemetry event:

```json
{
  "ts": "2025-08-23T12:31:00Z",
  "session": "s_abc",
  "user": "anon",
  "event": "conversion.complete",
  "docId": "doc_123",
  "metrics": {"duration_ms": 1840, "errors": 0, "fidelity_score": 0.97},
  "context": {"source":"pdf","pages":12,"theme":"carbon-dark"},
  "privacy": {"pseudonymous": true, "pii": false}
}
```

- Learning log entry:

```json
{
  "id": "L-2025-08-23-001",
  "jobId": "J-9f1",
  "hypothesis": "Headings mis-detected in PDFs with small caps",
  "evidence": [{"type":"metric","name":"fidelity_score","before":0.86,"after":0.94}],
  "change": {"component":"pdf_heading_detector","version":"1.3.2","diff":"adjusted smallCaps threshold to 0.72"},
  "decision": "rollout_25_percent",
  "trace": ["issue#214","commit#abc123","experiment#exp_77"],
  "owner": "auto/learn",
  "nextReviewAt": "2025-09-01T00:00:00Z"
}
```

- Experiment config:

```json
{
  "id": "exp_77",
  "goal": "Improve PDF heading inference",
  "metric": "fidelity_score",
  "targetDelta": 0.05,
  "guardrails": {"regression_max": 0.01, "error_rate_max": 0.02},
  "variants": [
    {"id":"A","params":{"smallCapsThreshold":0.65}},
    {"id":"B","params":{"smallCapsThreshold":0.72}}
  ],
  "allocation": {"A": 0.5, "B": 0.5},
  "rollout": {"phase":"canary","percent":25}
}
```

- Plugin# Master Build Prompt: Interactive Document Conversion System With Continuous Self‑Improvement

You are an expert multi‑agent system tasked with delivering a production‑grade, neurodivergent‑first, interactive document system that converts Markdown and PDF files into interactive web documents, plus a built‑in self‑improvement mechanism that learns from every job. Do not ask questions. When uncertain, make reasonable, clearly labeled assumptions and proceed. Implement everything below.

## 1) Objectives

- Convert .md and .pdf documents (especially ChatGPT outputs) into fully interactive documents that are easier to manage, edit, search, and reuse than static files.
- Provide a built‑in editor, a storage system, and a design‑system switcher supporting three themes: Google Material 3 (Dark), IBM Carbon, and shadcn/ui.
- Make each interactive element an autonomous, plug‑and‑play component (mini‑app) with a stable plugin API.
- Build a closed‑loop, continuous self‑improvement mechanism: learn from every job; document learning; analyze results; trace each improvement to measurable outcomes.

## 2) Non‑Negotiable Directives

- Implement all requested features; prioritize the self‑improvement mechanism.
- No clarifying questions. Make explicit assumptions and proceed.
- Produce complete deliverables, ready to run locally and deploy to production.
- Cite sources for any research and include a research appendix with links and timestamps.
- Design for neurodivergent‑first accessibility: predictable structure, motion controls, readable typography, and reduced cognitive load.

## 3) Deliverables

- Running web app (local dev + production build) with:
  - Conversion pipeline for Markdown and PDF
  - Interactive viewer with theme switcher
  - Built‑in editor (WYSIWYG + Markdown hybrid)
  - Storage system (local‑first sync)
  - Plugin framework for autonomous interactive elements
  - Self‑improvement telemetry, analysis, and learning logs
- Documentation:
  - Architecture overview
  - Plugin API spec
  - Data schemas
  - Admin playbook for experiments and rollbacks
  - Research report with sources
- Test suite:
  - Unit, integration, accessibility, performance
  - Conversion fidelity snapshots
- CI/CD workflow and infra-as-code (if applicable)

## 4) Research Tasks

- Identify what users want from document conversion tools and interactive docs.
- Produce a prioritized list of use cases with rationale and links to sources.
- Benchmark common tools (e.g., Notion, Obsidian, Confluence, Google Docs, Adobe Acrobat, Readability/Reader apps, Docusaurus) and summarize gaps.
- Output: “Research.md” with citations, date/time, and an executive summary.

## 5) Table‑Stakes Interaction Features (Must‑Have)

- Import: .md (frontmatter, code blocks, tables, images, mermaid), .pdf (text, images, headings detection)
- Viewer:
  - Expand/collapse sections
  - Persistent table of contents
  - Search with highlights and hit navigation
  - Copy code, copy section, linkable headings
  - Footnotes, references, and citations rendering
  - Media embeds (images, audio, video, mermaid, math (LaTeX))
  - Keyboard navigation and command palette
  - Motion control: high/medium/calm; respect prefers‑reduced‑motion
- Editor:
  - Inline edit, Markdown slash commands, WYSIWYG toggling
  - Block types: heading, paragraph, list, table, code, callout, quote, task, toggle, mermaid
  - Quick formatting, link insertion, paste sanitization
  - Versioning with diff and undo history
- Storage:
  - Local‑first with background sync
  - Versioned documents
  - Import/export: .md, .pdf (export), .zip bundle with assets
- Accessibility:
  - WCAG 2.2 AA
  - Dyslexia‑aware typography options
  - Adjustable line length, spacing, and contrast
  - Caption/transcript support for media
- Performance:
  - Instant load for typical docs (&lt;2s TTI at 1 MB)
  - Virtualized long docs
  - Offline viewing and editing

## 6) Value‑Add Features (Delighters)

- AI features:
  - Summarize, outline, and generate TOC
  - Semantic search and cross‑doc references
  - Auto‑tagging and knowledge graph of entities
  - Smart cleanup of pasted ChatGPT content (normalize headings, fix lists/tables)
- Collaboration:
  - Comments, suggestions, and inline annotations
  - Share links with role‑based access (viewer/commenter/editor)
- Reading modes:
  - Focus/Zen mode
  - Presenter mode (slide‑like flow)
  - Study mode (auto‑generated flashcards, Q&A)
- Automation:
  - Doc templates and presets
  - Scheduled re‑render on source updates
  - Webhooks and CLI ingestion
- Export:
  - Static HTML bundle with assets
  - PDF export with style preservation
  - JSON snapshot of structure and metadata
- Governance:
  - Audit log of edits and conversions
  - Content lifecycle states (draft/review/published)
  - Policy checks (PII linting, link rot detector)
- Theming:
  - Material 3 (Dark), IBM Carbon, shadcn/ui theme tokens and switcher
  - Per‑doc theme override

## 7) Use Cases (Include and Prioritize)

- Convert ChatGPT outputs (md/pdf) to interactive docs with clean structure and TOC
- Technical specs and RFCs with code blocks and mermaid diagrams
- Research notes, literature reviews with citations
- Knowledge bases and SOPs with task lists and checklists
- Design docs with component galleries and theme previews
- Curriculum/learning modules with quizzes and study mode
- Meeting notes with action items and follow‑ups
- Release notes with diff and change log views
- Long‑form essays with footnotes and references
- Mixed media reports (audio/video embeds, transcripts)
- Documentation sites built from multiple documents
- Onboarding handbooks with progressive disclosure
- Legal/policy docs with clause linking and compare
- Data reports with interactive tables and filters
- Personal knowledge management with tags and backlinks
- Migration of folder of .md to a single navigable site
- Accessibility‑friendly modes for ADHD/autistic users (motion, focus, spacing)
- Offline field handbooks with periodic sync
- Classroom materials with graded interactivity
- Developer guides with copy‑install snippets and environment checks

## 8) Conversion Pipeline Requirements

- Markdown:
  - Preserve frontmatter, headings, lists, tables, code, math, mermaid
  - Parse fenced blocks and language tags; apply syntax highlighting
  - Resolve relative links and image paths; ingest assets
- PDF:
  - Text extraction with heading inference
  - Preserve images and basic layout; reconstruct lists/tables where feasible
  - Detect code blocks by font heuristics; allow manual correction
- Normalization:
  - Clean stray whitespace, fix malformed lists/tables, consolidate heading levels
  - Build canonical document AST
- Mapping to Interactive Blocks:
  - Headings → section nodes with anchors
  - Lists → toggle/checkbox blocks (optional)
  - Code → copyable blocks with language badges
  - Mermaid/math → renderers
- Fidelity Testing:
  - Snapshot test: source vs interactive render diffs
  - Round‑trip export to Markdown for equivalence check

## 9) Editor Requirements

- Block‑based editing with inline Markdown shortcuts
- Slash menu for inserting block types and plugins
- Multi‑cursor, undo/redo timeline, and change history
- Find/replace with regex option
- Link and media insertion with validation
- Commenting and suggestion mode (toggle)
- Keyboard accessibility and command palette

## 10) Storage System Requirements

- Local‑first (IndexedDB) with optional cloud sync (S3/Object storage + metadata DB)
- Versioning (immutable snapshots) and named releases
- Encryption at rest (cloud) and during sync; redact secrets
- Search index: per‑doc and global (title, headings, code, tags)
- Import/export bundles with assets and manifest

## 11) Design Systems and Theming

- Implement theme tokens for:
  - Material 3 (Dark)
  - IBM Carbon
  - shadcn/ui
- Theme switcher with persistence; per‑doc override
- Token mapping for colors, typography, spacing, radii, shadows
- Motion scales aligned to neurodivergent‑first profiles (high/medium/calm)

## 12) Plugin Architecture (Autonomous Mini‑Apps)

- Each interactive element is a self‑contained plugin:
  - Manifest, capabilities, lifecycle methods, events, sandboxing
- Plugin contract (TypeScript):

```ts
export type PluginCapability = "block" | "inline" | "panel" | "toolbar" | "exporter" | "importer";

export interface DocPlugin {
  id: string;
  name: string;
  version: string;
  capabilities: PluginCapability[];
  styles?: Record<string, string>; // CSS vars/tokens
  init(ctx: PluginContext): Promise<void>;
  render(node: DocNode, ctx: RenderContext): HTMLElement | Promise<HTMLElement>;
  panel?(ctx: PanelContext): HTMLElement | Promise<HTMLElement>;
  toolbarItems?(): ToolbarItem[];
  onEvent?(event: DocEvent, ctx: PluginContext): void;
  serialize?(node: DocNode): any;
  deserialize?(data: any): DocNode;
  dispose?(): void;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  entry: string; // ESM module
  sandbox: "iframe" | "worker" | "none";
  permissions?: ("fs.read"|"fs.write"|"net.fetch")[];
}
```

- Registration:

```ts
registerPlugin(manifest: PluginManifest, module: DocPlugin): void
```

- Security:
  - Default sandbox in iframe/worker; strict CSP; no inline scripts; permission gating
- Distribution:
  - Drop‑in plugins via `manifest.json` and ESM entry; hot‑load at runtime

## 13) Data Models and Schemas

- Document AST (JSON):

```json
{
  "id": "doc_123",
  "title": "My Document",
  "theme": "material3-dark",
  "version": 7,
  "createdAt": "2025-08-23T12:00:00Z",
  "updatedAt": "2025-08-23T12:30:00Z",
  "meta": {
    "tags": ["spec", "conversion"],
    "source": {"type": "markdown", "path": "docs/spec.md"},
    "authors": ["owner"]
  },
  "nodes": [
    { "id": "n1", "type": "h1", "text": "Title" },
    { "id": "n2", "type": "p", "text": "Intro paragraph." },
    { "id": "n3", "type": "code", "lang": "bash", "text": "echo hello", "meta": {"copy": true} },
    { "id": "n4", "type": "h2", "text": "Section" },
    { "id": "n5", "type": "list", "ordered": false, "items": [
      {"text": "Item A"}, {"text": "Item B"}
    ]},
    { "id": "n6", "type": "toggle", "title": "Details", "children": [
      {"id": "n6a", "type": "p", "text": "Hidden content."}
    ] }
  ]
}
```

- Storage manifest:

```json
{
  "bundleVersion": 1,
  "documents": [{"id":"doc_123","path":"docs/doc_123.json","checksum":"sha256:..."}],
  "assets": [{"path":"assets/image.png","checksum":"sha256:..."}],
  "index": {"titles":{"doc_123":"My Document"}}
}
```

- Version log:

```json
{
  "docId": "doc_123",
  "revisions": [
    {"v": 6, "at":"2025-08-23T12:10:00Z","by":"owner","summary":"Fixed headings"},
    {"v": 7, "at":"2025-08-23T12:30:00Z","by":"owner","summary":"Updated code block"}
  ]
}
```

- Telemetry event:

```json
{
  "ts": "2025-08-23T12:31:00Z",
  "session": "s_abc",
  "user": "anon",
  "event": "conversion.complete",
  "docId": "doc_123",
  "metrics": {"duration_ms": 1840, "errors": 0, "fidelity_score": 0.97},
  "context": {"source":"pdf","pages":12,"theme":"carbon-dark"},
  "privacy": {"pseudonymous": true, "pii": false}
}
```

- Learning log entry:

```json
{
  "id": "L-2025-08-23-001",
  "jobId": "J-9f1",
  "hypothesis": "Headings mis-detected in PDFs with small caps",
  "evidence": [{"type":"metric","name":"fidelity_score","before":0.86,"after":0.94}],
  "change": {"component":"pdf_heading_detector","version":"1.3.2","diff":"adjusted smallCaps threshold to 0.72"},
  "decision": "rollout_25_percent",
  "trace": ["issue#214","commit#abc123","experiment#exp_77"],
  "owner": "auto/learn",
  "nextReviewAt": "2025-09-01T00:00:00Z"
}
```

- Experiment config:

```json
{
  "id": "exp_77",
  "goal": "Improve PDF heading inference",
  "metric": "fidelity_score",
  "targetDelta": 0.05,
  "guardrails": {"regression_max": 0.01, "error_rate_max": 0.02},
  "variants": [
    {"id":"A","params":{"smallCapsThreshold":0.65}},
    {"id":"B","params":{"smallCapsThreshold":0.72}}
  ],
  "allocation": {"A": 0.5, "B": 0.5},
  "rollout": {"phase":"canary","percent":25}
}
```

- Plugin