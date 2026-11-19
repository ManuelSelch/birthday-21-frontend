import { auth } from '@/features/admin-auth/server';
import { uploadHandler } from '@/features/superstar/app/editor-http';
import { superstarRuntime } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = (request: Request) => {
  const { store } = superstarRuntime();
  return uploadHandler({ authorize: auth.authorize, upload: file => store.upload(file), configured: () => store.uploadConfigured() })(request);
};
