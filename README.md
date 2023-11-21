# Mastercard Open Banking Connect React Native SDK

## Overview

Mastercard Open Banking Connect React Native SDK provides an easy way for developers to integrate Mastercard Open Banking Connect into their React Native application.

## Installing

### Dependencies

The SDK has the following `peerDependencies`:

- [react-native-inappbrowser-reborn >=3.6](https://www.npmjs.com/package/react-native-inappbrowser-reborn)
- [react-native-webview >=11](https://www.npmjs.com/package/react-native-webview)
- [react >=16.13](https://www.npmjs.com/package/react)
- [react-native >=0.63](https://www.npmjs.com/package/react-native)

**NOTE: make sure to run `pod install` after installing these dependencies**

### NPM

```bash
npm install connect-react-native-sdk
```

### Usage

```tsx
import {
  Connect,
  ConnectEventHandlers,
} from 'connect-react-native-sdk';

const MyConnectComponent = () => {
  const eventHandlers: ConnectEventHandlers = {
    onDone: (event: ConnectDoneEvent) => {},
    onCancel: (event: ConnectCancelEvent) => {},
    onError: (event: ConnectErrorEvent) => {},
    onRoute: (event: ConnectRouteEvent) => {},
    onUser: (event: any) => {},
    onLoad: () => {},
  };
  return (
    <Connect
      connectUrl={'#GENERATED_CONNECT_URL#'}
      eventHandlers={eventHandlers}
      linkingUri={'#UNIVERSAL_LINK#'}
    ></Connect>
  );
};
```

## Connect Event Handlers

| Event Type | Description                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| onLoad     | Called when the Connect web page is loaded and ready to display                                                                         |
| onDone     | Called when the user successfully completes the Connect application                                                                     |
| onCancel   | Called when the user cancels the Connect application                                                                                    |
| onError    | Called when an error occurs while the user is using the Connect                                                                         |
| onRoute    | Called with the user is navigating through the screens of the Connect application                                                       |
| onUser     | Called when a user performs an action. User events provide visibility into what action a user could take within the Connect application |

## Version compatibility

| Version | Compatibility |
| ------- | ------------- |
| 1.x     | React 16+     |
