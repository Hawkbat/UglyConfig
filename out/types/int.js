"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let expr = /^(?:0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][0-1]+|[0-9]+)$/;
exports.int = {
    key: 'int',
    validate(str) {
        return expr.test(str);
    },
    parse(str) {
        let base = 10;
        if (str.startsWith('0x')) {
            base = 16;
            str = str.substr(2);
        }
        else if (str.startsWith('0o')) {
            base = 8;
            str = str.substr(2);
        }
        else if (str.startsWith('0b')) {
            base = 2;
            str = str.substr(2);
        }
        return parseInt(str, base);
    }
};
