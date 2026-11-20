import type { Metadata } from 'next';
import { parseScene } from '@/features/superstar/domain/show';
import { DemoPage } from '@/features/superstar/ui/demo-page';

export const metadata: Metadata = { title: 'Superstar | Drei mal 21' };

export default async function SuperstarPage({searchParams}: {
  searchParams: Promise<{scene?: string | string[]}>;
}) {
  const {scene} = await searchParams;
  return <DemoPage initialScene={parseScene(scene)}/>;
}
