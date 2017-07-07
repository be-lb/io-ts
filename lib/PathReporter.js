"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
function stringify(value) {
    return typeof value === 'function' ? index_1.getFunctionName(value) : JSON.stringify(value);
}
function getContextPath(context) {
    return context.map(function (_a) {
        var key = _a.key, type = _a.type;
        return key + ": " + type.name;
    }).join('/');
}
function getMessage(value, context) {
    return "Invalid value " + stringify(value) + " supplied to " + getContextPath(context);
}
function failure(es) {
    return es.map(function (e) { return getMessage(e.value, e.context); });
}
exports.failure = failure;
function success() {
    return ['No errors!'];
}
exports.success = success;
exports.PathReporter = {
    report: function (validation) { return validation.fold(failure, success); }
};
//# sourceMappingURL=PathReporter.js.map