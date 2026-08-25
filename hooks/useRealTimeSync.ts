//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\hooks\useRealTimeSync.ts
'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

export function useRealTimeSync<T extends { id: string }>(
  collectionName: string,
  initialData: T[],
  // Optional mapper function in case the raw PB record needs to be mapped to frontend types during real-time updates
  mapRecord?: (record: any) => T | null
) {
  const [data, setData] = useState<T[]>(initialData);

  // Sync state when initialData changes (e.g. during navigation or SSR updates)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    // If the browser is accessing a public deployment but PocketBase is configured to a local address,
    // do not attempt to subscribe. Connecting to a local IP (localhost/127.0.0.1) from a secure public
    // origin triggers the browser's "Local Network Access" security warning, which degrades UX.
    if (typeof window !== 'undefined') {
      const isPbLocal = pb.baseUrl.includes('localhost') || pb.baseUrl.includes('127.0.0.1');
      const isPageLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isPbLocal && !isPageLocal) {
        console.warn(`[useRealTimeSync] PocketBase is running on local URL (${pb.baseUrl}) but the website is loaded from a public domain (${window.location.hostname}). Skipping real-time subscription to avoid Local Network Access browser warnings.`);
        return () => {};
      }
    }

    // Subscribe to all real-time changes in the collection
    pb.collection(collectionName).subscribe('*', (e) => {
      console.log(`Real-time update [${collectionName}]:`, e.action);
      
      const parsedRecord = mapRecord ? mapRecord(e.record) : (e.record as unknown as T);
      
      // Skip if parsing failed or was filtered out
      if (!parsedRecord) return;

      if (e.action === 'create') {
        setData((prev) => [...prev, parsedRecord]);
      } else if (e.action === 'update') {
        setData((prev) => prev.map((item) => (item.id === parsedRecord.id ? parsedRecord : item)));
      } else if (e.action === 'delete') {
        setData((prev) => prev.filter((item) => item.id !== parsedRecord.id));
      }
    });

    // CRITICAL: Cleanup subscription on unmount to prevent memory leaks
    return () => {
      pb.collection(collectionName).unsubscribe('*');
    };
  }, [collectionName, mapRecord]);

  return data;
}
