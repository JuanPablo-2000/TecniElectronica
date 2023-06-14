"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));
var _moment = _interopRequireDefault(require("moment"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var salidaSchema = new _mongoose["default"].Schema({
  code: {
    type: String
  },
  product: {
    type: String
  },
  quantity: {
    type: Number
  },
  creado: {
    type: String
  }
}, {
  timestamps: {
    createdAt: false,
    updatedAt: false
  },
  versionKey: false
});
salidaSchema.plugin(_mongoosePaginateV["default"]);
var _default = _mongoose["default"].model('salida', salidaSchema);
exports["default"] = _default;