import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import {
  ConnectEvents,
  SDK_PLATFORM,
  PING_TIMEOUT,
  CONNECT_SDK_VERSION,
} from './constants';
import checkLink, { ConnectReactNativeSdk } from './deeplink';

export interface ConnectEventHandlers {
  onDone: (event: ConnectDoneEvent) => void;
  onCancel: (event: ConnectCancelEvent) => void;
  onError: (event: ConnectErrorEvent) => void;
  onRoute?: (event: ConnectRouteEvent) => void;
  onUser?: (event: any) => void;
  onLoad?: () => void;
}

const defaultEventHandlers: any = {
  onLoad: () => {},
  onUser: () => {},
  onRoute: () => {},
};

export interface ConnectProps {
  connectUrl: string;
  eventHandlers: ConnectEventHandlers;
  linkingUri?: string;
  redirectUrl?: string;
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

export class Connect extends Component<ConnectProps> {
  webViewRef: WebView | null = null;
  state = {
    connectUrl: '',
    pingingConnect: false,
    pingedConnectSuccessfully: false,
    pingIntervalId: 0,
    eventHandlers: defaultEventHandlers,
    browserDisplayed: false,
    linkingUri: '',
  };

  constructor(props: ConnectProps) {
    super(props);
    this.launch(props.connectUrl, props.eventHandlers, props.linkingUri);
  }

  launch = (
    connectUrl: string,
    eventHandlers: ConnectEventHandlers,
    linkingUri = ''
  ) => {
    this.state.connectUrl = connectUrl;
    this.state.eventHandlers = { ...defaultEventHandlers, ...eventHandlers };
    this.state.linkingUri = linkingUri;
  };

  close = () => {
    this.state.eventHandlers.onCancel({
      code: 100,
      reason: 'exit',
    });
  };

  postMessage(eventData: any) {
    this?.webViewRef?.postMessage(JSON.stringify(eventData));
  }

  pingConnect = () => {
    const { redirectUrl = '' } = this.props;
    if (this.webViewRef !== null) {
      this.postMessage({
        type: ConnectEvents.PING,
        sdkVersion: CONNECT_SDK_VERSION,
        platform: SDK_PLATFORM,
        redirectUrl: redirectUrl,
      });
    } else {
      this.stopPingingConnect();
    }
  };

  startPingingConnect = () => {
    if (
      this.webViewRef !== null &&
      !this.state.pingedConnectSuccessfully &&
      !this.state.pingingConnect &&
      this.state.pingIntervalId === 0
    ) {
      this.state.pingingConnect = true;
      (this.state.pingIntervalId as any) = setInterval(
        this.pingConnect,
        PING_TIMEOUT
      );
    }
  };

  stopPingingConnect = () => {
    if (this.state.pingingConnect && this.state.pingIntervalId != 0) {
      clearInterval(this.state.pingIntervalId);
      this.state.pingingConnect = false;
      this.state.pingIntervalId = 0;
    }
  };

  dismissBrowser = (type?: string) => {
    if (this.state.browserDisplayed) {
      this.postMessage({ type: 'window', closed: true });
      this.state.browserDisplayed = false;
      if (type !== 'cancel')
        (Platform.OS === 'android'
          ? ConnectReactNativeSdk
          : InAppBrowser
        ).close();
    }
  };

  openBrowser = async (url: string) => {
    this.state.browserDisplayed = true;
    await InAppBrowser.isAvailable();
    // NOTE: solves bug in InAppBrowser if an object with non-iOS options is passed
    const browserOptions =
      Platform.OS === 'ios'
        ? undefined
        : { forceCloseOnRedirection: false, showInRecents: true };

    if (Platform.OS === 'android') {
      const { type } = await ConnectReactNativeSdk.open({
        url,
      });
      this.dismissBrowser(type);
    } else {
      const { type } = await InAppBrowser.open(url, browserOptions);
      this.dismissBrowser(type);
    }
  };

  handleEvent = (event: any) => {
    const eventData = parseEventData(event.nativeEvent.data);
    const eventType = eventData.type;
    if (eventType === ConnectEvents.URL && !this.state.browserDisplayed) {
      const url = eventData.url;
      if (Platform.OS === 'ios') {
        checkLink(url).then((canOpen) => {
          if (!canOpen) {
            this.openBrowser(url);
          }
        });
      } else {
        this.openBrowser(url);
      }
    } else if (
      eventType === ConnectEvents.CLOSE_POPUP &&
      this.state.browserDisplayed
    ) {
      this.dismissBrowser();
    } else if (eventType === ConnectEvents.ACK) {
      this.state.pingedConnectSuccessfully = true;
      this.stopPingingConnect();
      this.state.eventHandlers.onLoad();
    } else if (eventType === ConnectEvents.CANCEL) {
      this.state.eventHandlers.onCancel(eventData.data);
    } else if (eventType === ConnectEvents.DONE) {
      this.state.eventHandlers.onDone(eventData.data);
    } else if (eventType === ConnectEvents.ERROR) {
      this.state.eventHandlers.onError(eventData.data);
    } else if (eventType === ConnectEvents.ROUTE) {
      this.state.eventHandlers.onRoute(eventData.data);
    } else if (eventType === ConnectEvents.USER) {
      this.state.eventHandlers.onUser(eventData.data);
    }
  };

  render() {
    return (
      <Modal
        animationType={'slide'}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        transparent={false}
        testID="test-modal"
        onRequestClose={() => this.close()}
      >
        <WebView
          ref={(ref: any) => (this.webViewRef = ref)}
          source={{ uri: this.state.connectUrl }}
          testID="test-webview"
          onMessage={(event) => this.handleEvent(event)}
          onLoad={() => this.startPingingConnect()}
        />
      </Modal>
    );
  }
}

function parseEventData(eventData: any) {
  try {
    return typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
  } catch (e) {
    return {};
  }
}
