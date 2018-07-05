
let lexExp = /(\s*)(\w+|\-)(?:\s+(\w+|\-))?/

export interface Line {
	ind: number
	key: string
	val: string
	arr: Line[]
}

export function lex(input: string) {
	let lines = input.split(/\r?\n/g)
	let data: Line[] = []
	for (let line of lines) {
		line = line.replace(/\t/g, '        ')
		let res = lexExp.exec(line)
		if (res) data.push({ ind: res[1].length, key: res[2], val: res[3], arr: [] })
	}
	return data
}

export function parse(lines: Line[]) {
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

export function normalize(scope: Line) {
	for (let line of scope.arr) {
		line.ind = scope.ind + 1
		normalize(line)
	}
	return scope
}

export function print(scope: Line): string {
	return ['\t'.repeat(Math.max(0, scope.ind)) + scope.key + (scope.val ? ' ' + scope.val : ''), ...scope.arr.map(line => print(line))].join('\r\n')
}
