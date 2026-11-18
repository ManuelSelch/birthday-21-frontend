import { notFound } from 'next/navigation';
import { juryIds } from '@/features/superstar/domain/catalog';
import { DisplayContainer } from '@/features/superstar/ui/containers/display-container';

export default async function JuryPage({ params }: { params: Promise<{ juror: string }> }) {
  const { juror } = await params;
  const index = juryIds.findIndex(id => id === juror);
  if (index < 0) notFound();
  return <DisplayContainer jurorIndex={index}/>;
}
