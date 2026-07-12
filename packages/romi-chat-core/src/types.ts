// @ksum/romi-chat-core — shared types
// One core package powers all three site widgets. Site packages only pass config.

export type SiteContext = 'rink-main' | 'technologies' | 'instrumentation';

export interface Technology {
  technology_id: string;
  technology_name: string;
  institution: string;
  primary_sector: string;
  brief_description_abstract: string;
  trl: string;
  startup_potential: string;
  patent_status: string;
  image_url?: string;
  email?: string;
}

export interface RomiMessage {
  sender: 'bot' | 'user';
  text: string;
  technologies?: Technology[];
  redirectUrl?: string;       // set when backend emitted [REDIRECT:...]
  suggestions?: string[];     // parsed "→ " lines
}

export interface RomiApiResponse {
  status: 'success' | 'redirect' | 'error';
  ai_answer: string;
  match_count?: number;
  data?: Technology[];
  show_visuals?: boolean;
  intent_route_logged?: string;
}

export interface RomiWidgetConfig {
  /** FastAPI base URL, e.g. https://romi-api.railway.app */
  apiUrl: string;
  /** Which site this widget lives on — drives backend routing + redirects */
  siteContext: SiteContext;
  /** Romi Portal URL used when the widget must hand off */
  portalUrl?: string;
  /** First bot message */
  welcomeMessage: string;
  /** Quick-start chips shown under the welcome message */
  starterChips: { label: string; query: string }[];
  /** Header subtitle, e.g. "Technology Discovery" */
  subtitle?: string;
  /** Brand color (default KSUM blue) */
  accentColor?: string;
  /** Called instead of window.open when a portal redirect fires */
  onRedirectToPortal?: (url: string) => void;
  /** Link builder for technology cards (defaults to /technologies/{id}) */
  technologyHref?: (tech: Technology) => string;
}

export const DEFAULT_PORTAL_URL = 'http://localhost:3000/RomiPortal';
