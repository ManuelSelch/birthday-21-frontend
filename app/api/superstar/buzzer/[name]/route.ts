import { buzzerHandler } from '@/features/superstar/app/buzzer-http';
import { showService } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handle = buzzerHandler({
  key: () => process.env.SUPERSTAR_BUZZER_API_KEY,
  show: showService,
});

export async function POST(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return handle(request, name);
}
