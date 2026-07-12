import React from 'react';
import { RomiWidgetProps } from '@ksum/romi-chat-core';
export type RomiRinkWidgetProps = Partial<RomiWidgetProps> & {
    apiUrl: string;
};
export default function RomiRinkWidget({ apiUrl, ...overrides }: RomiRinkWidgetProps): React.JSX.Element;
export { RomiRinkWidget };
