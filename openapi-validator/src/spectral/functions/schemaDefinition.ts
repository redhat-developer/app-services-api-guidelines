import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";
import resolveAllOf from "json-schema-resolve-allof";
import { compareSchemas, SchemaMetadata } from "../schemas/compareSchemas";

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

	const resolvedTargetVal = resolveAllOf(JSON.parse(JSON.stringify(targetVal)))

	return compareSchemas(definition, resolvedTargetVal, path)
}