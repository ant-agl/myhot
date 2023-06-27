"use strict";

var _DropMenu = _interopRequireDefault(require("./DropMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

new _DropMenu["default"](".widget-chat", {
  classActive: "open",
  selectorsNotClose: [".widget-chat__content"]
});