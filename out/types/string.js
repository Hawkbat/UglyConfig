"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = {
    key: 'string',
    validate(str) {
        return true;
    },
    parse(str) {
        if (str[0] == '"' && str[str.length - 1] == '"') {
            str = str.substr(1, str.length - 2);
        }
        return str;
    }
};
