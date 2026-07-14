// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\useRomiStorage.ts

import { useState, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  technologies?: any[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export function useRomiStorage(consentStatus: boolean) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load all sessions on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('romi-consent') === 'true';
      if (consent) {
        const stored = localStorage.getItem('romi-chat-sessions');
        if (stored) {
          setSessions(JSON.parse(stored));
        }
      } else {
        // If consent is not granted, clear any temporary session data left over in localStorage
        localStorage.removeItem('romi-chat-sessions');
        setSessions([]);
      }
    }
  }, [consentStatus]);

  // Create a new session
  const createNewSession = (initialMessage: Message) => {
    const newId = `session-${Date.now()}`;
    // Auto-generate a short title from the first message
    let title = initialMessage.content.substring(0, 30);
    if (initialMessage.content.length > 30) title += '...';

    const newSession: ChatSession = {
      id: newId,
      title: title,
      messages: [initialMessage],
      updatedAt: Date.now()
    };

    // Load existing sessions directly from localStorage to prevent overwriting
    let currentSessions: ChatSession[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('romi-chat-sessions');
      if (stored) {
        try {
          currentSessions = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    const updatedSessions = [newSession, ...currentSessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newId);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('romi-chat-sessions', JSON.stringify(updatedSessions));
    }
    return newId;
  };

  // Update current session with new messages
  const updateCurrentSession = (newMessages: Message[]) => {
    if (!currentSessionId) return;

    // Load existing sessions directly from localStorage to prevent using stale state
    let currentSessions: ChatSession[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('romi-chat-sessions');
      if (stored) {
        try {
          currentSessions = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    const updatedSessions = currentSessions.map(session => {
      if (session.id === currentSessionId) {
        return { ...session, messages: newMessages, updatedAt: Date.now() };
      }
      return session;
    }).sort((a, b) => b.updatedAt - a.updatedAt); // Keep newest at top

    setSessions(updatedSessions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('romi-chat-sessions', JSON.stringify(updatedSessions));
    }
  };

  // Load a specific session
  const loadSession = (id: string): Message[] | null => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(session.id);
      return session.messages;
    }
    return null;
  };

  // Delete a specific session
  const deleteSession = (id: string) => {
    // Load existing sessions directly from localStorage to prevent stale state issues
    let currentSessions: ChatSession[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('romi-chat-sessions');
      if (stored) {
        try {
          currentSessions = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    const updated = currentSessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('romi-chat-sessions', JSON.stringify(updated));
    }
  };

  // Delete all history
  const clearAllHistory = () => {
    setSessions([]);
    setCurrentSessionId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('romi-chat-sessions');
    }
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