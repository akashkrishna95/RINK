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
