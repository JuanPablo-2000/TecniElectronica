"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var salidaCtrl = _interopRequireWildcard(require("../controllers/salida.controller"));
var _authJwt = require("../middlewares/authJwt");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var router = (0, _express.Router)();
router.post("/", [_authJwt.isModerator, _authJwt.verifyToken], salidaCtrl.createSalida);
router.get("/", salidaCtrl.getSalidas);
router.get("/pagination", salidaCtrl.getSalidasPaginations);
router.get("/:search", salidaCtrl.getSearchSalida);
router.get("/inventario/:searchInventario", salidaCtrl.getSearchConsultaInventario);
router.get("/dateCurrent", salidaCtrl.getSearchDateCurrentSalidas);
router.put("/:salidaId", [_authJwt.isModerator, _authJwt.verifyToken], salidaCtrl.updateSalidaById);
router["delete"]("/:salidaId", [_authJwt.isModerator, _authJwt.verifyToken], salidaCtrl.deleteSalidaById);
var _default = router;
exports["default"] = _default;