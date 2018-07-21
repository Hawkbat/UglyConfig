import { UglyType } from './index'

let expr = /^[\+\-]?[0-9]+(?:\.?[0-9]*)?(?:[eE][+\-]?[0-9]+)$/

export let float: UglyType = {
	key: 'float',
	validate(str: string) {
		return expr.test(str)
	},
	parse(str: string) {
		return parseFloat(str)
	}
}
