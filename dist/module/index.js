function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { ConnectEvents, CONNECT_SDK_VERSION, SDK_PLATFORM, PING_TIMEOUT } from './constants';
const defaultEventHandlers = {
  onLoad: event => {},
  onUser: event => {},
  onRoute: event => {}
};
export class FinicityConnect extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "webViewRef", null);

    _defineProperty(this, "state", {
      connectUrl: '',
      pingingConnect: false,
      pingedConnectSuccessfully: false,
      pingIntervalId: 0,
      eventHandlers: defaultEventHandlers,
      browserDisplayed: false,
      linkingUri: ''
    });

    _defineProperty(this, "launch", (connectUrl, eventHandlers, linkingUri = '') => {
      this.state.connectUrl = connectUrl;
      this.state.eventHandlers = { ...defaultEventHandlers,
        ...eventHandlers
      };
      this.state.linkingUri = linkingUri;
    });

    _defineProperty(this, "close", () => {
      this.state.eventHandlers.onCancel({
        code: 100,
        reason: 'exit'
      });
    });

    _defineProperty(this, "pingConnect", () => {
      if (this.webViewRef !== null) {
        this.postMessage({
          type: ConnectEvents.PING,
          sdkVersion: CONNECT_SDK_VERSION,
          platform: SDK_PLATFORM
        });
      } else {
        this.stopPingingConnect();
      }
    });

    _defineProperty(this, "startPingingConnect", () => {
      if (this.webViewRef !== null && !this.state.pingedConnectSuccessfully && !this.state.pingingConnect && this.state.pingIntervalId === 0) {
        this.state.pingingConnect = true;
        this.state.pingIntervalId = setInterval(this.pingConnect, PING_TIMEOUT);
      }
    });

    _defineProperty(this, "stopPingingConnect", () => {
      if (this.state.pingingConnect && this.state.pingIntervalId != 0) {
        clearInterval(this.state.pingIntervalId);
        this.state.pingingConnect = false;
        this.state.pingIntervalId = 0;
      }
    });

    _defineProperty(this, "dismissBrowser", () => {
      if (this.state.browserDisplayed) {
        this.postMessage({
          type: 'window',
          closed: true
        });
        this.state.browserDisplayed = false;
        InAppBrowser.closeAuth();
      }
    });

    _defineProperty(this, "openBrowser", async url => {
      this.state.browserDisplayed = true;
      await InAppBrowser.isAvailable();
      await InAppBrowser.openAuth(url, this.state.linkingUri);
      this.dismissBrowser();
    });

    _defineProperty(this, "handleEvent", event => {
      const eventData = parseEventData(event.nativeEvent.data);
      const eventType = eventData.type;

      if (eventType === ConnectEvents.URL && !this.state.browserDisplayed) {
        const url = eventData.url;
        this.openBrowser(url);
      } else if (eventType === ConnectEvents.CLOSE_POPUP && this.state.browserDisplayed) {
        this.dismissBrowser();
      } else if (eventType === ConnectEvents.ACK) {
        this.state.pingedConnectSuccessfully = true;
        this.stopPingingConnect();
        const eventData = {
          type: ConnectEvents.LOADED,
          data: null
        };
        this.state.eventHandlers.onLoad(eventData);
      } else if (eventType === ConnectEvents.CANCEL) {
        this.state.eventHandlers.onCancel(eventData);
      } else if (eventType === ConnectEvents.DONE) {
        this.state.eventHandlers.onDone(eventData);
      } else if (eventType === ConnectEvents.ERROR) {
        this.state.eventHandlers.onError(eventData);
      } else if (eventType === ConnectEvents.ROUTE) {
        this.state.eventHandlers.onRoute(eventData);
      } else if (eventType === ConnectEvents.USER) {
        this.state.eventHandlers.onUser(eventData);
      }
    });

    this.launch(props.connectUrl, props.eventHandlers, props.linkingUri);
  }

  postMessage(eventData) {
    var _this$webViewRef;

    (_this$webViewRef = this.webViewRef) === null || _this$webViewRef === void 0 ? void 0 : _this$webViewRef.postMessage(JSON.stringify(eventData));
  }

  render() {
    return /*#__PURE__*/React.createElement(Modal, {
      animationType: 'slide',
      presentationStyle: Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen',
      transparent: false,
      onRequestClose: () => this.close()
    }, /*#__PURE__*/React.createElement(WebView, {
      ref: ref => this.webViewRef = ref,
      source: {
        uri: this.state.connectUrl
      },
      onMessage: event => this.handleEvent(event),
      onLoad: () => this.startPingingConnect()
    }));
  }

}

function parseEventData(eventData) {
  try {
    return typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
  } catch (e) {
    return {};
  }
}
//# sourceMappingURL=index.js.map