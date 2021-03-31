import React from 'react';
import renderer from 'react-test-renderer';
import { ConnectEventHandlers, FinicityConnect } from './index';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {
  ConnectEvents,
  CONNECT_SDK_VERSION,
  SDK_PLATFORM,
  PING_TIMEOUT,
} from './constants';
import waitForExpect from 'wait-for-expect';
import { WebViewMessageEvent } from 'react-native-webview';

describe('FinicityConnect component testing', () => {

  let eventHandlerFns: ConnectEventHandlers = {
    cancel: (event: any) => {
      console.log('cancel event received', event);
    },
    done: (event: any) => {
      console.log('done event received', event);
    },
    error: (event: any) => {
      console.log('error event received', event);
    },
    loaded: (event: any) => {
      console.log('loaded event received', event);
    },
    route: (event: any) => {
      console.log('route event received', event);
    },
    user: (event:any ) => {
      console.log('user event received', event);
    },
  }

  it('test close', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.cancel = mockFn;
    instanceOf.close();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({code: 100, reason: 'exit',})
  });

  it('test pingConnect', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // expect postMessage to be called to inform Connect of SDK
    const mockFn = jest.fn();
    instanceOf.postMessage = mockFn;
    instanceOf.pingConnect();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.PING,
      sdkVersion: CONNECT_SDK_VERSION,
      platform: SDK_PLATFORM,
    })
    // expect to call stopPingingConnect if webViewRef = null
    const mockFn2 = jest.fn();
    instanceOf.stopPingingConnect = mockFn2;
    instanceOf.webViewRef = null;
    instanceOf.pingConnect();
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('test startPingingConnect/stopPingingConnect', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // expect to use set interval timer to post ping message to Connect
    jest.useFakeTimers();
    const mockFn = jest.fn();
    instanceOf.pingConnect = mockFn;
    instanceOf.startPingingConnect();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), PING_TIMEOUT);
    jest.advanceTimersByTime(PING_TIMEOUT+1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    // Stop pinging Connect
    expect(instanceOf.state.pingingConnect).toEqual(true);
    expect(instanceOf.state.pingIntervalId).not.toEqual(0);
    let intervalId = instanceOf.state.pingIntervalId;
    instanceOf.stopPingingConnect();
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledWith(intervalId);
    expect(instanceOf.state.pingingConnect).toEqual(false);
    expect(instanceOf.state.pingIntervalId).toEqual(0);
  });

  it('test openBrowser/dismissBrowser', async () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    const postMessageMockFn = jest.fn();
    instanceOf.postMessage = postMessageMockFn;
    // Setup spies for InAppBrowser calls
    const spyIsAvailable = jest
      .spyOn(InAppBrowser, 'isAvailable')
      .mockReturnValue(Promise.resolve(true));
    const spyOpenAuth = jest
      .spyOn(InAppBrowser, 'openAuth')
      .mockImplementation(() => Promise.resolve({type: 'cancel'}));
    const spyCloseAuth = jest
      .spyOn(InAppBrowser, 'closeAuth')
      .mockImplementation(jest.fn());
    // Open Browser, and from above mock cancel
    instanceOf.openBrowser(instanceOf.state.connectUrl);
    // Wait for spies/mock to be called before exiting test.
    expect(spyIsAvailable).toHaveBeenCalledTimes(1);
    await waitForExpect(() => {
      expect(spyOpenAuth).toHaveBeenCalledTimes(1);
    });
    await waitForExpect(() => {
      expect(spyCloseAuth).toHaveBeenCalledTimes(1);
    });
    await waitForExpect(() => {
      expect(postMessageMockFn).toHaveBeenCalledTimes(1);
    });
    // Restore original InAppBrowser methods
    spyIsAvailable.mockRestore();
    spyOpenAuth.mockRestore();
    spyCloseAuth.mockRestore();
  });

  it('test redirect Url', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    const urlRedirectStr = "https://redirectUrl.com"
    // create redirect event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.URL,
      url: urlRedirectStr,
    });
    // mock openBrowser to catch call to openBrowser on redirect
    const mockFn = jest.fn();
    instanceOf.openBrowser = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(urlRedirectStr);
  });

  it('test close popup', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create close popup event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.CLOSE_POPUP
    });
    // mock dismiss browser to catch call to dismissBrowser, set state to browser displayed.
    const mockFn = jest.fn();
    instanceOf.state.browserDisplayed = true;
    instanceOf.dismissBrowser = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('test ack', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create ack event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.ACK,
    });
    // mock stopPingingConnect, and eventHandler loaded to catch calls to these functions
    const mockStopPingFn = jest.fn();
    instanceOf.stopPingingConnect = mockStopPingFn;
    const mockLoadedEventFn = jest.fn();
    instanceOf.state.eventHandlers.loaded = mockLoadedEventFn;
    instanceOf.handleEvent(event);
    expect(mockStopPingFn).toHaveBeenCalledTimes(1);
    expect(mockLoadedEventFn).toHaveBeenCalledTimes(1);
  });

  it('test cancel Event', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create cancel event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: "exit",
      }
    });
    // mock cancel event callback
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.cancel = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.CANCEL,
      data: {
        code: 100,
        reason: "exit",
      }});
  });

  it('test done Event', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create done event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.DONE,
      data: {
        code: 200,
        reason: "complete"
      }
    });
    // mock done event callback
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.done = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.DONE,
      data: {
        code: 200,
        reason: "complete",
      }
    });
  });

  it('test error Event', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create error event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.ERROR,
      data: {
        code: 500,
        reason: "error"
      }
    });
    // mock error event callback
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.error = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.ERROR,
      data: {
        code: 500,
        reason: "error"
      }
    });
  });

  it('test route Event', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create route event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.ROUTE,
      "data": {
        "params": {},
        "screen": "search"
      }
    });
    // mock route event callback
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.route = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.ROUTE,
      "data": {
        "params": {},
        "screen": "search"
      }
    });
  });

  it('test user Event', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    // create user event
    const event = {
      nativeEvent: {
        data: ""
      }
    } as WebViewMessageEvent;
    event.nativeEvent.data = JSON.stringify({
      type: ConnectEvents.USER,
      "data": {
        "action": "Initialize",
        "customerId": "5003205004",
        "experience": null,
        "partnerId": "2445582695152",
        "sessionId": "c004a06ffc4cccd485df796fba74f1a4b647ab4fee3e691b227db2d6b2c5d9e3",
        "timestamp": "1617009241542",
        "ttl": "1617016441542",
        "type": "default"
      }
    });
    // mock user event callback
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.user = mockFn;
    instanceOf.handleEvent(event);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({
      type: ConnectEvents.USER,
      "data": {
        "action": "Initialize",
        "customerId": "5003205004",
        "experience": null,
        "partnerId": "2445582695152",
        "sessionId": "c004a06ffc4cccd485df796fba74f1a4b647ab4fee3e691b227db2d6b2c5d9e3",
        "timestamp": "1617009241542",
        "ttl": "1617016441542",
        "type": "default"
      }
    });
  });

});