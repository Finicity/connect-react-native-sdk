package com.mastercard.openbanking.connect.reactnativesdk;

public class ChromeTabsDismissedEvent {
  public final String message;
  public final String resultType;
  public final Boolean isError;

  public ChromeTabsDismissedEvent(String message, String resultType, Boolean isError) {
    this.message = message;
    this.resultType = resultType;
    this.isError = isError;
  }
}
