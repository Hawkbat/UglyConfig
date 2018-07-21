import { UglyLine, UglyNode, ARRAY_KEY } from './index'

export function parse(lines: UglyLine[]): UglyNode {
	let scopes: UglyNode[] = [{ line: { lineNumber: -1, indent: -1, key: '', value: '' }, depth: -1, fields: {}, elements: [], type: '', value: undefined }]
	for (let line of lines) {
		let scope = scopes[scopes.length - 1]
		while (line.indent <= scope.line.indent) {
			scopes.pop()
			scope = scopes[scopes.length - 1]
		}
		let node: UglyNode = { line, depth: scope.depth + 1, fields: {}, elements: [], type: '', value: undefined }
		if (node.line.key === ARRAY_KEY) scope.elements.push(node)
		else scope.fields[node.line.key] = node
		scopes.push(node)
	}
	return scopes[0]
}