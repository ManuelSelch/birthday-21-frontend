import { parseCommand } from '../domain/live-show';
import type { ShowService } from './show-service';

interface CommandDependencies {
  authorize: (request: Request) => Response | undefined;
  show: () => ShowService;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function commandHandler({ authorize, show }: CommandDependencies) {
  return async (request: Request): Promise<Response> => {
    const unauthorized = authorize(request);
    if (unauthorized) return unauthorized;
    const origin = request.headers.get('origin');
    if (origin !== null && origin !== new URL(request.url).origin)
      return json({ error: 'Ungültiger Ursprung.' }, 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json')
      return json({ error: 'JSON erforderlich.' }, 415);

    let body: unknown;
    try {
      // Bound streamed bodies as well as requests declaring Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Befehl fehlt.' }, 400);
      const chunks: Uint8Array[] = [];
      let length = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 2048) {
            await reader.cancel();
            return json({ error: 'Befehl zu groß.' }, 413);
          }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch { return json({ error: 'Ungültiges JSON.' }, 400); }

    const command = parseCommand(body);
    if (!command) return json({ error: 'Ungültiger Show-Befehl.' }, 400);
    return json(show().command(command));
  };
}

export function eventHandler(show: () => ShowService) {
  return (request: Request): Response => {
    const encoder = new TextEncoder();
    let cleanup = () => {};
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        let closed = false;
        let unsubscribe = () => {};
        let cancelHeartbeat = () => {};
        cleanup = () => {
          if (closed) return;
          closed = true;
          unsubscribe();
          cancelHeartbeat();
          request.signal.removeEventListener('abort', cleanup);
          try { controller.close(); }
          catch { /* The consumer may already have cancelled the stream. */ }
        };
        const enqueue = (frame: string) => {
          if (closed) return;
          // Disconnect stalled consumers instead of retaining an unbounded queue.
          if (controller.desiredSize !== null && controller.desiredSize <= 0) { cleanup(); return; }
          controller.enqueue(encoder.encode(frame));
        };
        request.signal.addEventListener('abort', cleanup, { once: true });
        if (request.signal.aborted) { cleanup(); return; }
        enqueue('retry: 1500\n\n');
        unsubscribe = show().subscribe(snapshot => enqueue(
          `event: snapshot\nid: ${snapshot.sessionId}:${snapshot.revision}\ndata: ${JSON.stringify(snapshot)}\n\n`,
        ));
        if (closed) { unsubscribe(); return; }
        const heartbeat = setInterval(() => enqueue(': heartbeat\n\n'), 15000);
        heartbeat.unref();
        cancelHeartbeat = () => clearInterval(heartbeat);
      },
      cancel() { cleanup(); },
    }, { highWaterMark: 16 });
    return new Response(stream, { headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    } });
  };
}
