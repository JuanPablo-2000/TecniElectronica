"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _user = require("../controllers/user.controller");
var _authJwt = require("../middlewares/authJwt");
var _verifySignUp = require("../middlewares/verifySignUp");
var router = (0, _express.Router)();
router.post("/", [_authJwt.verifyToken, _authJwt.isAdmin], _user.createUser);
router.get("/:username", _user.getUserByUsername);
var _default = router;
exports["default"] = _default;