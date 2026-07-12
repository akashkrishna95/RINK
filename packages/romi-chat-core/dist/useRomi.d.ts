import type { RomiMessage, SiteContext } from './types';
export interface UseRomiOptions {
    apiUrl: string;
    siteContext: SiteContext;
    welcomeMessage: string;
}
export declare function useRomi({ apiUrl, siteContext, welcomeMessage }: UseRomiOptions): {
    messages: RomiMessage[];
    isTyping: boolean;
    sendMessage: (queryText: string) => Promise<void>;
    clearChat: () => void;
};
