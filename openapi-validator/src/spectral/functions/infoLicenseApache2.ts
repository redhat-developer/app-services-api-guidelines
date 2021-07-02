import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";

export default (targetVal: any, opts: any, paths: IFunctionPaths): IFunctionResult[] => {
	const path = paths.target;
	if (!targetVal) {
		return [
			{
				message: "OpenAPI `license` object is required",
				path: path,
			}
		]
	}
	const results: IFunctionResult[] = [];
	const expectName = 'Apache 2.0'
	if (targetVal?.name != expectName) {
		results.push({
			message: '`name` must be "' + expectName + '"',
			path: [...path, 'license']
		})
	}	
	const expectUrl = 'https://www.apache.org/licenses/LICENSE-2.0.html'
	if (targetVal?.url != expectUrl) {
		results.push({
			message: '`url` must be "' + expectUrl + '"',
			path: [...path, 'license']
		})
	}																	

	return results
}