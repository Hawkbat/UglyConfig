"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let trueExpr = /^(?:true|T|1|yes|Y)$/i;
let falseExpr = /^(?:false|F|0|no|N)$/i;
exports.bool = {
    key: 'bool',
    validate(str) {
        return trueExpr.test(str) || falseExpr.test(str);
    },
    parse(str) {
        if (trueExpr.test(str))
            return true;
        if (falseExpr.test(str))
            return false;
        return undefined;
    }
};
