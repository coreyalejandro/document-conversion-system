'use client';

import { useState, useEffect } from 'react';
import { DocumentConverter } from '@/components/document-converter';
import { DocumentViewer } from '@/components/document-viewer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { TrackingDashboard } from '@/components/tracking-dashboard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useTracking } from '@/telemetry/tracking';
import { Document, ThemeType } from '@/types';

export default function HomePage() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const tracking = useTracking();

  useEffect(() => {
    // Track page view
    tracking.trackEvent({
      type: 'page.viewed',
      action: 'home_page_loaded',
      details: {
        page: 'home',
        timestamp: new Date().toISOString(),
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });

    // Track performance
    tracking.startPerformanceMark('page_load');
    
    return () => {
      const loadTime = tracking.endPerformanceMark('page_load');
      tracking.trackMetric('page_load_time', loadTime);
    };
  }, [tracking]);

  const handleDocumentConverted = (document: Document) => {
    setCurrentDocument(document);
    setIsConverting(false);
    
    tracking.trackDocumentOperation('created', document.id, {
      sourceType: document.meta.source.type,
      wordCount: document.meta.wordCount,
      theme: document.theme,
    });
  };

  const handleConversionStart = () => {
    setIsConverting(true);
    tracking.trackEvent({
      type: 'conversion.started',
      action: 'conversion_initiated',
      details: {
        timestamp: new Date().toISOString(),
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'pending',
    });
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    const oldTheme = currentDocument?.theme ?? 'material3-dark';
    
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        theme: newTheme,
      });
      
      tracking.trackThemeChange(oldTheme, newTheme, currentDocument.id);
    }
  };

  const handleTrackingToggle = () => {
    setShowTracking(!showTracking);
    tracking.trackEvent({
      type: 'user.preference',
      action: 'tracking_dashboard_toggled',
      details: {
        showTracking: !showTracking,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: currentDocument?.id ?? 'system',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Document Conversion System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your Markdown and PDF documents into interactive, accessible, 
              and trackable web experiences. Built with neurodivergent-first design principles.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {tracking.getEvents().length}
                </div>
                <div className="text-muted-foreground">Events Tracked</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {tracking.getMetrics().size}
                </div>
                <div className="text-muted-foreground">Metrics Recorded</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {currentDocument ? '1' : '0'}
                </div>
                <div className="text-muted-foreground">Active Documents</div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Converter */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Convert Documents</h2>
                <DocumentConverter
                  onConversionStart={handleConversionStart}
                  onDocumentConverted={handleDocumentConverted}
                  isConverting={isConverting}
                />
              </div>

              {/* Tracking Dashboard Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tracking & Analytics</h3>
                    <p className="text-muted-foreground">
                      Monitor document operations and user interactions
                    </p>
                  </div>
                  <button
                    onClick={handleTrackingToggle}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {showTracking ? 'Hide' : 'Show'} Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Document Viewer */}
            <div className="space-y-6">
              {currentDocument ? (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Interactive Viewer</h2>
                  <DocumentViewer
                    document={currentDocument}
                  />
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-semibold mb-2">No Document Loaded</h3>
                    <p>Convert a document to see it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Dashboard */}
          {showTracking && (
            <div className="mt-8">
              <TrackingDashboard />
            </div>
          )}

          {/* Features Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Neurodivergent-First Design</h3>
                <p className="text-muted-foreground">
                  Built with accessibility in mind, featuring predictable layouts, 
                  motion controls, and reduced cognitive load.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Tracking</h3>
                <p className="text-muted-foreground">
                  Every interaction is tracked and analyzed for continuous improvement 
                  and user experience optimization.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🔌</div>
                <h3 className="text-xl font-semibold mb-2">Plugin Architecture</h3>
                <p className="text-muted-foreground">
                  Extensible plugin system for custom interactive elements and 
                  autonomous mini-apps.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Multiple Themes</h3>
                <p className="text-muted-foreground">
                  Support for Material 3, IBM Carbon, and shadcn/ui themes with 
                  seamless switching.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">High Performance</h3>
                <p className="text-muted-foreground">
                  Optimized for speed with virtualized rendering, offline support, 
                  and instant loading.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold mb-2">Self-Improvement</h3>
                <p className="text-muted-foreground">
                  Continuous learning system that analyzes usage patterns and 
                  automatically improves conversion quality.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Theme Switcher */}
      <ThemeSwitcher
        currentTheme={currentDocument?.theme ?? 'material3-dark'}
        onThemeChange={handleThemeChange}
      />

      <Footer />
    </div>
  );
}
