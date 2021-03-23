import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ConnectEventHandlers } from './interfaces';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import {
  ConnectEvents,
  CONNECT_SDK_VERSION,
  SDK_PLATFORM,
  PING_TIMEOUT,
} from './constants';

export const defaultOptions: ConnectEventHandlers = {
  loaded: (event: any) => {},
  done: (event: any) => {},
  cancel: (event: any) => {},
  error: (event: any) => {},
  user: (event: any) => {},
  route: (event: any) => {},
};

export class FinicityConnect extends Component {
  webViewRef: WebView | null = null;
  state = {
    connectUrl: '',
    pingingConnect: false,
    pingedConnectSuccessfully: false,
    pingIntervalId: 0,
    options: defaultOptions,
    browserDisplayed: false,
    linkingUri: '',
  };

  constructor(props: {
    connectUrl: string;
    options: ConnectEventHandlers;
    linkingUri: string;
  }) {
    super(props);
    this.launch(props.connectUrl, props.options, props.linkingUri);
  }

  resetState = () => {
    this.setState({ browserDisplayed: false });
    this.setState({ pingingConnect: false });
    this.setState({ pingedConnectSuccessfully: false });
    this.setState({ pingIntervalId: 0 });
    this.setState({ connectUrl: '' });
    this.setState({ options: defaultOptions });
    this.setState({ linkingUri: '' });
    this.webViewRef = null;
  };

  launch = (
    connectUrl: string,
    options: ConnectEventHandlers,
    linkingUri = ''
  ) => {
    this.state.connectUrl = connectUrl;
    this.state.options = { ...defaultOptions, ...options };
    this.state.linkingUri = linkingUri;
  };

  close = () => {
    this.resetState();
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
      this.postMessage({ type: 'window', closed: true });
      this.state.browserDisplayed = false;
      InAppBrowser.closeAuth();
    }
  };

  openBrowser = async (url: string) => {
    this.state.browserDisplayed = true;
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.openAuth(url, ''); // TODO: define deeplink
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
              this.state.options.loaded(eventData);
            } else if (eventType === ConnectEvents.CANCEL) {
              this.state.options.cancel(eventData);
              this.close();
            } else if (eventType === ConnectEvents.DONE) {
              this.state.options.done(eventData);
              this.close();
            } else if (eventType === ConnectEvents.ERROR) {
              this.state.options.error(eventData);
              this.close();
            } else if (eventType === ConnectEvents.ROUTE) {
              this.state.options.route(eventData);
            } else if (eventType === ConnectEvents.USER) {
              this.state.options.user(eventData);
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
