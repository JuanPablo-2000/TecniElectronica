"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ROLES = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var ROLES = ["admin", "moderador"];
exports.ROLES = ROLES;
var rolSchema = new _mongoose["default"].Schema({
  name: String
}, {
  versionKey: false
});
var _default = _mongoose["default"].model("Rol", rolSchema);
exports["default"] = _default;