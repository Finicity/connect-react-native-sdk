# Connect React Native SDK

## Overview

Mastercard Open Banking Connect React Native SDK provides an easy way for developers to integrate Mastercard Open Banking Connect into their React Native application.

The Connect React Native SDK can be used with Mastercard Open Banking in the United States and Australia only.

The functionality available with Connect varies slightly between regions. For details of how to integrate Connect using the Connect SDKs see the following:

* United States
  - [The Connect Application](https://developer.mastercard.com/open-banking-us/documentation/connect/)
  - [Integrating with Connect](https://developer.mastercard.com/open-banking-us/documentation/connect/integrating/)
    - [Using the Connect React Native SDK (US)](https://developer.mastercard.com/open-banking-us/documentation/connect/integrating/react-native-sdk/)
* Australia
  - [The Connect Application](https://developer.mastercard.com/open-banking-au/documentation/connect/)
  - [Integrating with Connect](https://developer.mastercard.com/open-banking-au/documentation/connect/integrating-with-connect/)
    - [Using the Connect React Native SDK (Australia)](https://developer.mastercard.com/open-banking-au/documentation/connect/integrating-with-connect/react-sdk/)

Note that this Connect SDK is not suitable for Mastercard Open Banking Europe. 

## Compatibility

The Connect React Native SDK supports following Android and iOS versions.
* Android:
  - Android 5.0 (Lollipop) or later
  - inSdkVersion 21 or later
* iOS:
  - iOS 11 or later

The Connect React Native SDK has the following peerDependencies:

* [react-native-inappbrowser-reborn >=3.6](https://www.npmjs.com/package/react-native-inappbrowser-reborn)
* [react-native-webview >=11](https://www.npmjs.com/package/react-native-webview)
* [react >=16.13](https://www.npmjs.com/package/react)
* [react-native >=0.63](https://www.npmjs.com/package/react-native)

## Sample App
[Github](https://github.com/Mastercard/connect-react-native-sdk/tree/master/ConnectReactNativeDemoApp) contains a sample React Native project that is integrated with the Connect React Native SDK. This sample project is named ConnectReactNativeDemoApp. Ensure that you have the necessary setup for React Native version 0.72 to successfully run and explore this demo application.