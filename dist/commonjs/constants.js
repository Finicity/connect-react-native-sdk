"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectEvents = exports.PING_TIMEOUT = exports.SDK_PLATFORM = exports.CONNECT_SDK_VERSION = void 0;
const CONNECT_SDK_VERSION = 'PACKAGE_VERSION';
exports.CONNECT_SDK_VERSION = CONNECT_SDK_VERSION;
const SDK_PLATFORM = 'reactNative';
exports.SDK_PLATFORM = SDK_PLATFORM;
const PING_TIMEOUT = 1000;
exports.PING_TIMEOUT = PING_TIMEOUT;
let ConnectEvents;
exports.ConnectEvents = ConnectEvents;

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
})(ConnectEvents || (exports.ConnectEvents = ConnectEvents = {}));
//# sourceMappingURL=constants.js.map