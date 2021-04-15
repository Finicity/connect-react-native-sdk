import { Component } from 'react';
import { WebView } from 'react-native-webview';
export interface ConnectEventHandlers {
    onDone: (event: ConnectDoneEvent) => void;
    onCancel: (event: ConnectCancelEvent) => void;
    onError: (event: ConnectErrorEvent) => void;
    onRoute?: (event: ConnectRouteEvent) => void;
    onUser?: (event: any) => void;
    onLoad?: () => void;
}
export interface FinicityConnectProps {
    connectUrl: string;
    eventHandlers: ConnectEventHandlers;
    linkingUri?: string;
}
export interface ConnectCancelEvent {
    code: number;
    reason: string;
}
export interface ConnectErrorEvent {
    code: number;
    reason: string;
}
export interface ConnectDoneEvent {
    code: number;
    reason: string;
    reportData: [
        {
            portfolioId: string;
            type: string;
            reportId: string;
        }
    ];
}
export interface ConnectRouteEvent {
    screen: string;
    params: any;
}
export declare class FinicityConnect extends Component<FinicityConnectProps> {
    webViewRef: WebView | null;
    state: {
        connectUrl: string;
        pingingConnect: boolean;
        pingedConnectSuccessfully: boolean;
        pingIntervalId: number;
        eventHandlers: any;
        browserDisplayed: boolean;
        linkingUri: string;
    };
    constructor(props: FinicityConnectProps);
    launch: (connectUrl: string, eventHandlers: ConnectEventHandlers, linkingUri?: string) => void;
    close: () => void;
    postMessage(eventData: any): void;
    pingConnect: () => void;
    startPingingConnect: () => void;
    stopPingingConnect: () => void;
    dismissBrowser: () => void;
    openBrowser: (url: string) => Promise<void>;
    handleEvent: (event: any) => void;
    render(): JSX.Element;
}
