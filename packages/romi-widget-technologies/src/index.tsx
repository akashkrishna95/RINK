// @ksum/romi-widget-technologies — Widget B (Technologies Site: rink-ksum.vercel.app)
// SCOPE: technology discovery from the 160+ catalogue — sector elicitation,
// TRL/patent filters, up to 5 result cards with links, then compare offers.
// The backend (siteContext "technologies") routes to the Tech Search Agent
// prompt; TAM/SAM/SOM, competitor scans, and ResearchPreneurship assessments
// trigger [REDIRECT:portal] which this widget renders as a hand-off button.

'use client';

import React from 'react';
import { RomiWidget, RomiWidgetProps, DEFAULT_PORTAL_URL, Technology } from '@ksum/romi-chat-core';

export type RomiTechnologiesWidgetProps = Partial<RomiWidgetProps> & { apiUrl: string };

export default function RomiTechnologiesWidget({ apiUrl, ...overrides }: RomiTechnologiesWidgetProps) {
  return (
    <RomiWidget
      apiUrl={apiUrl}
      siteContext="technologies"
      subtitle="Technology Discovery"
      portalUrl={DEFAULT_PORTAL_URL}
      welcomeMessage={
        "Hi, I'm Romi. I can search 160+ licensable technologies from Kerala's research institutions.\n" +
        "Tell me your sector, problem, or budget — or tap a starter below."
      }
      starterChips={[
        { label: 'High startup potential', query: 'Show me technologies with high startup potential' },
        { label: 'Market-ready (TRL 7+)', query: 'Show me market ready technologies with TRL 7 or above' },
        { label: 'Agritech technologies', query: 'Show me technologies in agriculture' },
        { label: 'Patented technologies', query: 'Show me patented technologies' },
      ]}
      // Cards on this site link to its own detail pages
      technologyHref={(t: Technology) => `/technologies/${t.technology_id}`}
      {...overrides}
    />
  );
}

export { RomiTechnologiesWidget };
