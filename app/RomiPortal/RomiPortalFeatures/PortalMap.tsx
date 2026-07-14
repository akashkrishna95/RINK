// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\RomiPortal\RomiPortalFeatures\PortalMap.tsx

'use client';
import dynamic from 'next/dynamic';

// Go up 3 levels to reach the root directory, then into HomePage
const InteractiveMap = dynamic(() => import('../../../HomePage/InteractiveMap'), {
    ssr: false
});

export default function PortalMap({ institutions }: { institutions: any[] }) {
    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <InteractiveMap
                institutions={institutions}
                isExpanded={true}
            />
        </div>
    );
}