"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printLine(line) {
    return line.key + (line.value ? ' ' + line.value : '');
}
exports.printLine = printLine;
function printNode(node) {
    return ['\t'.repeat(Math.max(0, node.depth)) + printLine(node.line), ...[...Object.values(node.fields), ...node.elements].map(c => printNode(c))].join('\r\n');
}
exports.printNode = printNode;
