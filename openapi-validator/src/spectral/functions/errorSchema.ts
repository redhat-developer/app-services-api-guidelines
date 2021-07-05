import { IFunctionPaths, IFunctionResult, JSONSchema } from "@stoplight/spectral";
import resolveAllOf from "json-schema-resolve-allof";
import { compareSchemas, SchemaMetadata } from "../util/compareSchemas";

const errorProperties: SchemaMetadata = {
	type: 'object',
	properties: {
		code: {
			type: 'string',
			required: true
		},
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
		},
		reason: {
			type: 'string',
			required: true
		}
	}
}

// Recursively compare the target value of the OpenAPI document with an expected value
export default async (targetVal: any, _, paths: IFunctionPaths): Promise<IFunctionResult[]> => {
	const rootPath = paths.target !== void 0 ? paths.target : paths.given
	const resolvedTargetVal = resolveAllOf(JSON.parse(JSON.stringify(targetVal)))

	const results: IFunctionResult[] = [];

	const methods = ['get', 'post', 'put', 'patch', 'delete']
	for (const [endpointPath, pathConfig] of Object.entries(resolvedTargetVal)) {
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
				const schemaDiffResults = compareSchemas(errorProperties, schema, path)
				results.push(...schemaDiffResults)
			}
		}
	}
	return results
};

