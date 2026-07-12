import React from 'react';
import { RomiWidgetProps } from '@ksum/romi-chat-core';
export type RomiTechnologiesWidgetProps = Partial<RomiWidgetProps> & {
    apiUrl: string;
};
export default function RomiTechnologiesWidget({ apiUrl, ...overrides }: RomiTechnologiesWidgetProps): React.JSX.Element;
export { RomiTechnologiesWidget };
