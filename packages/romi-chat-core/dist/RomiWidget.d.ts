import React from 'react';
import type { RomiWidgetConfig, Technology } from './types';
export interface RomiWidgetProps extends RomiWidgetConfig {
    avatarSrc?: string;
    renderTechnologyCard?: (tech: Technology) => React.ReactNode;
}
export declare function RomiWidget(props: RomiWidgetProps): React.JSX.Element | null;
