"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _auth = require("../controllers/auth.controller");
var _verifySignUp = require("../middlewares/verifySignUp");
var router = (0, _express.Router)();
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});
router.post("/signup", _auth.signup);
router.post("/signin", _auth.signin);
var _default = router;
exports["default"] = _default;