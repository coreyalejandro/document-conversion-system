import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { JSONContent } from '@tiptap/react';

jest.mock('@/telemetry/tracking', () => ({
  useTracking: () => ({
    trackEvent: jest.fn(),
    getSessionId: () => 'session',
    getUserId: () => 'user',
  }),
}));

const { DocumentEditor } = require('./document-editor');

describe('DocumentEditor', () => {
  it('saves heading and metadata edits', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(
      <DocumentEditor
        initialContent=""
        initialMeta={{ title: '', tags: [] }}
        onSave={onSave}
        onCancel={() => {}}
      />
    );

    const editor = screen.getByTestId('editor-content');
    await user.click(editor);
    await user.click(screen.getByRole('button', { name: 'H1' }));
    await user.type(editor, 'Heading');

    const titleInput = screen.getByTestId('title-input');
    await user.type(titleInput, 'My Doc');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const [content, meta] = onSave.mock.calls[0] as [JSONContent, { title: string }];
    expect(meta.title).toBe('My Doc');
    expect(JSON.stringify(content)).toContain('"type":"heading"');
  });

  it('saves list edits', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(
      <DocumentEditor
        initialContent=""
        onSave={onSave}
        onCancel={() => {}}
      />
    );

    const editor = screen.getByTestId('editor-content');
    await user.click(editor);
    await user.click(screen.getByRole('button', { name: 'Bullet' }));
    await user.type(editor, 'Item 1');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalled();
    const [content] = onSave.mock.calls[0] as [JSONContent];
    expect(JSON.stringify(content)).toContain('"type":"bulletList"');
  });

  it('saves code block edits', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(
      <DocumentEditor
        initialContent=""
        onSave={onSave}
        onCancel={() => {}}
      />
    );

    const editor = screen.getByTestId('editor-content');
    await user.click(editor);
    await user.click(screen.getByRole('button', { name: 'Code' }));
    await user.type(editor, 'console.log("hi");');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalled();
    const [content] = onSave.mock.calls[0] as [JSONContent];
    expect(JSON.stringify(content)).toContain('"type":"codeBlock"');
  });
});

