import type { Metadata } from 'next';
import { ControllerContainer } from '@/features/superstar/ui/containers/controller-container';

export const metadata: Metadata = { title: 'Superstar Regie | Drei mal 21' };

export default function ControlPage() {
  return <ControllerContainer/>;
}
