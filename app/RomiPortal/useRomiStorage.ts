// app/RomiPortal/useRomiStorage.ts — v2 FIXED
//
// THE BUG THAT MADE INDEXEDDB "NOT WORK": createNewSession called
// setCurrentSessionId(newId), but React state updates are ASYNC — so when
// updateCurrentSession ran moments later in the same exchange,
// `currentSessionId` was still null and the guard silently returned.
// Result: the first messages of every chat were never written. Also, the old
// updateCurrentSession saved only the LAST message of the array, so
// user/assistant pairs were half-saved.
//
// FIXES:
//   1. Every write function takes sessionId as an EXPLICIT parameter — no
//      dependence on React state timing. createNewSession returns the id;
//      callers hold it in a ref/variable and pass it forward.
//   2. saveExchange() writes the user message AND the assistant message in
//      one bulk transaction.
//   3. navigator.storage.persist() requested once — stops the browser from
//      evicting chats under storage pressure (the low-end-phone concern).
//   4. getStorageEstimate() for your storage meter UI.
//   5. Rolling summary field: saveSummary() stores the conversation-state
//      JSON per session (the fast-context feature).

import { useState, useEffect, useCallback } from 'react';
import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

export interface RomiMessage {
  id?: number;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  technologies?: any[];
  actionTrigger?: { label: string; url: string };
  sources?: { id: string; title: string; url: string; domain: string; snippet: string }[];
  follow_ups?: string[];
  market?: any;               // the structured market object from /api/search
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  summary?: string;           // rolling conversation-state JSON (stringified)
  mode?: string;              // mode of this chat session
  assessment?: {
    progress: number;
    stages: any[];
  };
}

class RomiDatabase extends Dexie {
  sessions!: Table<ChatSession, string>;
  messages!: Table<RomiMessage, number>;
  constructor() {
    super('RomiDB');
    this.version(2).stores({
      sessions: 'id, updatedAt',
      messages: '++id, sessionId, timestamp',
    });
  }
}

export const db = new RomiDatabase();

export function useRomiStorage(consentGranted: boolean) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Ask the browser to treat our data as durable (once).
  useEffect(() => {
    if (consentGranted && typeof navigator !== 'undefined' && navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, [consentGranted]);

  const sessions = useLiveQuery(
    () => {
      const hasConsent = consentGranted || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
      return hasConsent ? db.sessions.orderBy('updatedAt').reverse().toArray() : [];
    },
    [consentGranted],
    []
  );

  /** Creates the session AND writes the first message atomically.
   *  RETURNS the id — the caller must keep it (e.g. in a ref) and pass it to
   *  every subsequent save. Never rely on currentSessionId state for writes. */
  const createNewSession = useCallback(async (
    firstMessage: Omit<RomiMessage, 'sessionId' | 'timestamp'>,
    mode: string = 'search'
  ): Promise<string> => {
    const newId = `romi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setCurrentSessionId(newId);
    const hasConsent = consentGranted || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
    if (!hasConsent) return newId;   // temporary chat: RAM only, by design

    const title = firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '…' : '');
    try {
      await db.transaction('rw', db.sessions, db.messages, async () => {
        await db.sessions.add({ id: newId, title, updatedAt: Date.now(), mode });
        await db.messages.add({ ...firstMessage, sessionId: newId, timestamp: Date.now() });
      });
    } catch (err) {
      console.error("Dexie error in createNewSession:", err);
    }
    return newId;
  }, [consentGranted]);

  /** Saves a complete exchange (user question + assistant answer) in one
   *  transaction. sessionId is EXPLICIT — pass the value returned by
   *  createNewSession or the loaded chat's id. */
  const saveExchange = useCallback(async (
    sessionId: string,
    userMsg: Omit<RomiMessage, 'sessionId' | 'timestamp'> | null,
    assistantMsg: Omit<RomiMessage, 'sessionId' | 'timestamp'>
  ) => {
    const hasConsent = consentGranted || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
    if (!hasConsent || !sessionId) return;
    const now = Date.now();
    try {
      await db.transaction('rw', db.sessions, db.messages, async () => {
        if (userMsg) await db.messages.add({ ...userMsg, sessionId, timestamp: now });
        await db.messages.add({ ...assistantMsg, sessionId, timestamp: now + 1 });
        await db.sessions.update(sessionId, { updatedAt: now + 1 });
      });
    } catch (err) {
      console.error("Dexie error in saveExchange:", err);
    }
  }, [consentGranted]);

  /** Stores the rolling conversation-state JSON for fast context loading. */
  const saveSummary = useCallback(async (sessionId: string, summary: string) => {
    const hasConsent = consentGranted || (typeof window !== 'undefined' && localStorage.getItem('romi-consent') === 'true');
    if (!hasConsent || !sessionId) return;
    await db.sessions.update(sessionId, { summary });
  }, [consentGranted]);

  const loadSession = useCallback(async (id: string) => {
    if (!consentGranted) return { messages: [] as RomiMessage[], summary: undefined as string | undefined, mode: undefined as string | undefined };
    const [messages, session] = await Promise.all([
      db.messages.where('sessionId').equals(id).sortBy('timestamp'),
      db.sessions.get(id),
    ]);
    return { messages, summary: session?.summary, mode: session?.mode, assessment: session?.assessment };
  }, [consentGranted]);

  const deleteSession = useCallback(async (id: string) => {
    if (!consentGranted) return;
    await db.transaction('rw', db.sessions, db.messages, async () => {
      await db.sessions.delete(id);
      await db.messages.where('sessionId').equals(id).delete();
    });
  }, [consentGranted]);

  const clearAllHistory = useCallback(async () => {
    await db.transaction('rw', db.sessions, db.messages, async () => {
      await db.sessions.clear();
      await db.messages.clear();
    });
  }, []);

  const renameSession = useCallback(async (id: string, newTitle: string) => {
    if (!consentGranted) return;
    await db.sessions.update(id, { title: newTitle });
  }, [consentGranted]);

  /** For the global storage meter: { usedBytes, quotaBytes, percentUsed } */
  const getStorageEstimate = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
    const est = await navigator.storage.estimate();
    const used = est.usage ?? 0, quota = est.quota ?? 0;
    return { usedBytes: used, quotaBytes: quota, percentUsed: quota ? Math.round((used / quota) * 100) : 0 };
  }, []);

  /** Export a session as downloadable JSON (the "file on my phone" on demand). */
  const exportSession = useCallback(async (id: string) => {
    const { messages } = await loadSession(id);
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: `romi-chat-${id}.json`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  }, [loadSession]);

  /** Updates fields on a specific message in a session by its sorted index offset. */
  const updateMessage = useCallback(async (
    sessionId: string,
    messageIndex: number,
    updatedFields: Partial<RomiMessage>
  ) => {
    if (!consentGranted || !sessionId) return;
    await db.transaction('rw', db.messages, async () => {
      const msgs = await db.messages.where('sessionId').equals(sessionId).sortBy('timestamp');
      const target = msgs[messageIndex];
      if (target && target.id !== undefined) {
        await db.messages.update(target.id, updatedFields);
      }
    });
  }, [consentGranted]);

  return {
    sessions, currentSessionId, setCurrentSessionId,
    createNewSession, saveExchange, saveSummary, loadSession,
    deleteSession, clearAllHistory, renameSession,
    getStorageEstimate, exportSession, updateMessage,
  };
}


