import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const CONNECT_SDK_VERSION = '1.0.0';
const SDK_PLATFORM = 'reactNative';
const PING_TIMEOUT = 1000;

const styles = {
  container: {
    flex: 1,
  },
};

const defaultOptions = {
  loaded: (event: any) => {},
  done: (event: any) => {},
  cancel: (event: any) => {},
  error: (event: any) => {},
  user: (event: any) => {},
  route: (event: any) => {}
};

const ConnectEvents = {
  // Internal events used by Connect
  ACK: 'ack',
  CLOSE_POPUP: 'closePopup',
  PING: 'ping',
  URL: 'url',

  // App events exposed to developers
  CANCEL: 'cancel',
  DONE: 'done',
  ERROR: 'error',
  LOADED: 'loaded',
  ROUTE: 'route',
  SUCCESS: 'success',
  USER: 'user',
};

class FinicityConnect extends Component {
  state = {
    show: false,
    webView: null,
    connectUrl: '',
    pingingConnect: false,
    pingedConnectSuccessfully: false,
    pingIntervalId: 0,
    options: defaultOptions,
  };
  
  constructor(props: any) {
    super(props);
  }

  resetState = () => {
    this.setState({ show: false });
    this.setState({ pingingConnect: false });
    this.setState({ pingedConnectSuccessfully: false });
    this.setState({ pingIntervalId: 0 });
    this.setState({ webView: null });
    this.setState({ connectUrl: '' });
  };

  connectWithUrl = (connectUrl: string, options: any) => {
    this.setState({ connectUrl: connectUrl });
    this.setState({ options: { ...defaultOptions, ...options } });
    this.setState({ show: true });
  };

  close = () => {
    this.resetState();
  };

  postMessage(eventData: any) {
    (this.state.webView as any).postMessage(JSON.stringify(eventData));
  }

  pingConnect = () => {
    if (this.state.webView != null) {
      // console.log("sending ping event");
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
      this.state.webView != null &&
      !this.state.pingedConnectSuccessfully &&
      !this.state.pingingConnect &&
      this.state.pingIntervalId == 0
    ) {
      this.state.pingingConnect = true;
      (this.state.pingIntervalId as any) = setInterval(this.pingConnect, PING_TIMEOUT);
      // console.log("Start sending pinging event to connect with pingIntervalId=" + this.state.pingIntervalId);
    }
  };

  stopPingingConnect = () => {
    if (this.state.pingingConnect && this.state.pingIntervalId != 0) {
      // console.log("Got ping ack from connect, stop sending ping event for pingIntervalId=" + this.state.pingIntervalId);
      clearInterval(this.state.pingIntervalId);
      this.state.pingingConnect = false;
      this.state.pingIntervalId = 0;
    }
  };

  dismissBrowser = () => {
    this.postMessage({ type: 'window', closed: true });
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
    }
    // TODO: dismiss browser through deep linking (requires changes on the backend)
  };

  openBrowser = async (url: string) => {
    // NOTE: using openBrowserAsync is inconsistent between iOS and Android
    await WebBrowser.openAuthSessionAsync(url, Constants.linkingUri);
    this.dismissBrowser();
  };

  render() {
    let { show } = this.state;

    return (
      <Modal
        animationType={'slide'}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        transparent={false}
        visible={show}
        onRequestClose={this.close}
      >
        <WebView
          ref={(ref) => (this.setState({ webview: ref }))}
          source={{ uri: this.state.connectUrl }}
          onMessage={(event) => {
            const eventData = parseEventData(event.nativeEvent.data);
            const eventType = eventData.type;
            // console.log("CONNECT EVT-TYPE: " + eventType);
            if (eventType === ConnectEvents.URL) {
              const url = eventData.url;
              this.openBrowser(url);
            } else if (eventType === ConnectEvents.CLOSE_POPUP) {
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

export default FinicityConnect;

function parseEventData(eventData: any) {
  try {
    return typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
  } catch (e) {
    return {};
  }
}
