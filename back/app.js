"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
var _entrada = _interopRequireDefault(require("./routes/entrada.routes"));
var _salida = _interopRequireDefault(require("./routes/salida.routes"));
var _inventario = _interopRequireDefault(require("./routes/inventario.routes"));
var _auth = _interopRequireDefault(require("./routes/auth.routes"));
var _user = _interopRequireDefault(require("./routes/user.routes"));
var _rol = _interopRequireDefault(require("./routes/rol.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use((0, _cors["default"])());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use("/inventario", _inventario["default"]);
app.use("/entradas", _entrada["default"]);
app.use("/salida", _salida["default"]);
app.use("/auth", _auth["default"]);
app.use("/user", _user["default"]);
app.use("/rol", _rol["default"]);

// Side Server

app.use(_express["default"]["static"](_path["default"].resolve(__dirname, "tecni-electronica", "dist")));
app.get("/", function (req, res) {
  res.sendFile(_path["default"].resolve(__dirname, "tecni-electronica", "dist", "index.html"));
});
var _default = app;
exports["default"] = _default;