// @ksum/romi-widget-rink — Widget A (RINK Main Site: ksum-rink.vercel.app)
// SCOPE: what RINK/KSUM is, programme FAQs (YIP, IdeaBox, ResearchPreneurship,
// IEDC, Incubation), and site navigation. The backend router (siteContext
// "rink-main") sends ANY technology-, instrumentation-, or market-specific
// question to the Romi Portal via [REDIRECT:...] — this widget just renders
// the hand-off button. Zero site-specific logic lives here: change behaviour
// by editing prompts/router on the backend, never this package.
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RomiWidget, DEFAULT_PORTAL_URL } from '@ksum/romi-chat-core';
export default function RomiRinkWidget({ apiUrl, ...overrides }) {
    return (_jsx(RomiWidget, { apiUrl: apiUrl, siteContext: "rink-main", subtitle: "RINK Guide", portalUrl: DEFAULT_PORTAL_URL, welcomeMessage: "Hi, I'm Romi — your guide to RINK, Kerala's Research Innovation Network.\n" +
            "Ask me what RINK is, how our programmes work, or where to find anything on this site.", starterChips: [
            { label: 'What is RINK?', query: 'What is RINK and what does it offer?' },
            { label: 'ResearchPreneurship programme', query: 'Tell me about the ResearchPreneurship programme' },
            { label: 'KSUM programmes for students', query: 'Which KSUM programmes can students apply to?' },
            { label: 'How does licensing work?', query: 'How does technology licensing work on RINK?' },
        ], ...overrides }));
}
export { RomiRinkWidget };
