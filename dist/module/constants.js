export const CONNECT_SDK_VERSION = 'PACKAGE_VERSION';
export const SDK_PLATFORM = 'reactNative';
export const PING_TIMEOUT = 1000;
export let ConnectEvents;

(function (ConnectEvents) {
  ConnectEvents["ACK"] = "ack";
  ConnectEvents["CLOSE_POPUP"] = "closePopup";
  ConnectEvents["PING"] = "ping";
  ConnectEvents["URL"] = "url";
  ConnectEvents["CANCEL"] = "cancel";
  ConnectEvents["DONE"] = "done";
  ConnectEvents["ERROR"] = "error";
  ConnectEvents["LOADED"] = "loaded";
  ConnectEvents["ROUTE"] = "route";
  ConnectEvents["SUCCESS"] = "success";
  ConnectEvents["USER"] = "user";
})(ConnectEvents || (ConnectEvents = {}));
//# sourceMappingURL=constants.js.map