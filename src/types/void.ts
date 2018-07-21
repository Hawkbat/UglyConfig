import { UglyType } from './index'

export let void_type: UglyType = {
	key: 'void',
	validate(str: string) {
		return str === '' || str === undefined
	},
	parse(str: string) {
		return ''
	}
}
