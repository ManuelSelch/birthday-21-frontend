import { eventHandler } from '@/features/superstar/app/http';
import { showService } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = eventHandler(showService);
