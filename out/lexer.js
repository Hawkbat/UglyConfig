"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let lexExp = /(\s*)(\w+|\-)(?:\s+(.*))?\s*/;
function lex(input) {
    let lines = input.split(/\r?\n/g);
    let data = [];
    for (let line of lines) {
        line = line.replace(/\t/g, '        ');
        let res = lexExp.exec(line);
        if (res)
            data.push({ lineNumber: data.length, indent: res[1].length, key: res[2], value: res[3] });
    }
    return data;
}
exports.lex = lex;
