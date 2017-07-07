"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
var PathReporter_1 = require("./PathReporter");
exports.ThrowReporter = {
    report: function (validation) {
        if (Either_1.isLeft(validation)) {
            throw PathReporter_1.PathReporter.report(validation).join('\n');
        }
    }
};
//# sourceMappingURL=ThrowReporter.js.map