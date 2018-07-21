import { UglyLine } from './index'

export const ARRAY_KEY: string = '-'

export interface UglyNode {
	line: UglyLine
	depth: number
	//children: UglyNode[]
	fields: { [key: string]: UglyNode }
	elements: UglyNode[]
	type: string
}