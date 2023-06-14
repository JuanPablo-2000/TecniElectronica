"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSalidaById = exports.getSearchSalida = exports.getSearchDateCurrentSalidas = exports.getSalidasPaginations = exports.getSalidas = exports.deleteSalidaById = exports.createSalida = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _Salida = _interopRequireDefault(require("../models/Salida"));
var _Inventario = _interopRequireDefault(require("../models/Inventario"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var createSalida = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, code, product, quantity, creado, foundInventary, inventary, newSalida, updateFoundInventary, salidaSaved;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, code = _req$body.code, product = _req$body.product, quantity = _req$body.quantity, creado = _req$body.creado; // console.log(code, product, quantity);
          _context.prev = 1;
          _context.next = 4;
          return _Inventario["default"].find({
            code: code.toUpperCase()
          });
        case 4:
          foundInventary = _context.sent;
          console.log(foundInventary[0].stock - quantity);
          inventary = {
            code: foundInventary[0].code.toUpperCase(),
            product: foundInventary[0].product.toUpperCase(),
            stock: foundInventary[0].stock - quantity,
            precio: foundInventary[0].precio,
            fecha: foundInventary[0].fecha,
            salida: foundInventary[0].salida
          };
          newSalida = new _Salida["default"]({
            code: code,
            product: product,
            quantity: quantity,
            creado: creado
          });
          _context.next = 10;
          return _Inventario["default"].updateOne({
            _id: foundInventary[0]._id
          }, {
            $set: inventary
          });
        case 10:
          updateFoundInventary = _context.sent;
          console.log(updateFoundInventary);
          _context.next = 14;
          return newSalida.save();
        case 14:
          salidaSaved = _context.sent;
          res.status(201).json(salidaSaved);
          _context.next = 21;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", res.status(500).json(_context.t0));
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 18]]);
  }));
  return function createSalida(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.createSalida = createSalida;
var updateSalidaById = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var salida, compareSalida, compareRequest, foundInventary, cuadreSalida, inventary, updateSalida, updateFoundInventary;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _Salida["default"].findOne({
            _id: req.params.salidaId
          });
        case 3:
          salida = _context2.sent;
          compareSalida = {
            _id: salida._id,
            code: salida.code,
            product: salida.product,
            quantity: salida.quantity
          };
          compareRequest = {
            _id: req.params.salidaId,
            code: req.body.code,
            product: req.body.product,
            quantity: req.body.quantity
          };
          if (!(JSON.stringify(compareSalida) != JSON.stringify(compareRequest))) {
            _context2.next = 21;
            break;
          }
          _context2.next = 9;
          return _Inventario["default"].findOne({
            code: {
              $regex: req.body.code,
              $options: 'i'
            }
          });
        case 9:
          foundInventary = _context2.sent;
          cuadreSalida = foundInventary.stock + salida.quantity;
          inventary = {
            code: foundInventary.code,
            product: foundInventary.product,
            stock: cuadreSalida - req.body.quantity,
            precio: foundInventary.precio,
            fecha: foundInventary.fecha,
            salida: foundInventary.salida
          };
          _context2.next = 14;
          return _Salida["default"].findByIdAndUpdate(req.params.salidaId, req.body, {
            "new": true
          });
        case 14:
          updateSalida = _context2.sent;
          _context2.next = 17;
          return _Inventario["default"].updateOne({
            _id: foundInventary._id
          }, {
            $set: inventary
          });
        case 17:
          updateFoundInventary = _context2.sent;
          return _context2.abrupt("return", res.status(200).json(updateSalida));
        case 21:
          return _context2.abrupt("return", res.status(500).json('Las salidas son iguales'));
        case 22:
          _context2.next = 27;
          break;
        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json(_context2.t0));
        case 27:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 24]]);
  }));
  return function updateSalidaById(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.updateSalidaById = updateSalidaById;
var deleteSalidaById = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var salidaId, validacion, response;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          salidaId = req.params.salidaId;
          _context3.next = 4;
          return _Salida["default"].findById(salidaId);
        case 4:
          validacion = _context3.sent;
          if (validacion) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(500).json("No se ha encontrado el producto a eliminar"));
        case 9:
          _context3.next = 11;
          return _Salida["default"].findByIdAndRemove({
            _id: salidaId
          });
        case 11:
          response = _context3.sent;
          console.log(response);
          return _context3.abrupt("return", res.status(200).json("Salida borrada correctamente"));
        case 14:
          _context3.next = 19;
          break;
        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json(_context3.t0);
        case 19:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 16]]);
  }));
  return function deleteSalidaById(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.deleteSalidaById = deleteSalidaById;
var getSalidas = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var salidas;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _Salida["default"].find();
        case 3:
          salidas = _context4.sent;
          return _context4.abrupt("return", res.status(200).json(salidas));
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).send(_context4.t0));
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function getSalidas(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.getSalidas = getSalidas;
var getSalidasPaginations = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var queryLimit, querySkip, salidas, count;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          queryLimit = Number(req.query.limit) || 20, querySkip = Number(req.query.skip) || 0;
          _context5.next = 4;
          return _Salida["default"].find().skip(querySkip).limit(queryLimit);
        case 4:
          salidas = _context5.sent;
          _context5.next = 7;
          return _Salida["default"].count();
        case 7:
          count = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            content: salidas,
            total: count
          }));
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.status(500).send(_context5.t0));
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function getSalidasPaginations(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.getSalidasPaginations = getSalidasPaginations;
var getSearchDateCurrentSalidas = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var currentDate, year, month, day, formattedDate, salidasHoy;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          currentDate = new Date();
          year = currentDate.getFullYear();
          month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          day = currentDate.getDate().toString().padStart(2, '0');
          formattedDate = "".concat(year, "-").concat(month, "-").concat(day);
          _context6.next = 8;
          return _Salida["default"].find({
            createdAt: formattedDate
          });
        case 8:
          salidasHoy = _context6.sent;
          return _context6.abrupt("return", res.status(200).json('dsalkfjaflj'));
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).send(_context6.t0));
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return function getSearchDateCurrentSalidas(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
exports.getSearchDateCurrentSalidas = getSearchDateCurrentSalidas;
var getSearchSalida = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var queryLimit, querySkip, search, salidaSearch, count;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          queryLimit = Number(req.query.limit) || 20, querySkip = Number(req.query.skip) || 0;
          search = req.params.search;
          _context7.next = 5;
          return _Salida["default"].find({
            $or: [{
              code: {
                $regex: '.*' + search + '.*',
                $options: 'i'
              }
            }, {
              product: {
                $regex: '.*' + search + '.*',
                $options: 'i'
              }
            }, {
              creado: {
                $regex: search,
                $options: 'i'
              }
            }]
          }).skip(querySkip).limit(queryLimit);
        case 5:
          salidaSearch = _context7.sent;
          _context7.next = 8;
          return _Salida["default"].count();
        case 8:
          count = _context7.sent;
          return _context7.abrupt("return", res.status(200).json({
            cotent: salidaSearch,
            total: count
          }));
        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.status(500).send(_context7.t0));
        case 15:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 12]]);
  }));
  return function getSearchSalida(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
exports.getSearchSalida = getSearchSalida;