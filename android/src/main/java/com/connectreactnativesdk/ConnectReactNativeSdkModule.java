package com.connectreactnativesdk;

import android.app.Activity;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.browser.customtabs.CustomTabsIntent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = ConnectReactNativeSdkModule.NAME)
public class ConnectReactNativeSdkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "ConnectReactNativeSdk";

  public ConnectReactNativeSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void checklink(String url, Promise promise) {
    Activity activity= getCurrentActivity();
    CustomTabsIntent intent = new CustomTabsIntent.Builder()
      .build();
    intent.launchUrl(activity, Uri.parse(url));
    promise.resolve(true);
  }
}
