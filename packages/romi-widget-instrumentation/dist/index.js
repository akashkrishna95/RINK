// @ksum/romi-widget-instrumentation — Widget C (Instrumentation Site: rink-ui.vercel.app)
// SCOPE: lab equipment discovery, specifications, booking procedures, fees,
// and eligibility. The backend (siteContext "instrumentation") routes to the
// Instrumentation Agent prompt, which elicits WHAT the user needs to test when
// they don't know instrument names. Licensing/market/assessment questions
// trigger [REDIRECT:portal].
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RomiWidget, DEFAULT_PORTAL_URL } from '@ksum/romi-chat-core';
export default function RomiInstrumentationWidget({ apiUrl, ...overrides }) {
    return (_jsx(RomiWidget, { apiUrl: apiUrl, siteContext: "instrumentation", subtitle: "Lab & Facility Finder", accentColor: "#219653", portalUrl: DEFAULT_PORTAL_URL, welcomeMessage: "Hi, I'm Romi. I can find lab equipment and testing facilities across Kerala's institutions.\n" +
            "Tell me what you need to test or analyse — you don't need to know the instrument's name.", starterChips: [
            { label: 'Test a material sample', query: 'I need to analyse the composition of a material sample' },
            { label: 'Soil / water testing', query: 'Which facilities can test soil or water samples?' },
            { label: 'Who can book?', query: 'Who is eligible to book lab equipment — students, startups, industry?' },
            { label: 'How booking works', query: 'How does the facility booking procedure work?' },
        ], 
        // Instrumentation site has its own detail routes
        technologyHref: (t) => `/instruments/${t.technology_id}`, ...overrides }));
}
export { RomiInstrumentationWidget };
