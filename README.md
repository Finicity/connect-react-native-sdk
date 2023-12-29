# Connect React Native SDK

## Overview

Mastercard Open Banking Connect React Native SDK provides an easy way for developers to integrate Mastercard Open Banking Connect into their React Native application.


## Compatibility

The Connect React Native SDK supports following android and iOS version.

* Android : Android 5.0 (Lollipop) or later & minSdkVersion 21 or later
* The Connect React Native SDK supports iOS 11 or later.

WARNING:Support for deepLinkUrl parameters is deprecated from Connect React Native SDK version 2.0.0, going forward please use the redirectUrl parameter which supports both universal and deep links. For more information see [Github documentation](https://github.com/Finicity/connect-react-native-sdk/blob/master/README.md)

## Installation

### Dependencies

The Connect React Native SDK has the following `peerDependencies`:

- [react-native-inappbrowser-reborn >=3.6](https://www.npmjs.com/package/react-native-inappbrowser-reborn)
- [react-native-webview >=11](https://www.npmjs.com/package/react-native-webview)
- [react >=16.13](https://www.npmjs.com/package/react)
- [react-native >=0.63](https://www.npmjs.com/package/react-native)


## Step 1 - Add repository to your project

If you application doesn't use `react-native-inappbrowser-reborn` and `react-native-webview` as dependencies. Install using following documentation
1. [react-native-inappbrowser-reborn](https://github.com/proyecto26/react-native-inappbrowser)
2. [react-native-webview](https://github.com/react-native-webview/react-native-webview)

**Note: Recommended versions with which its tested is react-native-inappbrowser-reborn: 3.7.0 and react-native-webview: 13.6.3**

## Step 2 - Add Connect React native sdk 

Using npm

```bash
npm install connect-react-native-sdk
```

Using yarn

```bash
yarn add connect-react-native-sdk
```

**Note: Connect React native sdk only react native versions above 0.64, Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).**

**iOS Platform:**
 CocoaPods on iOS needs this extra step
  `$ cd ios && pod install && cd ..` 

## Step 3 - Update Android application settings

The Connect React Native SDK requires internet access to connect with our servers. As such, you need to add internet permissions to the AndroidManifest.xml file.

```
<uses-permission android:name="android.permission.INTERNET">
```


### Usage

## Supported Props


| Props | Description |
| ------ | ------ |
| `connectUrl` (required) | The SDK loads the Connect URL. |
| `eventHandlers` (required) | A Object implementing the ConnectEventHandlers methods. |
| `redirectUrl` (optional) | App link URL/ Deep link URL to redirect back to your mobile app after completing FI’s OAuth flow. This parameter is only required for App to App. |

See [Generate 2.0 Connect URL APIs](https://developer.mastercard.com/open-banking-us/documentation/connect/generate-2-connect-url-apis/) for `connectUrl` generation

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
      redirectUrl={'#UNIVERSAL_LINK_FOR_APP_TO_APP_AUTHENTICATION#}
    />
  );
};
```

## EventHandler Interface

Throughout Connect’s flow, events about the state of the web application are sent as Json objects to the `eventHandlers` prop.

> **_NOTE:_**  The onUser event handler will not return anything unless you’re specifically targeting Connect.

```ts
export interface ConnectEventHandlers {
  onDone: (event: ConnectDoneEvent) => void;
  onCancel: (event: ConnectCancelEvent) => void;
  onError: (event: ConnectErrorEvent) => void;
  onRoute?: (event: ConnectRouteEvent) => void;
  onUser?: (event: any) => void;
  onLoad?: () => void;
}
```

Callback Events
See [here](https://developer.mastercard.com/open-banking-us/documentation/connect/mobile-sdks/#callback-events) for details on the events via their callback interface.

Note: The onDone, onError, onRoute, and onUser callback functions will have a JSONObject parameter that contains data about the event. Visit [Connect Events](https://developer.mastercard.com/open-banking-us/documentation/connect/connect-2-events/) for information



## App To App Setup

To provide the best app to app authentication experience for your customers, you should send a universal link URL in the redirect URL parameter when using Connect. See [App To App Authentication](https://developer.mastercard.com/open-banking-us/documentation/connect/mobile-sdks/#app-to-app-authentication) for more details.

Before installing the Connect React Native SDK for use with app to app authentication, complete the following

-   Create your domain's redirectUrl (Universal link) (For Android and iOS)
-   Configuring your redirectUrl

### iOS

### Create your domain's redirectUrl

For information on how to create a [Universal Links](https://developer.apple.com/ios/universal-links/) to be used as redirectUrl in your application, see [Apple's Allowing apps and websites to link to your content](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content) for details.


---
**NOTE**
In order to provide the best app to app authentication customer experience, Partners should use a universal link as a redirectUrl.

It is not recommended to create deep links (custom URL schemes) as redirectUrl since they lack the security of Universal Links through the two-way association between your app and your website. A deep link will also trigger an alert on iOS devices that can add friction to the customer experience, requesting permission to redirect back to the Partner's app.

Any application can register custom URL schemes and there is no further validation from iOS. If multiple applications have registered the same custom URL scheme, a different application may be launched each time the URL is opened. To complete OAuth flows, it is important that your application is opened and not any arbitrary application that has registered the same URL scheme.

---


### Android
### Create your domain's redirectUrl
For information on how to create a [App Links](https://developer.android.com/training/app-links#android-app-links) as redirectUrl in your application, see [adding Android App Links](https://developer.android.com/studio/write/app-link-indexing) for details.

---
NOTE:

In order to provide the best app to app authentication customer experience, Partners should use a app link as a redirectUrl.

It is not recommended to create deep links (custom URL schemes) as redirectUrl since they lack the security of App Links through the two-way association between your app and your website.

Any application can register custom URL schemes and there is no further validation from Android. If multiple applications have registered the same custom URL scheme, a different application may be launched each time the URL is opened. To complete OAuth flows, it is important that your application is opened and not any arbitrary application that has registered the same URL scheme.

---


### Configuring your redirectUrl


In order to return control back to your application after a customer completes a FI's OAuth flow, you must specify a `redirectUrl` value, which will be the URL from which Connect will be re-launched for a customer to complete the Connect experience.

Here is an example of a universal link redirectUrl within your code: 

```js
<Connect
      connectUrl={'#GENERATED_CONNECT_URL#'}
      eventHandlers={eventHandlers}
      redirectUrl={'https://yourdomain.com/mastercardConnect'} 
/>
```

For information on how to configure your server see [supporting associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)


## Version compatibility

| Version | Compatibility |
| ------- | ------------- |
| 1.x     | React 16+     |
| 2.x     | React 16+     |