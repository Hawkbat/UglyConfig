
// UCL: Ugly Configuration Language
// Line-based; one key and data value per line, for Git-friendliness
// Indentation-based grouping; ideally one \t per indentation level but anything works, as long as the character counts work out

let lexExp = /(\s*)(\w+)(?:\s+(\w+))?/

interface Line {
	ind: number
	key: string
	val: string
	arr: Line[]
}

enum DataType {
	null = 'null',
	int = 'int',
	float = 'float',
	string = 'string',
	bool = 'bool'
}

function lex(input: string) {
	let lines = input.split(/\r?\n/g)
	let data: Line[] = []
	for (let line of lines) {
		line = line.replace(/\t/g, '        ')
		let res = lexExp.exec(line)
		if (res) data.push({ ind: res[1].length, key: res[2], val: res[3], arr: [] })
	}
	return data
}

function parse(lines: Line[]) {
	let scopes: Line[] = [{ ind: -1, key: '', val: '', arr: [] }]
	for (let line of lines) {
		let scope = scopes[scopes.length - 1]
		if (line.ind <= scope.ind) scopes.pop()
		scope = scopes[scopes.length - 1]
		scope.arr.push(line)
		scopes.push(line)
	}
	return scopes[0]
}

function print(scope: Line, ind: number = -1): string {
	return [(ind > 0 ? '\t'.repeat(ind) : '') + scope.key + (scope.val ? ' ' + scope.val : ''), ...scope.arr.map(line => print(line, ind + 1))].join('\r\n')
}

console.log(print(parse(lex(`
  foo      50
 bar 20
    baz
`))))