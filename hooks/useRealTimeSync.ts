//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\hooks\useRealTimeSync.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { pb } from '@/lib/pocketbase';

export function useRealTimeSync<T extends { id: string }>(
  collectionName: string,
  initialData: T[] = [],
  // Optional mapper function in case the raw PB record needs to be mapped to frontend types during real-time updates
  mapRecord?: (record: any) => T | null
) {
  const [data, setData] = useState<T[]>(initialData || []);
  const mapRecordRef = useRef(mapRecord);
  mapRecordRef.current = mapRecord;

  // Sync state when initialData changes (e.g. during navigation or SSR updates)
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  // Client-side fallback fetch: If initialData is empty, fetch existing records from PocketBase on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchClientData() {
      try {
        const records = await pb.collection(collectionName).getFullList({
          requestKey: null,
        });
        if (!isMounted) return;
        const mapped = records
          .map((r) => (mapRecordRef.current ? mapRecordRef.current(r) : (r as unknown as T)))
          .filter(Boolean) as T[];
        if (mapped.length > 0) {
          setData(mapped);
        }
      } catch (err) {
        console.warn(`[useRealTimeSync] Client fetch for collection "${collectionName}" failed:`, err);
      }
    }

    if (!initialData || initialData.length === 0) {
      fetchClientData();
    }

    return () => {
      isMounted = false;
    };
  }, [collectionName, initialData]);

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

    let isSubscribed = true;

    // Subscribe to all real-time changes in the collection
    pb.collection(collectionName).subscribe('*', (e) => {
      if (!isSubscribed) return;
      console.log(`Real-time update [${collectionName}]:`, e.action);
      
      const parsedRecord = mapRecordRef.current ? mapRecordRef.current(e.record) : (e.record as unknown as T);
      
      // Skip if parsing failed or was filtered out
      if (!parsedRecord) return;

      if (e.action === 'create') {
        setData((prev) => [...prev.filter(item => item.id !== parsedRecord.id), parsedRecord]);
      } else if (e.action === 'update') {
        setData((prev) => prev.map((item) => (item.id === parsedRecord.id ? parsedRecord : item)));
      } else if (e.action === 'delete') {
        setData((prev) => prev.filter((item) => item.id !== parsedRecord.id));
      }
    }).catch((err) => {
      console.warn(`[useRealTimeSync] Failed to subscribe to real-time events for "${collectionName}":`, err);
    });

    // CRITICAL: Cleanup subscription on unmount to prevent memory leaks
    return () => {
      isSubscribed = false;
      pb.collection(collectionName).unsubscribe('*').catch(() => {});
    };
  }, [collectionName]);

  return data;
}

