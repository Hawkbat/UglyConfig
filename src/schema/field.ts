import { SchemaArrayOpts } from './index'

export interface SchemaField {
	key: string
	type: string
	required?: boolean
	default?: string
	array?: SchemaArrayOpts
	fields?: SchemaField[]
}