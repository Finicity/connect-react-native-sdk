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
    // expect to call postMessage to inform Connect
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
    const spyIsAvailable = jest
      .spyOn(InAppBrowser, 'isAvailable')
      .mockReturnValue(Promise.resolve(true));
    const spyOpenAuth = jest
      .spyOn(InAppBrowser, 'openAuth')
      .mockImplementation(() => Promise.resolve({type: 'cancel'}));
    const spyCloseAuth = jest
      .spyOn(InAppBrowser, 'closeAuth')
      .mockImplementation(jest.fn());
    instanceOf.openBrowser(instanceOf.state.connectUrl);
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
    spyIsAvailable.mockRestore();
    spyOpenAuth.mockRestore();
    spyCloseAuth.mockRestore();
  });

});