"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function parse(lines) {
    let scopes = [{ line: { lineNumber: -1, indent: -1, key: '', value: '' }, depth: -1, fields: {}, elements: [], type: '', value: undefined }];
    for (let line of lines) {
        let scope = scopes[scopes.length - 1];
        while (line.indent <= scope.line.indent) {
            scopes.pop();
            scope = scopes[scopes.length - 1];
        }
        let node = { line, depth: scope.depth + 1, fields: {}, elements: [], type: '', value: undefined };
        if (node.line.key === index_1.ARRAY_KEY)
            scope.elements.push(node);
        else
            scope.fields[node.line.key] = node;
        scopes.push(node);
    }
    return scopes[0];
}
exports.parse = parse;
