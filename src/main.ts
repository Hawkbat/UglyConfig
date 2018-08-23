import * as ugl from './index'
import * as fs from 'fs'

let schemaPath = 'examples/example.schema.ugl'
let filePath = 'examples/example.ugl'

let schemaSrc = fs.readFileSync(schemaPath, 'utf8')
let fileSrc = fs.readFileSync(filePath, 'utf8')

let schemaLines = ugl.lex(schemaSrc)
let fileLines = ugl.lex(fileSrc)

let schemaScope = ugl.parse(schemaLines)
let fileScope = ugl.parse(fileLines)

let print = ugl.printNode(fileScope)

let options: ugl.UglyOptions = {
	types: [
		{
			key: 'hexColor',
			validate: (str: string) => /^#[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F](?:[0-9A-F][0-9A-F])?$/i.test(str),
			parse: (str: string) => {
				return {
					r: parseInt(str.substr(1, 2), 16),
					g: parseInt(str.substr(3, 2), 16),
					b: parseInt(str.substr(5, 2), 16),
					a: str.length >= 9 ? parseInt(str.substr(7, 2), 16) : 255
				}
			}
		}
	]
}

let schemaCtx = ugl.buildSchema(schemaScope)
let fileCtx = ugl.applySchema(fileScope, schemaCtx.result!, options)

let json = ugl.toJSON(fileCtx)

console.log(print)
console.log(JSON.stringify(json, undefined, 4))

for (let error of schemaCtx.errors) console.log(error.msg + '\n    at ' + schemaPath + ':' + (error.node.line.lineNumber + 1) + '\n')
for (let error of fileCtx.errors) console.log(error.msg + '\n    at ' + filePath + ':' + (error.node.line.lineNumber + 1) + '\n')