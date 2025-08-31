'use client';

import { useState, useEffect } from 'react';
import { EditorContent, useEditor, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTracking } from '@/telemetry/tracking';

interface DocumentMeta {
  title: string;
  tags?: string[];
}

interface DocumentEditorProps {
  initialContent: JSONContent | string;
  initialMeta?: DocumentMeta;
  onSave: (content: JSONContent, meta: DocumentMeta) => void;
  onCancel: () => void;
}

export function DocumentEditor({
  initialContent,
  initialMeta = { title: '', tags: [] },
  onSave,
  onCancel,
}: DocumentEditorProps) {
  const tracking = useTracking();
  const [meta, setMeta] = useState<DocumentMeta>(initialMeta);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  });

  useEffect(() => {
    tracking.trackEvent({
      type: 'editor.opened',
      action: 'editor_opened',
      details: { title: meta.title },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'editor',
    });
  }, [tracking]);

  const setHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    onSave(content, meta);
    tracking.trackEvent({
      type: 'editor.saved',
      action: 'editor_saved',
      details: { title: meta.title },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'editor',
    });
  };

  const handleCancel = () => {
    onCancel();
    tracking.trackEvent({
      type: 'editor.cancelled',
      action: 'editor_cancelled',
      details: { title: meta.title },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'editor',
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          data-testid="title-input"
          type="text"
          value={meta.title}
          onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <input
          data-testid="tags-input"
          type="text"
          value={meta.tags?.join(',') ?? ''}
          onChange={(e) =>
            setMeta({ ...meta, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
          }
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setHeading(1)} className="px-2 py-1 border rounded" aria-label="H1">
          H1
        </button>
        <button type="button" onClick={() => setHeading(2)} className="px-2 py-1 border rounded" aria-label="H2">
          H2
        </button>
        <button type="button" onClick={() => setHeading(3)} className="px-2 py-1 border rounded" aria-label="H3">
          H3
        </button>
        <button
          type="button"
          onClick={toggleBulletList}
          className="px-2 py-1 border rounded"
          aria-label="Bullet"
        >
          Bullet
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className="px-2 py-1 border rounded"
          aria-label="Numbered"
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={toggleCodeBlock}
          className="px-2 py-1 border rounded"
          aria-label="Code"
        >
          Code
        </button>
      </div>

      <EditorContent editor={editor} data-testid="editor-content" className="border p-2 min-h-[200px]" />

      <div className="flex gap-2">
        <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}

