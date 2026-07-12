import React from 'react';
import { RomiWidgetProps } from '@ksum/romi-chat-core';
export type RomiInstrumentationWidgetProps = Partial<RomiWidgetProps> & {
    apiUrl: string;
};
export default function RomiInstrumentationWidget({ apiUrl, ...overrides }: RomiInstrumentationWidgetProps): React.JSX.Element;
export { RomiInstrumentationWidget };
