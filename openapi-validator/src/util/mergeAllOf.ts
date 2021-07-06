import mergeAllOf from 'json-schema-merge-allof'

export default (target: any): any => {
	let obj = JSON.parse(JSON.stringify(target))
	if (obj.allOf) {
		obj = mergeAllOf(obj)
	}
	return obj
}