import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import {
  ConnectEvents,
  CONNECT_SDK_VERSION,
  SDK_PLATFORM,
  PING_TIMEOUT,
} from './constants';

console.log('$$$$$');
export interface ConnectEventHandlers {
  loaded: Function;
  done: Function;
  cancel: Function;
  error: Function;
  user: Function;
  route: Function;
}

const defaultEventHandlers: ConnectEventHandlers = {
  loaded: (event: any) => {},
  done: (event: any) => {},
  cancel: (event: any) => {},
  error: (event: any) => {},
  user: (event: any) => {},
  route: (event: any) => {},
};

export interface FinicityConnectProps {
  connectUrl: string;
  eventHandlers: ConnectEventHandlers;
  linkingUri?: string;
}

export class FinicityConnect extends Component<FinicityConnectProps> {
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

  constructor(props: FinicityConnectProps) {
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
    this.state.eventHandlers.cancel({
      code: 100,
      reason: 'exit',
    });
  };

  postMessage(eventData: any) {
    this.webViewRef?.postMessage(JSON.stringify(eventData));
  }

  pingConnect = () => {
    if (this.webViewRef !== null) {
      this.postMessage({
        type: ConnectEvents.PING,
        sdkVersion: CONNECT_SDK_VERSION,
        platform: SDK_PLATFORM,
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

  dismissBrowser = () => {
    if (this.state.browserDisplayed) {
      console.log('dismissing browser');
      this.postMessage({ type: 'window', closed: true });
      this.state.browserDisplayed = false;
      InAppBrowser.closeAuth();
    }
  };

  openBrowser = async (url: string) => {
    console.log(this.state);
    this.state.browserDisplayed = true;
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.openAuth(url, ''); // TODO: define deeplink
      console.log(result);
      this.dismissBrowser();
    } else {
      // TODO: find a way to handle this, maybe just show an alert?
    }
  };

  render() {
    return (
      <Modal
        animationType={'slide'}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        transparent={false}
        onRequestClose={this.close}
      >
        <WebView
          ref={(ref: any) => (this.webViewRef = ref)}
          source={{ uri: this.state.connectUrl }}
          onMessage={(event: any) => {
            const eventData = parseEventData(event.nativeEvent.data);
            const eventType = eventData.type;
            if (
              eventType === ConnectEvents.URL &&
              !this.state.browserDisplayed
            ) {
              const url = eventData.url;
              this.openBrowser(url);
            } else if (
              eventType === ConnectEvents.CLOSE_POPUP &&
              this.state.browserDisplayed
            ) {
              this.dismissBrowser();
            } else if (eventType === ConnectEvents.ACK) {
              this.state.pingedConnectSuccessfully = true;
              this.stopPingingConnect();
              const eventData = { type: ConnectEvents.LOADED, data: null };
              this.state.eventHandlers.loaded(eventData);
            } else if (eventType === ConnectEvents.CANCEL) {
              this.state.eventHandlers.cancel(eventData);
            } else if (eventType === ConnectEvents.DONE) {
              this.state.eventHandlers.done(eventData);
            } else if (eventType === ConnectEvents.ERROR) {
              this.state.eventHandlers.error(eventData);
            } else if (eventType === ConnectEvents.ROUTE) {
              this.state.eventHandlers.route(eventData);
            } else if (eventType === ConnectEvents.USER) {
              this.state.eventHandlers.user(eventData);
            }
          }}
          onLoad={() => {
            this.startPingingConnect();
          }}
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
