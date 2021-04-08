"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FinicityConnect = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeWebview = require("react-native-webview");

var _reactNativeInappbrowserReborn = require("react-native-inappbrowser-reborn");

var _constants = require("./constants");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultEventHandlers = {
  onLoad: event => {},
  onUser: event => {},
  onRoute: event => {}
};

class FinicityConnect extends _react.Component {
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
          type: _constants.ConnectEvents.PING,
          sdkVersion: _constants.CONNECT_SDK_VERSION,
          platform: _constants.SDK_PLATFORM
        });
      } else {
        this.stopPingingConnect();
      }
    });

    _defineProperty(this, "startPingingConnect", () => {
      if (this.webViewRef !== null && !this.state.pingedConnectSuccessfully && !this.state.pingingConnect && this.state.pingIntervalId === 0) {
        this.state.pingingConnect = true;
        this.state.pingIntervalId = setInterval(this.pingConnect, _constants.PING_TIMEOUT);
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

        _reactNativeInappbrowserReborn.InAppBrowser.closeAuth();
      }
    });

    _defineProperty(this, "openBrowser", async url => {
      this.state.browserDisplayed = true;
      await _reactNativeInappbrowserReborn.InAppBrowser.isAvailable();
      await _reactNativeInappbrowserReborn.InAppBrowser.openAuth(url, this.state.linkingUri);
      this.dismissBrowser();
    });

    _defineProperty(this, "handleEvent", event => {
      const eventData = parseEventData(event.nativeEvent.data);
      const eventType = eventData.type;

      if (eventType === _constants.ConnectEvents.URL && !this.state.browserDisplayed) {
        const url = eventData.url;
        this.openBrowser(url);
      } else if (eventType === _constants.ConnectEvents.CLOSE_POPUP && this.state.browserDisplayed) {
        this.dismissBrowser();
      } else if (eventType === _constants.ConnectEvents.ACK) {
        this.state.pingedConnectSuccessfully = true;
        this.stopPingingConnect();
        const eventData = {
          type: _constants.ConnectEvents.LOADED,
          data: null
        };
        this.state.eventHandlers.onLoad(eventData);
      } else if (eventType === _constants.ConnectEvents.CANCEL) {
        this.state.eventHandlers.onCancel(eventData);
      } else if (eventType === _constants.ConnectEvents.DONE) {
        this.state.eventHandlers.onDone(eventData);
      } else if (eventType === _constants.ConnectEvents.ERROR) {
        this.state.eventHandlers.onError(eventData);
      } else if (eventType === _constants.ConnectEvents.ROUTE) {
        this.state.eventHandlers.onRoute(eventData);
      } else if (eventType === _constants.ConnectEvents.USER) {
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
    return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
      animationType: 'slide',
      presentationStyle: _reactNative.Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen',
      transparent: false,
      onRequestClose: () => this.close()
    }, /*#__PURE__*/_react.default.createElement(_reactNativeWebview.WebView, {
      ref: ref => this.webViewRef = ref,
      source: {
        uri: this.state.connectUrl
      },
      onMessage: event => this.handleEvent(event),
      onLoad: () => this.startPingingConnect()
    }));
  }

}

exports.FinicityConnect = FinicityConnect;

function parseEventData(eventData) {
  try {
    return typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
  } catch (e) {
    return {};
  }
}
//# sourceMappingURL=index.js.map