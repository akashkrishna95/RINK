import React from 'react';
import type { RomiWidgetConfig } from './types';
export interface RomiWidgetProps extends RomiWidgetConfig {
    avatarSrc?: string;
    renderTechnologyCard?: (tech: any) => React.ReactNode;
}
export declare function RomiWidget(props: RomiWidgetProps): React.JSX.Element | null;
