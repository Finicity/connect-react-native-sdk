# Changelog

### 2.0.0 (February 8, 2024)

- Enhanced the App to App OAuth Flow with the newly added `redirectUrl` parameter in the Connect React Native SDK. This enhancement supports universal links for iOS, app links for Android, and deep links for navigation between mobile apps. For more details on App to App, refer to the [documentation](https://developer.mastercard.com/open-banking-us/documentation/connect/mobile-sdks/).
- The support for the `linkingUri` property in the Connect React Native SDK has been deprecated.

### 1.0.0-rc10 (September 6, 2023)

- Fixed issue in iOS when OAuth popup is closed, dismissing Connect and making the application unresponsive

### 1.0.0-rc9 (August 1, 2023)

- Fixed issue in Android with OAuth popup being dismissed on Android when navigating away from app

### 1.0.0-rc8 (December 8, 2022)

- Fixed dependencies version mismatch
- Remove any references to External sources

### 1.0.0-rc7 (August 3, 2022)

- Mastercard rebranding
- Updated dependencies

### 1.0.0-rc6 (March 22, 2022)

- Updated dependencies and README

### 1.0.0-rc5 (May 11, 2021)

- Moved `react` and `react-native` to `devDependencies` and `peerDependencies`

### 1.0.0-rc4 (April 21, 2021)

- Fixed dependencies
- Ignore /dist
- Remove app.json

### 1.0.0-rc3 (April 15, 2021)

- Added MIT license
- Fixed README example
- Fixed payload in `onDone`, `onCancel` and `onExit` events

### 1.0.0-rc.2 (April 8, 2021)

- Send data object in user and route events
- Added event interfaces

### 1.0.0-rc.1 (April 8, 2021)

- Include /dist for GitHub repo

### 1.0.0-rc.0 (April 3, 2021)

- Initial version