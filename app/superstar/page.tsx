import type { Metadata } from 'next';
import { parseScene } from '@/features/superstar/domain/show';
import { SuperstarContainer } from '@/features/superstar/ui/containers/superstar-container';

export const metadata: Metadata = { title: 'Superstar | Drei mal 21' };

export default async function SuperstarPage({searchParams}: {
  searchParams: Promise<{scene?: string | string[]}>;
}) {
  const {scene} = await searchParams;
  return <SuperstarContainer initialScene={parseScene(scene)}/>;
}
