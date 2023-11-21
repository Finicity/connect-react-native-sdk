import Foundation
import UIKit
import SafariServices


@objc(ConnectReactNativeSdk)
class ConnectReactNativeSdk: NSObject {
  @objc(checklink:withResolver:withRejecter:)
  func checklink(url: String, resolve:  @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
    let percentEncodedStrURL = url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
    let urlLink = URL(string: percentEncodedStrURL!)
    
    if #available(iOS 10.0, *) {
      UIApplication.shared.open(urlLink!, options: [UIApplication.OpenExternalURLOptionsKey.universalLinksOnly : true]) { (success) in
          if success {
              resolve(true)
          } else {
              resolve(false)
          }
      }
    } else {
      resolve(false)
    }

  }
}
