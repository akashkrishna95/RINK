// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\packages\romi-chat-core\src\useRomi.ts
// @ksum/romi-chat-core — useRomi hook
// All chat logic lives here so the three site widgets share ONE implementation.
// Handles: history windowing, [REDIRECT:url] parsing, "→ " suggestion parsing, anti-leak scrubbing, and tech card limits.
import { useCallback, useEffect, useRef, useState } from 'react';
const REDIRECT_RE = /\[REDIRECT:(https?:\/\/[^\]\s]+)\]/;
const SUGGESTION_RE = /^→\s*(.+)$/gm;
// Widgets never render raw viz/src tags — strip anything the portal-only
// protocol might leak through, so the mini chat always stays clean text.
const PORTAL_ONLY_TAGS = /\[(VIZ:[A-Z]+\]\s*\{[^\n]*\}|GENERATE_REPORT\]|SRC:[^\]]*\])/g;
function parseBotText(raw) {
    let text = raw.replace(PORTAL_ONLY_TAGS, '').trim();
    let redirectUrl;
    const rm = text.match(REDIRECT_RE);
    if (rm) {
        redirectUrl = rm[1];
        text = text.replace(REDIRECT_RE, '').trim();
    }
    // Intercept text stream to isolate line-broken "→ " markers cleanly from paragraph blocks
    const suggestions = [];
    const textMessageParts = [];
    const lines = text.split('\n');
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('→') || trimmed.startsWith('->')) {
            const isolatedText = trimmed.replace(/^(→|->)\s*/, '');
            if (isolatedText && suggestions.length < 3) {
                suggestions.push(isolatedText.trim());
            }
        }
        else {
            textMessageParts.push(line);
        }
    });
    // Reconstitute paragraph block with trailing suggestion commands scrubbed away
    text = textMessageParts.join('\n').trim();
    return { text, redirectUrl, suggestions };
}
export function useRomi({ apiUrl, siteContext, welcomeMessage }) {
    const [messages, setMessages] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('romi_widget_history');
            if (saved)
                return JSON.parse(saved);
        }
        return [{ sender: 'bot', text: welcomeMessage }];
    });
    useEffect(() => {
        if (typeof window !== 'undefined' && messages.length > 0) {
            sessionStorage.setItem('romi_widget_history', JSON.stringify(messages));
        }
    }, [messages]);
    const [isTyping, setIsTyping] = useState(false);
    const abortRef = useRef(null);
    const sessionRef = useRef(`romi-widget-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const sendMessage = useCallback(async (queryText) => {
        const trimmed = queryText.trim();
        if (!trimmed)
            return;
        setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
        setIsTyping(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
            // History window: last 6 turns, mapped to the API's role format
            let historySnapshot = [];
            setMessages((prev) => {
                historySnapshot = prev.slice(-6).map((m) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text,
                }));
                return prev;
            });
            const response = await fetch(`${apiUrl}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    query: trimmed,
                    limit: 5,
                    history: historySnapshot,
                    current_package: siteContext,
                    session_id: sessionRef.current,
                }),
            });
            if (!response.ok)
                throw new Error(`API ${response.status}`);
            const data = await response.json();
            if (data.status === 'success') {
                // Parse the text stream to clean up prompt leaks
                const parsedData = parseBotText(data.ai_answer || '');
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: parsedData.text,
                        technologies: data.data || [], // Keep the raw data totally untouched!
                        redirectUrl: data.redirectUrl || parsedData.redirectUrl || undefined,
                        suggestions: parsedData.suggestions.length > 0 ? parsedData.suggestions : (data.suggestions || undefined)
                    }
                ]);
            }
        }
        catch (err) {
            if (err?.name !== 'AbortError') {
                setMessages((prev) => [...prev, {
                        sender: 'bot',
                        text: "I'm having trouble reaching my knowledge base right now. Please try again in a moment.",
                    }]);
            }
        }
        finally {
            if (timeout)
                clearTimeout(timeout);
            if (abortRef.current === controller)
                setIsTyping(false);
        }
    }, [apiUrl, siteContext]);
    const clearChat = useCallback(() => {
        abortRef.current?.abort();
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('romi_widget_history');
        }
        setMessages([{ sender: 'bot', text: welcomeMessage }]);
        setIsTyping(false);
    }, [welcomeMessage]);
    return { messages, isTyping, sendMessage, clearChat };
}
