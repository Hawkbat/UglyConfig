import { SchemaField, SchemaType, SchemaTypeKind, SchemaContext, SchemaArrayOpts } from './index'
import { UglyNode, UglyType, UglyOptions } from '../index'
import { int, float, string, bool, void_type } from '../types/index'

export interface Schema {
	fields: SchemaField[]
	types: SchemaType[]
}

export let META_SCHEMA: Schema = {
	fields: [
		{
			key: 'fields',
			type: 'void',
			array: {
				type: 'field'
			}
		},
		{
			key: 'types',
			type: 'void',
			array: {
				type: 'type'
			}
		}
	],
	types: [
		{
			key: 'arrayField',
			kind: SchemaTypeKind.Object,
			type: 'void',
			fields: [
				{
					key: 'type',
					type: 'string',
					required: true
				},
				{
					key: 'min',
					type: 'int'
				},
				{
					key: 'max',
					type: 'int'
				}
			]
		},
		{
			key: 'field',
			kind: SchemaTypeKind.Object,
			type: 'string',
			array: {
				type: 'field'
			},
			fields: [
				{
					key: 'type',
					type: 'string',
					default: 'void'
				},
				{
					key: 'array',
					type: 'arrayField'
				},
				{
					key: 'required',
					type: 'bool'
				},
				{
					key: 'default',
					type: 'string'
				}
			]
		},
		{
			key: 'type',
			kind: SchemaTypeKind.Object,
			type: 'string',
			array: {
				type: 'field'
			},
			fields: [
				{
					key: 'kind',
					type: 'string',
					required: true
				},
				{
					key: 'type',
					type: 'string',
					default: 'void'
				},
				{
					key: 'array',
					type: 'arrayField'
				}
			]
		}
	]
}

export let PRIMITIVE_TYPE_MAP: { [key: string]: UglyType } = {
	bool,
	float,
	int,
	string,
	void: void_type
}

export function applySchema(root: UglyNode, schema: Schema, options?: UglyOptions): SchemaContext {
	let ctx: SchemaContext = { root, schema, types: { ...PRIMITIVE_TYPE_MAP }, errors: [] }
	if (options && options.types) {
		for (let type of options.types) ctx.types[type.key] = type
	}
	for (let type of schema.types) ctx.types[type.key] = type

	let rootType = getRootType(schema)
	typeCheckNode(root, rootType, ctx)

	return ctx
}

export function buildSchema(root: UglyNode): SchemaContext {
	let ctx = applySchema(root, META_SCHEMA)
	let schema: Schema = {
		fields: [],
		types: []
	}
	let fieldsNode = root.fields["fields"]
	if (fieldsNode) {
		for (let child of fieldsNode.elements) {
			schema.fields.push(buildSchemaField(child))
		}
	}
	let typesNode = root.fields["types"]
	if (typesNode) {
		for (let child of typesNode.elements) {
			schema.types.push(buildSchemaType(child))
		}
	}
	ctx.result = schema
	return ctx
}

function buildSchemaField(node: UglyNode): SchemaField {
	return {
		key: string.parse(node.line.value),
		type: node.fields["type"] ? string.parse(node.fields["type"].line.value) : void_type.key,
		array: node.fields["array"] ? buildSchemaArrayOpts(node.fields["array"]) : undefined,
		required: node.fields["required"] ? bool.parse(node.fields["required"].line.value) : false,
		fields: node.elements.length > 0 ? node.elements.map(n => buildSchemaField(n)) : undefined,
		default: node.fields["default"] ? string.parse(node.fields["default"].line.value) : undefined
	}
}

function buildSchemaType(node: UglyNode): SchemaType {
	return {
		key: string.parse(node.line.value),
		kind: string.parse(node.fields["kind"].line.value),
		type: node.fields["type"] ? string.parse(node.fields["type"].line.value) : void_type.key,
		array: node.fields["array"] ? buildSchemaArrayOpts(node.fields["array"]) : undefined,
		fields: node.elements.length > 0 ? node.elements.map(n => buildSchemaField(n)) : undefined
	}
}

function buildSchemaArrayOpts(node: UglyNode): SchemaArrayOpts {
	return {
		type: string.parse(node.fields["type"].line.value),
		min: node.fields["min"] ? int.parse(node.fields["min"].line.value) : undefined,
		max: node.fields["max"] ? int.parse(node.fields["max"].line.value) : undefined
	}
}

function typeCheckNodeSelf(node: UglyNode, type: SchemaType | UglyType, ctx: SchemaContext) {
	if ('parse' in type) {
		primitiveTypeCheck(node, type, ctx)
	} else {
		complexTypeCheck(node, type, ctx)
	}
}

function typeCheckNode(node: UglyNode, type: SchemaType | SchemaField, ctx: SchemaContext) {
	if ('kind' in type) typeCheckNodeSelf(node, type, ctx)
	else node.schema = type
	arrayTypeCheck(node, type, ctx)
	fieldsTypeCheck(node, type, ctx)
	invalidFieldsCheck(node, ctx)
}

function primitiveTypeCheck(node: UglyNode, type: UglyType, ctx: SchemaContext) {
	node.type = type.key
	if (!type.validate(node.line.value)) error('Could not parse value as type "' + type.key + '"', node, ctx)
}

function complexTypeCheck(node: UglyNode, type: SchemaType, ctx: SchemaContext) {
	if (type.kind === SchemaTypeKind.Object) objectTypeCheck(node, type, ctx)
	else if (type.kind === SchemaTypeKind.Tuple) tupleTypeCheck(node, type, ctx)
	else error('Unknown schema type kind "' + type.kind + '"', node, ctx)
}

function objectTypeCheck(node: UglyNode, type: SchemaType, ctx: SchemaContext) {
	let valueType = getType(type.type, ctx)
	if (valueType === undefined) error('No valid schema type "' + type.type + '"', node, ctx)
	else {
		typeCheckNodeSelf(node, valueType, ctx)
	}

	node.type = type.key
}

function tupleTypeCheck(node: UglyNode, type: SchemaType, ctx: SchemaContext) {
	node.type = type.key

	if (type.type !== void_type.key) error('Schema tuple type cannot have a value type', node, ctx)

	if (type.fields) {
		let vals = node.line.value ? node.line.value.split(' ') : []

		for (let i = 0; i < type.fields.length; i++) {
			let field = type.fields[i]

			if (vals.length <= i) {
				if (!field.default || field.required) error('Missing tuple sub-field "' + field.key + '"', node, ctx)
			} else {
				let valueType = getType(field.type, ctx)
				if (valueType === undefined) error('No valid schema type "' + type.type + '"', node, ctx)
				else {
					if ('kind' in valueType) error('Schema tuple sub-field "' + field.key + '" type must be a primitive type', node, ctx)
					else {
						if (!valueType.validate(vals[i])) error('Could not parse sub-field "' + field.key + '" value as type "' + valueType.key + '"', node, ctx)
					}
				}
			}
		}

		if (vals.length > type.fields.length) {
			error('Too many sub-field values; schema type has ' + type.fields.length + ' sub-fields', node, ctx)
		}

	} else {
		error('Schema type "' + type.key + '" must have at least one sub-field', node, ctx)
	}
}

function arrayTypeCheck(node: UglyNode, type: SchemaType | SchemaField, ctx: SchemaContext) {
	if (type.array) {
		if (type.array.min !== undefined && node.elements.length < type.array.min) {
			error('The array must have at least ' + type.array.min + ' elements', node, ctx)
		}
		if (type.array.max !== undefined && node.elements.length > type.array.max) {
			error('The array must have at most ' + type.array.max + ' elements', node, ctx)
		}
		let elementType = getType(type.array.type, ctx)
		if (elementType === undefined) error('No valid schema type "' + type.array.type + '"', node, ctx)
		else {
			for (let element of node.elements) {
				element.type = elementType.key
				if ('kind' in elementType) typeCheckNode(element, elementType, ctx)
				else typeCheckNodeSelf(element, elementType, ctx)
			}
		}
	}
}

function fieldsTypeCheck(node: UglyNode, type: SchemaType | SchemaField, ctx: SchemaContext) {
	if (type.fields) {
		for (let field of type.fields) {
			let child = node.fields[field.key]
			if (child) {
				let fieldType = getType(field.type, ctx)
				if (fieldType === undefined) error('No valid schema type "' + field.type + '"', child, ctx)
				else {
					child.type = fieldType.key
					if ('kind' in fieldType) typeCheckNode(child, fieldType, ctx)
					else typeCheckNodeSelf(child, fieldType, ctx)
					typeCheckNode(child, field, ctx)
				}
			} else if (field.required) {
				error('Missing field "' + field.key + '"', node, ctx)
			}
		}
	}
}

function invalidFieldsCheck(node: UglyNode, ctx: SchemaContext) {
	for (let child of node.elements) {
		if (child.type == '') {
			error('Invalid array element', child, ctx)
		}
	}
	for (let child of Object.values(node.fields)) {
		if (child.type == '') {
			error('Invalid field "' + child.line.key + '"', child, ctx)
		}
	}
}

function getType(type: string, ctx: SchemaContext): UglyType | SchemaType | undefined {
	return ctx.types[type]
}

function getRootType(schema: Schema): SchemaType {
	return {
		key: '',
		kind: SchemaTypeKind.Object,
		type: 'void',
		fields: schema.fields
	}
}

function error(msg: string, node: UglyNode, ctx: SchemaContext) {
	ctx.errors.push({ msg, node })
}
