"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ugl = require("./index");
const fs = require("fs");
let schemaPath = 'examples/example.schema.ugl';
let filePath = 'examples/example.ugl';
let schemaSrc = fs.readFileSync(schemaPath, 'utf8');
let fileSrc = fs.readFileSync(filePath, 'utf8');
let schemaLines = ugl.lex(schemaSrc);
let fileLines = ugl.lex(fileSrc);
let schemaScope = ugl.parse(schemaLines);
let fileScope = ugl.parse(fileLines);
let print = ugl.printNode(fileScope);
let schemaCtx = ugl.buildSchema(schemaScope);
let fileCtx = ugl.applySchema(fileScope, schemaCtx.result);
let json = ugl.toJSON(fileCtx);
console.log(JSON.stringify(json, undefined, 4));
for (let error of schemaCtx.errors)
    console.log(error.msg + '\n    at ' + schemaPath + ':' + (error.node.line.lineNumber + 1) + '\n');
for (let error of fileCtx.errors)
    console.log(error.msg + '\n    at ' + filePath + ':' + (error.node.line.lineNumber + 1) + '\n');
