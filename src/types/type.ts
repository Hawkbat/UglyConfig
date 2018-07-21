
export interface UglyType {
	key: string
	validate(str: string): boolean
	parse(str: string): any | undefined
}
