#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ConnectReactNativeSdk, NSObject)

RCT_EXTERN_METHOD(checklink:(NSString *)url
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
