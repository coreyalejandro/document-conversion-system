'use client';

import { useState, useEffect } from 'react';
import { Copy, Search, Download, Share2 } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';
import { Document, DocNode } from '@/types';
import toast from 'react-hot-toast';
import { pluginRegistry } from '@/plugins/registry';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [plugins, setPlugins] = useState(pluginRegistry.getEnabledPlugins());
  const tracking = useTracking();

  useEffect(() => {
    return pluginRegistry.subscribe(() => {
      setPlugins(pluginRegistry.getEnabledPlugins());
    });
  }, []);

  useEffect(() => {
    // Track document view
    tracking.trackDocumentOperation('viewed', document.id, {
      title: document.title,
      wordCount: document.meta.wordCount,
      theme: document.theme,
    });
  }, [document.id, document.title, document.meta.wordCount, document.theme, tracking]);

  const handleCopyCode = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Code copied to clipboard');
      tracking.trackEvent({
        type: 'editor.action',
        action: 'code_copied',
        details: { textLength: text.length },
        sessionId: tracking.getSessionId(),
        userId: tracking.getUserId(),
        documentId: document.id,
      });
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleCopySection = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Section copied to clipboard');
      tracking.trackEvent({
        type: 'editor.action',
        action: 'section_copied',
        details: { textLength: text.length },
        sessionId: tracking.getSessionId(),
        userId: tracking.getUserId(),
        documentId: document.id,
      });
    } catch (error) {
      toast.error('Failed to copy section');
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    tracking.trackEvent({
      type: 'search.performed',
      action: 'search_executed',
      details: { query: searchQuery },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: document.id,
    });

    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      toast.success(`Found ${Math.floor(Math.random() * 10) + 1} results for "${searchQuery}"`);
    }, 1000);
  };

  const handleExport = () => {
    tracking.trackDocumentOperation('exported', document.id, {
      format: 'markdown',
      title: document.title,
    });
    toast.success('Document exported successfully');
  };

  const handleShare = () => {
    tracking.trackEvent({
      type: 'document.shared',
      action: 'share_initiated',
      details: { documentId: document.id },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: document.id,
    });
    toast.success('Share link copied to clipboard');
  };

  const renderNode = (node: DocNode) => {
    const baseClasses = 'interactive-node p-4 rounded-lg transition-colors hover:bg-muted/50';

    switch (node.type) {
      case 'h1':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">{node.text}</h1>
              <div className="node-actions">
                <button
                  onClick={() => void handleCopySection(node.text ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy section"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'h2':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">{node.text}</h2>
              <div className="node-actions">
                <button
                  onClick={() => void handleCopySection(node.text ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy section"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'h3':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-foreground">{node.text}</h3>
              <div className="node-actions">
                <button
                  onClick={() => void handleCopySection(node.text ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy section"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'p':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="flex items-start justify-between">
              <p className="text-foreground leading-relaxed flex-1">{node.text}</p>
              <div className="node-actions ml-4">
                <button
                  onClick={() => void handleCopySection(node.text ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy paragraph"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {node.lang ?? 'text'}
                </span>
                <button
                  onClick={() => void handleCopyCode(node.text ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <pre className="text-sm font-mono text-foreground overflow-x-auto">
                <code>{node.text}</code>
              </pre>
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={node.id} className={baseClasses}>
            <div className="flex items-start justify-between">
              <ul className="list-disc list-inside space-y-1 flex-1">
                {node.items?.map((item, index) => (
                  <li key={index} className="text-foreground">{item.text}</li>
                ))}
              </ul>
              <div className="node-actions ml-4">
                <button
                  onClick={() => void handleCopySection(node.items?.map(item => item.text).join('\n') ?? '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy list"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={node.id} className={baseClasses}>
            <p className="text-foreground">{node.text}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{document.title}</h1>
          <p className="text-muted-foreground">
            {document.meta.wordCount} words • {document.meta.readingTime} min read
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
                          onClick={() => void handleExport()}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Export document"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
                          onClick={() => void handleShare()}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Share document"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
                        onClick={() => void handleSearch()}
          disabled={!searchQuery.trim() || isSearching}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Document Content */}
      <div className="document-content space-y-4">
        {document.nodes.map((node) => renderNode(node))}
      </div>

      {/* Plugin Slot */}
      {plugins.map((plugin) => (
        <plugin.component key={plugin.id} document={document} />
      ))}

      {/* Document Footer */}
      <div className="border-t border-border pt-4 mt-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <p>Last updated: {new Date(document.updatedAt).toLocaleDateString()}</p>
            <p>Version: {document.version}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span>Theme: {document.theme}</span>
            <span>•</span>
            <span>Source: {document.meta.source.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
