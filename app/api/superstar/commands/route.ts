import { auth } from '@/features/admin-auth/server';
import { commandHandler } from '@/features/superstar/app/http';
import { showService } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = commandHandler({ authorize: auth.authorize, show: showService });
