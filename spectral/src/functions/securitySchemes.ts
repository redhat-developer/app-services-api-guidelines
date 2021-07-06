import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";

const expectedBearerObj = {
	scheme: 'bearer',
	bearerFormat: 'JWT',
	type: 'http'
}

export default (targetVal: any, _, paths: IFunctionPaths): IFunctionResult[] => {
	if (!targetVal) {
		return [
			{
				message: 'OpenAPI object `components` should contain a `securitySchemes` object.',
				path: [...paths.target]
			}
		]
	}

	if (!targetVal.Bearer) {
		return [
			{
				message: 'OpenAPI object `components.securitySchemes` should contain a `Bearer` object'
			}
		]
	}

	const bearerObject = targetVal.Bearer;

	const results: IFunctionResult[] = [];
	const rootPath = paths.target !== void 0 ? paths.target : paths.given
	const path = [...rootPath, 'Bearer', 'securitySchemes']

	for (const [key, val] of Object.entries(expectedBearerObj)) {
		if (!bearerObject[key]) {
			results.push({
				message: `Missing expected key "${key}" in Bearer object`,
				path: [...path, key]
			})
		}
		if (bearerObject[key] != val) {
			results.push({
				message: `"${key}" should be "${expectedBearerObj[key]}"`,
				path: [...path, key]
			})
		}
	}

	return results;
}