import { auth } from '@/features/admin-auth/server';
import { catalogueHandlers } from '@/features/superstar/app/editor-http';
import { superstarRuntime } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => catalogueHandlers({ authorize: auth.authorize, catalogue: superstarRuntime().catalogue }).GET(request);
export const POST = (request: Request) => catalogueHandlers({ authorize: auth.authorize, catalogue: superstarRuntime().catalogue }).POST(request);
