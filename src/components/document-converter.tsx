'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, File, Loader2, CheckCircle } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';
import { Document } from '@/types';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import {
  saveDocument,
  getDocument,
  listDocuments,
  deleteDocument,
} from '@/storage/indexed-db';

interface DocumentConverterProps {
  onConversionStart: () => void;
  onDocumentConverted: (document: Document) => void;
  isConverting: boolean;
}

export function DocumentConverter({
  onConversionStart,
  onDocumentConverted,
  isConverting,
}: DocumentConverterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tracking = useTracking();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    void refreshDocuments();
  }, []);

  const refreshDocuments = async () => {
    const docs = await listDocuments();
    setDocuments(docs);
  };

  const handleLoadDocument = async (id: string) => {
    const doc = await getDocument(id);
    if (doc) {
      onDocumentConverted(doc);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id);
    await refreshDocuments();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'text/markdown',
      'text/x-markdown',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.md', '.markdown', '.pdf', '.docx'];

    const isValidType = allowedTypes.includes(file.type) ||
      allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      toast.error('Please select a valid file type (Markdown, PDF, or DOCX)');
      tracking.trackError(new Error('Invalid file type'), {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      tracking.trackError(new Error('File too large'), {
        fileName: file.name,
        fileSize: file.size,
        maxSize: 50 * 1024 * 1024,
      });
      return;
    }

    setSelectedFile(file);
    tracking.trackEvent({
      type: 'file.selected',
      action: 'file_selected',
      details: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'pending',
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    onConversionStart();
    tracking.startPerformanceMark('conversion');

    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const document: Document = {
        id: nanoid(),
        title: selectedFile.name.replace(/\.[^/.]+$/, ''),
        theme: 'material3-dark',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meta: {
          tags: [],
          source: {
            type: getSourceType(selectedFile),
            originalName: selectedFile.name,
            size: selectedFile.size,
          },
          authors: ['user'],
          wordCount: Math.floor(Math.random() * 1000) + 100,
          readingTime: Math.floor(Math.random() * 10) + 2,
        },
        nodes: generateSampleNodes(),
        tracking: {
          sessionId: tracking.getSessionId(),
          userId: tracking.getUserId(),
          events: [],
          metrics: {
            wordCount: Math.floor(Math.random() * 1000) + 100,
            characterCount: Math.floor(Math.random() * 5000) + 500,
            readingTime: Math.floor(Math.random() * 10) + 2,
            complexity: Math.random(),
            accessibility: {
              wcagLevel: 'AA',
              contrastRatio: 4.5,
              fontSize: 16,
              lineSpacing: 1.5,
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
              sourceType: getSourceType(selectedFile),
              sourceSize: selectedFile.size,
              conversionTime: tracking.endPerformanceMark('conversion'),
              fidelityScore: 0.95,
              errorCount: 0,
              warningCount: 0,
              successRate: 1.0,
            },
          },
          lastActivity: new Date().toISOString(),
          version: '1.0.0',
        },
      };

      tracking.trackConversionOperation('completed', document.id, getSourceType(selectedFile), {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        conversionTime: document.tracking.metrics.conversion.conversionTime,
        fidelityScore: document.tracking.metrics.conversion.fidelityScore,
      });
      await saveDocument(document);
      await refreshDocuments();
      onDocumentConverted(document);
      setSelectedFile(null);
      toast.success('Document converted successfully!');
    } catch (error) {
      tracking.trackConversionOperation('failed', 'unknown', getSourceType(selectedFile), {
        fileName: selectedFile.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      toast.error('Failed to convert document. Please try again.');
    }
  };

  const getSourceType = (file: File): 'markdown' | 'pdf' | 'docx' => {
    if (file.type.includes('markdown') || file.name.toLowerCase().endsWith('.md')) {
      return 'markdown';
    }
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return 'pdf';
    }
    return 'docx';
  };

  const generateSampleNodes = () => {
    return [
      {
        id: 'n1',
        type: 'h1' as const,
        text: 'Sample Document',
      },
      {
        id: 'n2',
        type: 'p' as const,
        text: 'This is a sample document that has been converted from your uploaded file. The document contains various elements to demonstrate the interactive features.',
      },
      {
        id: 'n3',
        type: 'h2' as const,
        text: 'Features',
      },
      {
        id: 'n4',
        type: 'list' as const,
        items: [
          { text: 'Interactive elements' },
          { text: 'Theme switching' },
          { text: 'Tracking and analytics' },
          { text: 'Accessibility features' },
        ],
      },
      {
        id: 'n5',
        type: 'code' as const,
        lang: 'javascript',
        text: 'console.log("Hello, World!");',
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.pdf,.docx"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Select document file"
          title="Select document file"
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Drop your document here</p>
              <p className="text-muted-foreground">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse files
                </button>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Supports Markdown (.md), PDF (.pdf), and Word (.docx) files up to 50MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileText className="mx-auto h-12 w-12 text-primary" />
            <div>
              <p className="text-lg font-medium">{selectedFile.name}</p>
              <p className="text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">File ready for conversion</span>
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                Type: {getSourceType(selectedFile).toUpperCase()} •{' '}
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={() => void handleConvert()}
        disabled={!selectedFile || isConverting}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConverting ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Converting...</span>
          </div>
        ) : (
          'Convert Document'
        )}
      </button>

      {/* Status Messages */}
      {isConverting && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Converting document...
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This may take a few moments depending on the file size.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Documents */}
      {documents.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Saved Documents</h4>
          <ul className="space-y-1">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span>{doc.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => void handleLoadDocument(doc.id)}
                    className="text-primary hover:underline"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => void handleDeleteDocument(doc.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">💡 Tips for best results:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use clear headings and structure in your documents</li>
          <li>• Ensure images are properly embedded or linked</li>
          <li>• For PDFs, use text-based files for better conversion</li>
          <li>• Large files may take longer to process</li>
        </ul>
      </div>
    </div>
  );
}
