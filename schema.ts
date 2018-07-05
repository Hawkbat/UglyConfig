
enum DataType {
	null = 'null',
	int = 'int',
	float = 'float',
	string = 'string',
	bool = 'bool',
	array = 'array',
	object = 'object',
}

enum TestType {
	key = 'exists',
	notKey = 'does not exist',
	type = 'is',
	notType = 'is not',
	value = '=',
	notValue = '!=',
}

interface ConfigTest {
	path: string
	type: TestType
}

interface ConfigRule {
	// The key of the property; tests with the same key overwrite; matches against all items if omitted
	key?: string
	// The data type of the property
	type?: DataType

	// Whether the property must be present on the parent object
	required?: boolean
	// The set of valid string values
	enum?: string[]
	// The maximum value of an int, maximum length of a string, or maximum length of an array
	max?: number
	// The minimum value of an int, minimum length of a string, or minimum length of an array
	min?: number
	// A Regex pattern to validate string values against
	pattern?: string

	// The rules to apply for all child array items
	items?: ConfigRule[]
	// The rules to apply for child properties
	props?: ConfigRule[]

	// Conditions to check for to see if this rule can be applied
	test?: ConfigTest[]
}
