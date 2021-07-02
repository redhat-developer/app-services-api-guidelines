import { IFunctionPaths, IFunctionResult, JSONSchema } from "@stoplight/spectral";
import resolveAllOf from "json-schema-resolve-allof";

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
	const resolvedTargetVal = resolveAllOf(JSON.parse(JSON.stringify(targetVal)))

	const results: IFunctionResult[] = [];

	for (const [endpointPath, pathConfig] of Object.entries(resolvedTargetVal)) {
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

				const schemaDiffResults = compareSchemas(resourceSchema, schema, path)
				results.push(...schemaDiffResults)
			}
		}
	}
	return results
};

type JsonSchemaType = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean' | 'null' | 'any';

interface SchemaMetadata {
	required?: boolean
	type: string
	properties: PropertyMap
}

interface PropertyMetadata {
	type: JsonSchemaType
	required?: boolean
	properties?: PropertyMap
}

type PropertyMap = { [key: string]: PropertyMetadata }

function compareSchemas(expectedSchema: SchemaMetadata, actualSchema: JSONSchema, path?: string[]): IFunctionResult[] {
	const { type, properties, required } = expectedSchema

	const results: IFunctionResult[] = [];

	if (required && (!actualSchema || Object.keys(actualSchema).length === 0)) {
		results.push({
			message: '`schema` object is required and should be non-empty',
			path
		})
	}

	if (actualSchema?.type != type) {
		results.push({
			message: `"type" should be a "${type}", got "${actualSchema.type}"`,
			path: [...path, 'type']
		})
	}
	if (!actualSchema.properties) {
		results.push({
			message: 'missing required "properties" object',
			path: [...path, 'properties']
		})
		return results
	}
	for (const [propertyName, propertyConfig] of Object.entries(properties)) {
		const schemaProperty = Object.keys(actualSchema.properties).find((p => p === propertyName))
		if (!schemaProperty) {
			if (propertyConfig.required) {
				results.push({
					message: `missing required property "${propertyName}"`,
					path: [...path, 'properties']
				})
			}
			continue
		}
		const schemaPropertyConfig: any = actualSchema.properties[schemaProperty]
		if (schemaPropertyConfig?.type !== propertyConfig.type) {
			results.push({
				message: `"type" for "${propertyName}" should be of type "${propertyConfig.type}" but got "${schemaPropertyConfig.type}"`,
				path: [...path, 'properties', propertyName]
			})
		}
	}

	return results
}