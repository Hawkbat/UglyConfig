import { UglyLine } from './index'

let lexExp = /(\s*)(\w+|\-)(?:\s+(.*))?\s*/

export function lex(input: string): UglyLine[] {
	let lines = input.split(/\r?\n/g)
	let data: UglyLine[] = []
	for (let line of lines) {
		line = line.replace(/\t/g, '        ')
		let res = lexExp.exec(line)
		if (res) data.push({ lineNumber: data.length, indent: res[1].length, key: res[2], value: res[3] })
	}
	return data
}