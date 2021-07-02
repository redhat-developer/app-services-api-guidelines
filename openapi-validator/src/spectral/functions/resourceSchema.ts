import { IFunctionPaths, IFunctionResult, JSONSchema } from "@stoplight/spectral";
import mergeAllOf from "../../util/mergeAllOf";
import { compareSchemas, SchemaMetadata } from "../schemas/compareSchemas";

const resourceSchema: SchemaMetadata = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			required: true
		},
		kind: {
			type: 'string',
			required: true
		},
		href: {
			type: 'string',
			required: true
		}
	}
}

const methods = ['get', 'post', 'put', 'delete', 'patch']

// Recursively compare the target value of the OpenAPI document with an expected value
export default async (targetVal: any, _: any, paths: IFunctionPaths): Promise<IFunctionResult[]> => {
	const rootPath = paths.target !== void 0 ? paths.target : paths.given

	const results: IFunctionResult[] = [];

	for (const [endpointPath, pathConfig] of Object.entries(targetVal)) {
		for (const m of methods) {
			const pathMethod = pathConfig[m]
			if (!pathMethod) {
				continue;
			}

			for (const [code, responseConfig] of Object.entries(pathMethod.responses)) {
				if (parseInt(code) > 299) {
					continue
				}

				const path = [...rootPath, endpointPath, m, 'responses', code, 'content', 'application/json', 'schema'] as string[]
				const schema: JSONSchema = (responseConfig as any).content['application/json']?.schema
				const obj = mergeAllOf(schema)
				const schemaDiffResults = compareSchemas(resourceSchema, obj, path)
				results.push(...schemaDiffResults)
			}
		}
	}
	return results
};