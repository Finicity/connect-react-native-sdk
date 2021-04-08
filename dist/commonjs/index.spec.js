"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _index = require("./index");

var _reactNativeInappbrowserReborn = _interopRequireDefault(require("react-native-inappbrowser-reborn"));

var _constants = require("./constants");

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('FinicityConnect', () => {
  const eventHandlerFns = {
    onCancel: event => {
      console.log('cancel event received', event);
    },
    onDone: event => {
      console.log('done event received', event);
    },
    onError: event => {
      console.log('error event received', event);
    },
    onLoad: event => {
      console.log('loaded event received', event);
    },
    onRoute: event => {
      console.log('route event received', event);
    },
    onUser: event => {
      console.log('user event received', event);
    }
  };
  test('close', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance();

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onCancel = mockFn;
    instanceOf.close();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      code: 100,
      reason: 'exit'
    });
  });
  test('render', () => {
    const mockEvent = {
      test: true
    }; // android

    _reactNative.Platform.OS = 'android';

    let testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    }));

    let instanceOf = testRenderer.getInstance();
    let startPingingConnectMockFn = jest.fn();
    let closeMockFn = jest.fn();
    let handleEventMockFn = jest.fn();
    instanceOf.startPingingConnect = startPingingConnectMockFn;
    instanceOf.close = closeMockFn;
    instanceOf.handleEvent = handleEventMockFn;
    let modal = testRenderer.root.findByType('Modal');
    let webview = testRenderer.root.findByType('RNCWebView');
    webview.props.onLoad();
    expect(modal.props.presentationStyle).toBe('fullScreen');
    expect(startPingingConnectMockFn).toHaveBeenCalled();
    webview.props.onMessage(mockEvent);
    expect(handleEventMockFn).toHaveBeenCalledWith(mockEvent);
    modal.props.onRequestClose();
    expect(closeMockFn).toHaveBeenCalled(); // ios

    _reactNative.Platform.OS = 'ios';
    testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    }));
    instanceOf = testRenderer.getInstance();
    startPingingConnectMockFn = jest.fn();
    closeMockFn = jest.fn();
    handleEventMockFn = jest.fn();
    instanceOf.startPingingConnect = startPingingConnectMockFn;
    instanceOf.close = closeMockFn;
    instanceOf.handleEvent = handleEventMockFn;
    modal = testRenderer.root.findByType('Modal');
    webview = testRenderer.root.findByType('RNCWebView');
    webview.props.onLoad();
    expect(modal.props.presentationStyle).toBe('pageSheet');
    expect(startPingingConnectMockFn).toHaveBeenCalled();
    webview.props.onMessage(mockEvent);
    expect(handleEventMockFn).toHaveBeenCalledWith(mockEvent);
    modal.props.onRequestClose();
    expect(closeMockFn).toHaveBeenCalled();
  });
  test('postMessage', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance();

    const mockFn = jest.fn();
    instanceOf.webViewRef = {
      postMessage: mockFn
    };
    instanceOf.postMessage({
      test: true
    });
    expect(mockFn).toHaveBeenCalledWith(JSON.stringify({
      test: true
    })); // handle null webView

    instanceOf.webViewRef = null;
    spyOn(instanceOf, 'postMessage').and.callThrough();
    expect(instanceOf.postMessage).not.toThrow();
  });
  test('pingConnect', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // expect postMessage to be called to inform Connect of SDK


    const mockFn = jest.fn();
    instanceOf.postMessage = mockFn;
    instanceOf.pingConnect();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.PING,
      sdkVersion: _constants.CONNECT_SDK_VERSION,
      platform: _constants.SDK_PLATFORM
    }); // expect to call stopPingingConnect if webViewRef = null

    const mockFn2 = jest.fn();
    instanceOf.stopPingingConnect = mockFn2;
    instanceOf.webViewRef = null;
    instanceOf.pingConnect();
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
  test('startPingingConnect/stopPingingConnect', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // expect to use set interval timer to post ping message to Connect


    jest.useFakeTimers();
    const mockFn = jest.fn();
    instanceOf.pingConnect = mockFn;
    instanceOf.startPingingConnect();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), _constants.PING_TIMEOUT);
    jest.advanceTimersByTime(_constants.PING_TIMEOUT + 1);
    expect(mockFn).toHaveBeenCalledTimes(1); // Stop pinging Connect

    expect(instanceOf.state.pingingConnect).toEqual(true);
    expect(instanceOf.state.pingIntervalId).not.toEqual(0);
    let intervalId = instanceOf.state.pingIntervalId;
    instanceOf.stopPingingConnect();
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledWith(intervalId);
    expect(instanceOf.state.pingingConnect).toEqual(false);
    expect(instanceOf.state.pingIntervalId).toEqual(0);
  });
  test('openBrowser/dismissBrowser', async () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance();

    const postMessageMockFn = jest.fn();
    instanceOf.postMessage = postMessageMockFn; // Setup spies for InAppBrowser calls

    jest.spyOn(_reactNativeInappbrowserReborn.default, 'isAvailable').mockReturnValue(Promise.resolve(true));
    const spyOpenAuth = jest.spyOn(_reactNativeInappbrowserReborn.default, 'openAuth').mockImplementation(() => Promise.resolve({
      type: 'cancel'
    }));
    const spyCloseAuth = jest.spyOn(_reactNativeInappbrowserReborn.default, 'closeAuth').mockImplementation(jest.fn()); // Open Browser, and from above mock cancel

    await instanceOf.openBrowser(instanceOf.state.connectUrl);
    expect(spyOpenAuth).toHaveBeenCalledTimes(1);
    expect(spyCloseAuth).toHaveBeenCalledTimes(1);
    expect(postMessageMockFn).toHaveBeenCalledTimes(1);
  });
  test('redirect Url', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance();

    const urlRedirectStr = 'https://redirectUrl.com'; // create redirect event

    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.URL,
      url: urlRedirectStr
    }); // mock openBrowser to catch call to openBrowser on redirect

    const mockFn = jest.fn();
    instanceOf.openBrowser = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(urlRedirectStr);
  });
  test('close popup', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create close popup event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.CLOSE_POPUP
    }); // mock dismiss browser to catch call to dismissBrowser, set state to browser displayed.

    const mockFn = jest.fn();
    instanceOf.state.browserDisplayed = true;
    instanceOf.dismissBrowser = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  test('ack', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create ack event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.ACK
    }); // mock stopPingingConnect, and eventHandler loaded to catch calls to these functions

    const mockStopPingFn = jest.fn();
    instanceOf.stopPingingConnect = mockStopPingFn;
    const mockLoadedEventFn = jest.fn();
    instanceOf.state.eventHandlers.onLoad = mockLoadedEventFn;
    instanceOf.handleEvent(event);
    expect(mockStopPingFn).toHaveBeenCalledTimes(1);
    expect(mockLoadedEventFn).toHaveBeenCalledTimes(1);
  });
  test('launch', () => {
    const evHandlers = { ...eventHandlerFns
    };
    delete evHandlers.onLoad;
    delete evHandlers.onRoute;
    delete evHandlers.onUser;

    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: evHandlers,
      linkingUri: "testApp"
    })).getInstance();

    expect(instanceOf.state.connectUrl).toBe('https://finicity.com');
    expect(instanceOf.state.eventHandlers.onLoad).toBeDefined();
    expect(instanceOf.state.eventHandlers.onRoute).toBeDefined();
    expect(instanceOf.state.eventHandlers.onUser).toBeDefined(); // check for empty linkingUri

    instanceOf.launch('https://finicity.com', evHandlers, undefined);
    expect(instanceOf.state.linkingUri).toEqual('');
  });
  test('parseEventData', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // invalid JSON event


    const event = {
      nativeEvent: {
        data: '{0}'
      }
    };
    spyOn(instanceOf, 'handleEvent').and.callThrough();
    expect(instanceOf.handleEvent.bind(instanceOf, event)).not.toThrow(); // valid event

    event.nativeEvent.data = {
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    };
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onCancel = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    }); // valid JSON event

    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    });
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    });
  });
  test('cancel Event', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create cancel event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    }); // mock cancel event callback

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onCancel = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: 'exit'
      }
    });
  });
  test('done Event', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create done event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.DONE,
      data: {
        code: 200,
        reason: 'complete'
      }
    }); // mock done event callback

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onDone = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.DONE,
      data: {
        code: 200,
        reason: 'complete'
      }
    });
  });
  test('error Event', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create error event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.ERROR,
      data: {
        code: 500,
        reason: 'error'
      }
    }); // mock error event callback

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onError = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.ERROR,
      data: {
        code: 500,
        reason: 'error'
      }
    });
  });
  test('route Event', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create route event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.ROUTE,
      data: {
        params: {},
        screen: 'search'
      }
    }); // mock route event callback

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onRoute = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.ROUTE,
      data: {
        params: {},
        screen: 'search'
      }
    });
  });
  test('user Event', () => {
    const instanceOf = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_index.FinicityConnect, {
      connectUrl: "https://finicity.com",
      eventHandlers: eventHandlerFns,
      linkingUri: ""
    })).getInstance(); // create user event


    const event = {
      nativeEvent: {
        data: ''
      }
    };
    event.nativeEvent.data = JSON.stringify({
      type: _constants.ConnectEvents.USER,
      data: {
        action: 'Initialize',
        customerId: '5003205004',
        experience: null,
        partnerId: '2445582695152',
        sessionId: 'c004a06ffc4cccd485df796fba74f1a4b647ab4fee3e691b227db2d6b2c5d9e3',
        timestamp: '1617009241542',
        ttl: '1617016441542',
        type: 'default'
      }
    }); // mock user event callback

    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.onUser = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: _constants.ConnectEvents.USER,
      data: {
        action: 'Initialize',
        customerId: '5003205004',
        experience: null,
        partnerId: '2445582695152',
        sessionId: 'c004a06ffc4cccd485df796fba74f1a4b647ab4fee3e691b227db2d6b2c5d9e3',
        timestamp: '1617009241542',
        ttl: '1617016441542',
        type: 'default'
      }
    });
  });
});
//# sourceMappingURL=index.spec.js.map