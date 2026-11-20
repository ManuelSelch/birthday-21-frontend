import assert from 'node:assert/strict';
import { auth } from '../../../features/admin-auth/server';
import { buzzerHandler } from '../../../features/superstar/app/buzzer-http';
import { commandHandler, eventHandler } from '../../../features/superstar/app/http';
import { ShowService } from '../../../features/superstar/app/show-service';
import { parseSnapshot, type ShowSnapshot } from '../../../features/superstar/domain/live-show';

export class SuperstarServerDriver {
  private show: ShowService;
  private cookie = '';
  private response?: Response;
  private streams: Array<{ reader: ReadableStreamDefaultReader<Uint8Array>; buffer: string }> = [];

  private originalEnvironment = process.env;

  constructor() {
    process.env = { ...this.originalEnvironment, ADMIN_PASSWORD: 'show-password' };
    this.show = new ShowService({
      now: () => Date.now(),
      schedule: (callback, delay) => {
        const timer = setTimeout(callback, delay);
        timer.unref();
        return () => clearTimeout(timer);
      },
    }, 'integration-show');
  }

  async dispose() {
    await Promise.all(this.streams.map(stream => stream.reader.cancel()));
    this.show.dispose();
    process.env = this.originalEnvironment;
  }

  async login() {
    const response = await auth.login(new Request('http://party.test/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'show-password', returnTo: '/superstar/control' }),
    }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).redirectTo, '/superstar/control');
    this.cookie = response.headers.get('set-cookie')!.split(';')[0];
  }

  async send(command: unknown, options: { raw?: boolean; contentType?: string; origin?: string; apiKey?: string } = {}) {
    this.response = await commandHandler({ authorize: auth.authorize, show: () => this.show })(
      new Request('http://party.test/api/superstar/commands', {
        method: 'POST', headers: { Cookie: this.cookie, 'Content-Type': options.contentType ?? 'application/json',
          ...(options.origin ? { Origin: options.origin } : {}),
          ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}) },
        body: options.raw ? String(command) : JSON.stringify(command),
      }),
    );
  }

  configureBuzzerKey(key: string | undefined) {
    if (key === undefined) delete process.env.SUPERSTAR_BUZZER_API_KEY;
    else process.env.SUPERSTAR_BUZZER_API_KEY = key;
  }

  async buzz(name: string, key?: string) {
    this.response = await buzzerHandler({
      key: () => process.env.SUPERSTAR_BUZZER_API_KEY,
      show: () => this.show,
    })(new Request(`https://party.test/api/superstar/buzzer/${name}`, {
      method: 'POST',
      headers: { Cookie: this.cookie, ...(key === undefined ? {} : { Authorization: `Bearer ${key}` }) },
    }), name);
  }

  connect() {
    const response = eventHandler(() => this.show)(new Request('http://party.test/api/superstar/events'));
    assert.match(response.headers.get('content-type')!, /text\/event-stream/);
    assert.match(response.headers.get('cache-control')!, /no-store/);
    const index = this.streams.push({ reader: response.body!.getReader(), buffer: '' }) - 1;
    return index;
  }

  async disconnect(index: number) { await this.streams[index].reader.cancel(); }

  async shouldReceive(index: number, expected: Partial<ShowSnapshot['state']>) {
    const stream = this.streams[index];
    const decoder = new TextDecoder();
    const read = async () => {
      while (true) {
        const boundary = stream.buffer.indexOf('\n\n');
        if (boundary >= 0) {
          const frame = stream.buffer.slice(0, boundary);
          stream.buffer = stream.buffer.slice(boundary + 2);
          const data = frame.split('\n').find(line => line.startsWith('data: '));
          if (!data) continue;
          const snapshot = parseSnapshot(JSON.parse(data.slice(6)));
          assert.ok(snapshot);
          for (const [key, value] of Object.entries(expected))
            assert.deepEqual(snapshot.state[key as keyof ShowSnapshot['state']], value);
          return snapshot;
        }
        const { done, value } = await stream.reader.read();
        assert.equal(done, false, 'stream unexpectedly closed');
        stream.buffer += decoder.decode(value, { stream: true });
      }
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([read(), new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('No SSE snapshot within 1 second')), 1000);
      })]);
    } finally { clearTimeout(timer); }
  }

  shouldRespond(status: number) {
    assert.equal(this.response?.status, status);
    assert.equal(this.response?.headers.get('cache-control'), 'no-store');
  }
  shouldRemainUnchanged() { assert.equal(this.show.snapshot().revision, 0); }
}
