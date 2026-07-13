// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\RomiAI\ClientWidget.tsx
// This acts as a smart switch that turns off the widget whenever the URL contains /RomiPortal

'use client';

import { usePathname } from 'next/navigation';
import RomiRinkWidget from '@ksum/romi-widget-rink';

export default function ClientWidget() {
    const pathname = usePathname();

    // If the user is inside the RomiPortal, destroy the floating widget
    if (pathname?.startsWith('/RomiPortal')) {
        return null;
    }

    return (
        <RomiRinkWidget
            apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}
            avatarSrc="/images/romi-avatar.png"
        />
    );
}