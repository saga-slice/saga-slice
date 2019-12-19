"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
exports.rootReducer = function (modules, others) {
    if (others === void 0) { others = {}; }
    var reducers = modules.reduce(function (a, slice) {
        var name = slice.name, reducer = slice.reducer;
        a[name] = reducer;
        return a;
    }, {});
    return redux_1.combineReducers(__assign(__assign({}, reducers), others));
};
