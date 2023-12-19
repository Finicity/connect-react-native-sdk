import { NativeModules } from 'react-native';

NativeModules.ConnectReactNativeSdk = {
  checklink: jest.fn(),
};

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const turboModuleRegistry = jest.requireActual(
    'react-native/Libraries/TurboModule/TurboModuleRegistry'
  );
  return {
    ...turboModuleRegistry,
    getEnforcing: (name) => {
      if (name === 'RNCWebView') {
        return null;
      }
      return turboModuleRegistry.getEnforcing(name);
    },
  };
});

jest.mock('./src/nativeModule', () => {
  return {
    checkLink: jest.fn().mockResolvedValue(false),
    ConnectReactNativeSdk: {
      close: jest.fn(),
      open: jest.fn().mockResolvedValue({
        type: 'close',
      }),
    },
  };
});

jest.mock('react-native-inappbrowser-reborn', () => {
  const InAppBrowser = {
    open: jest.fn().mockResolvedValue({
      type: 'close',
    }),
    close: jest.fn(),
    openAuth: jest.fn(),
    closeAuth: jest.fn(),
    isAvailable: jest.fn(),
  };
  return {
    InAppBrowser,
  };
});
