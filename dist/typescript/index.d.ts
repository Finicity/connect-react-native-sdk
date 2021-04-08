import { Component } from 'react';
import { WebView } from 'react-native-webview';
export interface ConnectEventHandlers {
    onLoad?: Function;
    onDone: Function;
    onCancel: Function;
    onError: Function;
    onUser?: Function;
    onRoute?: Function;
}
export interface FinicityConnectProps {
    connectUrl: string;
    eventHandlers: ConnectEventHandlers;
    linkingUri?: string;
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
