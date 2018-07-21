import { Schema, SchemaError, SchemaType } from './index'
import { UglyType, UglyNode } from '../index'

export interface SchemaContext {
	root: UglyNode
	schema: Schema
	types: { [key: string]: SchemaType | UglyType }
	errors: SchemaError[]
	result?: Schema
}