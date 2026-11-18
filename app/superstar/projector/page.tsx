import type { Metadata } from 'next';
import { DisplayContainer } from '@/features/superstar/ui/containers/display-container';

export const metadata: Metadata = { title: 'Superstar Beamer | Drei mal 21' };

export default function ProjectorPage() {
  return <DisplayContainer/>;
}
