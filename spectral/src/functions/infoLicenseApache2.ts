import { IFunctionResult } from "@stoplight/spectral-core";
import type { JsonPath } from '@stoplight/types';


export default (targetVal: any, _: any, context: any): IFunctionResult[] => {
	let p: JsonPath = ['info']
	if (!targetVal) {
		return [
			{
				message: "OpenAPI `license` object is required.",
				path: p
			}
		]
	}

	const results: IFunctionResult[] = [];
	const expectName = 'Apache 2.0'
	if (context.path[1] != undefined) {
		p = context.path[1];
	}
	if (targetVal?.name != expectName) {
		results.push({
			message: '`name` must be "' + expectName + '"',
			path: p
		})
	}
	const expectUrl = 'https://www.apache.org/licenses/LICENSE-2.0';
	if (targetVal?.url !== expectUrl) {
		results.push({
			message: '`url` must be "' + expectUrl + '" not "' + targetVal?.url + '"',
			path: p
		})
	}

	return results
}