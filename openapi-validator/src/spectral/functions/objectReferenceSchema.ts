import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";

const expectedSchema = {
	type: 'object',
	properties: {
		kind: {
			type: 'string'
		},
		page: {
			type: 'integer'
		},
		size: {
			type: 'integer'
		},
		total: {
			type: 'integer'
		}
	}
}

export default (targetVal: any, _, paths: IFunctionPaths): IFunctionResult[] => {
	if (!targetVal.schemas) {
		return [
			{
				message: 'OpenAPI object `components` should contain a `schemas` object.'
			}
		]
	}

	if (!targetVal.schemas.ObjectReference) {
		return [
			{
				message: 'OpenAPI object `components.schemas` should contain a `ObjectReference` object'
			}
		]
	}

	const results: IFunctionResult[] = [];
	const rootPath = paths.target !== void 0 ? paths.target : paths.given

	if (expectedSchema?.type != targetVal?.type) {
		results.push({
			message: `"type" should be "${expectedSchema.type}"`,
			path: [...rootPath, 'type']
		})
	}
	if (typeof targetVal?.properties != 'object') {
		results.push({
			message: `"properties" should be an object type`,
			path: [...rootPath, 'properties']
		})
	}
	const properties = targetVal.properties;
	if (properties?.type != targetVal?.type) {
		results.push({
			message: `"type" should be "${expectedSchema.type}"`,
			path: [...rootPath, 'type']
		})
	}

	return results;
}