'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { parseSnapshot, visibleShow, type ShowCommand, type ShowSnapshot } from '../domain/live-show';

export type ShowConnection = 'connecting' | 'connected' | 'disconnected';
interface ReceivedSnapshot { snapshot: ShowSnapshot; receivedAt: number }

export function useLiveShow() {
  const [packet, setPacket] = useState<ReceivedSnapshot | null>(null);
  const [connection, setConnection] = useState<ShowConnection>('connecting');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(0);
  const commandRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    let events: EventSource | null = null;
    let latest: ShowSnapshot | null = null;
    const receive = (event: Event) => {
      let snapshot: ShowSnapshot | null = null;
      try { snapshot = parseSnapshot(JSON.parse((event as MessageEvent<string>).data)); }
      catch { /* Malformed snapshots must never reach display components. */ }
      if (!snapshot) { setConnection('disconnected'); return; }
      if (latest?.sessionId === snapshot.sessionId && snapshot.revision < latest.revision) return;
      latest = snapshot;
      const receivedAt = performance.now();
      setPacket({ snapshot, receivedAt });
      setClockNow(receivedAt);
      setConnection('connected');
    };
    const connect = () => {
      events?.close();
      events = new EventSource('/api/superstar/events');
      events.addEventListener('snapshot', receive);
      events.onerror = () => setConnection('disconnected');
    };
    const disconnect = () => { events?.close(); setConnection('disconnected'); };
    window.addEventListener('offline', disconnect);
    window.addEventListener('online', connect);
    connect();
    return () => {
      events?.close();
      window.removeEventListener('offline', disconnect);
      window.removeEventListener('online', connect);
      commandRequest.current?.abort();
    };
  }, []);

  // Expire transient artwork locally even while disconnected. Use elapsed monotonic
  // time from receipt, not the display computer's potentially different wall clock.
  const serverNow = packet ? packet.snapshot.serverTime + clockNow - packet.receivedAt : 0;
  useEffect(() => {
    if (!packet) return;
    const now = packet.snapshot.serverTime + performance.now() - packet.receivedAt;
    const deadlines = [...packet.snapshot.juryExpiresAt, packet.snapshot.reactionExpiresAt]
      .filter((deadline): deadline is number => deadline !== null && deadline > now);
    if (!deadlines.length) return;
    const timer = setTimeout(() => setClockNow(performance.now()), Math.min(...deadlines) - now + 5);
    return () => clearTimeout(timer);
  }, [packet, clockNow]);

  const send = useCallback(async (command: ShowCommand) => {
    if (connection !== 'connected' || commandRequest.current) return;
    const request = new AbortController();
    commandRequest.current = request;
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/superstar/commands', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command), signal: request.signal,
      });
      if (!response.ok) throw new Error(response.status === 401
        ? 'Sitzung abgelaufen. Bitte erneut anmelden.' : 'Befehl nicht bestätigt. Bitte erneut versuchen.');
      // SSE is authoritative; do not optimistically mutate display state or replay
      // a failed command automatically (especially a buzzer or golden moment).
    } catch (failure) {
      if (!request.signal.aborted) setError(failure instanceof Error ? failure.message : 'Verbindung fehlgeschlagen.');
    } finally {
      commandRequest.current = null;
      if (!request.signal.aborted) setPending(false);
    }
  }, [connection]);

  return {
    state: packet ? visibleShow(packet.snapshot, serverNow) : null,
    shows: packet?.snapshot.shows ?? [],
    sessionId: packet?.snapshot.sessionId,
    connection, pending, error, send,
  };
}
