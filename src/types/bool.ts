import { UglyType } from './index'

let trueExpr = /^(?:true|T|1|yes|Y)$/i
let falseExpr = /^(?:false|F|0|no|N)$/i

export let bool: UglyType = {
	key: 'bool',
	validate(str: string) {
		return trueExpr.test(str) || falseExpr.test(str)
	},
	parse(str: string) {
		if (trueExpr.test(str)) return true
		if (falseExpr.test(str)) return false
		return undefined
	}
}
