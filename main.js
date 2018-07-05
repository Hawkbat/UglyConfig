"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conf = require("./index.js");
console.log(conf.print(conf.normalize(conf.parse(conf.lex(`
  foo      50
 bar 20
  - baz
`)))));
