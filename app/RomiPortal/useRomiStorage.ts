// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\useRomiStorage.ts
import { useState, useCallback } from 'react';
import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// 1. Define the TypeScript interfaces for our Database
export interface RomiMessage {
  id?: number; // Auto-incremented by Dexie
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  technologies?: any[];
  actionTrigger?: { label: string; url: string; };
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  summary?: string; // For future rolling-context feature
}

// 2. Initialize the Dexie Database
class RomiDatabase extends Dexie {
  sessions!: Table<ChatSession, string>;
  messages!: Table<RomiMessage, number>;

  constructor() {
    super('RomiDB');
    this.version(1).stores({
      sessions: 'id, updatedAt', // Primary key and indexed props
      messages: '++id, sessionId, timestamp'
    });
  }
}

const db = new RomiDatabase();

// 3. The Custom Hook
export function useRomiStorage(consentGranted: boolean) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Auto-subscribe to the sessions table (only if consent is granted)
  const sessions = useLiveQuery(
    () => {
      if (!consentGranted) return [];
      return db.sessions.orderBy('updatedAt').reverse().toArray();
    },
    [consentGranted],
    []
  );

  const createNewSession = async (initialMessage: Omit<RomiMessage, 'sessionId' | 'timestamp'>) => {
    const newId = `romi-${Date.now()}`;
    setCurrentSessionId(newId);

    if (!consentGranted) return newId; // Temporary RAM session only

    const title = initialMessage.content.slice(0, 30) + (initialMessage.content.length > 30 ? '...' : '');
    
    await db.sessions.add({
      id: newId,
      title,
      updatedAt: Date.now()
    });

    await db.messages.add({
      ...initialMessage,
      sessionId: newId,
      timestamp: Date.now()
    });

    return newId;
  };

  const updateCurrentSession = async (messages: Omit<RomiMessage, 'sessionId' | 'timestamp'>[]) => {
    if (!consentGranted || !currentSessionId) return;

    // Get the latest message to add to the DB
    const latestMessage = messages[messages.length - 1];
    
    await db.messages.add({
      ...latestMessage,
      sessionId: currentSessionId,
      timestamp: Date.now()
    });

    // Bump the updatedAt timestamp so it jumps to the top of the sidebar
    await db.sessions.update(currentSessionId, { updatedAt: Date.now() });
  };

  const loadSession = async (id: string) => {
    if (!consentGranted) return [];
    
    // Fetch all messages for this session, sorted by time
    const history = await db.messages
      .where('sessionId')
      .equals(id)
      .sortBy('timestamp');
      
    return history;
  };

  const deleteSession = async (id: string) => {
    if (!consentGranted) return;
    await db.sessions.delete(id);
    await db.messages.where('sessionId').equals(id).delete();
  };

  const clearAllHistory = async () => {
    await db.sessions.clear();
    await db.messages.clear();
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    updateCurrentSession,
    loadSession,
    deleteSession,
    clearAllHistory
  };
}