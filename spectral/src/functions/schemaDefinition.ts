import { IFunctionPaths, IFunctionResult, JSONSchema } from "@stoplight/spectral";

// Recursively compare the target value of the OpenAPI document with an expected value
export default (targetVal: any, { definition }: { definition: SchemaMetadata }, paths: IFunctionPaths): IFunctionResult[] => {
	const path = [...paths.target] as string[]
	const targetSchema = path[path.length-1]

	if (!targetVal) {
		return [
			{
				message: 'Missing required schema object "' + targetSchema + '"',
				path
			}
		]
	}

	return compareSchemas(definition, targetVal, path)
}

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

function compareSchemas(expectedSchema: SchemaMetadata, actualSchema: JSONSchema, path: string[] = []): IFunctionResult[] {
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