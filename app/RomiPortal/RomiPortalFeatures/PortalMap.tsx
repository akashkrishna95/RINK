// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\PortalMap.tsx
'use client';
import dynamic from 'next/dynamic';
// Import the map dynamically so it doesn't break SSR
const InteractiveMap = dynamic(() => import('@/HomePage/InteractiveMap'), { ssr: false });

export default function PortalMap({ institutions }) {
  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <InteractiveMap 
        institutions={institutions} 
        isExpanded={true} 
      />
    </div>
  );
}