'use client';

import { useShowEditor } from '../../app/use-show-editor';
import type { ShowDefinition } from '../../domain/show-catalogue';
import { ShowEditor } from '../components/show-editor';

export function ShowEditorContainer({ shows, onClose }: { shows: ShowDefinition[]; onClose: () => void }) {
  const editor = useShowEditor(shows, onClose);
  return <ShowEditor editor={editor} shows={shows}/>;
}
