import { SchemaTypeKind, SchemaArrayOpts, SchemaField } from './index'

export interface SchemaType {
	key: string
	kind: SchemaTypeKind
	type: string
	array?: SchemaArrayOpts | null
	fields?: SchemaField[]
}
