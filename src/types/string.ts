import { UglyType } from './index'

export let string: UglyType = {
	key: 'string',
	validate(str: string) {
		return true
	},
	parse(str: string) {
		if (str[0] == '"' && str[str.length - 1] == '"') {
			str = str.substr(1, str.length - 2)
		}
		return str
	}
}
