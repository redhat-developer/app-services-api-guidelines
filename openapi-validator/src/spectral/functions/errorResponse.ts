import { IFunctionPaths, IFunctionResult, JSONSchema } from "@stoplight/spectral";
import mergeAllOf from "../../util/mergeAllOf";
import { compareSchemas } from "../schemas/compareSchemas";
import { errorSchema } from "../schemas/errorSchema";

// Recursively compare the target value of the OpenAPI document with an expected value
export default async (targetVal: any, _, paths: IFunctionPaths): Promise<IFunctionResult[]> => {
	const rootPath = paths.target !== void 0 ? paths.target : paths.given
	const obj = mergeAllOf(targetVal)

	const results: IFunctionResult[] = [];

	const methods = ['get', 'post', 'put', 'patch', 'delete']
	for (const [endpointPath, pathConfig] of Object.entries(obj)) {
		for (const m of methods) {
			const pathMethod = pathConfig[m]
			if (!pathMethod) {
				continue;
			}
			for (const [code, responseConfig] of Object.entries(pathMethod.responses)) {
				const parsedCode = parseInt(code);
				if (parsedCode < 300) {
					continue
				}

				const path = [...rootPath, endpointPath, m, 'responses', code, 'content', 'application/json', 'schema'] as string[]
				const schema: JSONSchema = (responseConfig as any).content['application/json'].schema
				const schemaDiffResults = compareSchemas(errorSchema, schema, path)
				results.push(...schemaDiffResults)
			}
		}
	}
	return results
};

