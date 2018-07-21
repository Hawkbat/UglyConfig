import { UglyLine, UglyNode } from './index'

export function printLine(line: UglyLine): string {
	return line.key + (line.value ? ' ' + line.value : '')
}

export function printNode(node: UglyNode): string {
	return ['\t'.repeat(Math.max(0, node.depth)) + printLine(node.line), ...[...Object.values(node.fields), ...node.elements].map(c => printNode(c))].join('\r\n')
}
