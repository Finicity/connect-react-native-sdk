import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'connect-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const ConnectReactNativeSdk = NativeModules.ConnectReactNativeSdk
  ? NativeModules.ConnectReactNativeSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default function checkLink(url: string): Promise<boolean> {
  return ConnectReactNativeSdk.checklink(url);
}
