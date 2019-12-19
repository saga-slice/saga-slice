"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var immer_1 = __importDefault(require("immer"));
var genName = function (name, key) { return name + "/" + key; };
exports.createModule = function (opts) {
    var name = opts.name, initialState = opts.initialState;
    var extractsInitial = {
        actions: {},
        reducers: {}
    };
    var reducerEntries = Object.entries(opts.reducers);
    var extracted = reducerEntries.reduce(function (acc, entry) {
        var key = entry[0], val = entry[1];
        var type = genName(name, key);
        acc.actions[key] = function (payload) { return ({ type: type, payload: payload }); };
        acc.actions[key].type = type;
        acc.actions[key].toString = function () { return type; };
        acc.reducers[type] = val;
        return acc;
    }, extractsInitial);
    var actions = extracted.actions, reducers = extracted.reducers;
    var moduleReducer = function (state, action) {
        if (state === void 0) { state = initialState; }
        var type = action.type, payload = action.payload;
        var reducer = reducers[type];
        if (typeof reducer === 'function') {
            return immer_1.default(state, function (draft) { return reducer(draft, payload); });
        }
        return state;
    };
    var sagas = [];
    if (opts.sagas) {
        var sagasEntries = Object.entries(opts.sagas(actions));
        sagas = sagasEntries.map(function (entry) {
            var type = entry[0], sagaObj = entry[1];
            var saga = sagaObj.saga;
            var taker = sagaObj.taker;
            if (typeof sagaObj === 'function') {
                saga = sagaObj;
                taker = effects_1.takeEvery;
            }
            else {
                taker = taker || effects_1.takeEvery;
            }
            return function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, taker(type, saga)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            };
        });
    }
    return {
        name: name,
        actions: actions,
        sagas: sagas,
        reducer: moduleReducer
    };
};
