"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.void_type = {
    key: 'void',
    validate(str) {
        return str === '' || str === undefined;
    },
    parse(str) {
        return '';
    }
};
