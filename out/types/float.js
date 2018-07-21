"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let expr = /^[\+\-]?[0-9]+(?:\.?[0-9]*)?(?:[eE][+\-]?[0-9]+)$/;
exports.float = {
    key: 'float',
    validate(str) {
        return expr.test(str);
    },
    parse(str) {
        return parseFloat(str);
    }
};
