"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var inventarioSchema = new _mongoose["default"].Schema({
  code: {
    type: String
  },
  product: {
    type: String
  },
  stock: {
    type: Number
  },
  precio: {
    type: String
  },
  fecha: {
    type: String
  },
  salida: {
    type: Number
  },
  nota: {
    type: String,
    "default": ""
  }
}, {
  timestamps: {
    createdAt: false,
    updatedAt: false
  },
  versionKey: false
});
inventarioSchema.plugin(_mongoosePaginateV["default"]);
var _default = _mongoose["default"].model('inventario', inventarioSchema);
exports["default"] = _default;