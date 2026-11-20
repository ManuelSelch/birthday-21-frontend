import type { Metadata } from 'next';
import { ControlPage as ShowControlPage } from '@/features/superstar/ui/control-page';

export const metadata: Metadata = { title: 'Superstar Regie | Drei mal 21' };

export default function ControlPage() {
  return <ShowControlPage/>;
}
