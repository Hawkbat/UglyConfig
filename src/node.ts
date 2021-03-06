import { UglyLine, SchemaField } from './index'

export const ARRAY_KEY: string = '-'

export interface UglyNode {
	line: UglyLine
	depth: number
	fields: { [key: string]: UglyNode }
	elements: UglyNode[]
	type: string
	schema?: SchemaField
}