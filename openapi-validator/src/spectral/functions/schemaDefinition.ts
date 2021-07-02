import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";
import mergeAllOf from "../../util/mergeAllOf";
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

	const obj = mergeAllOf(targetVal)

	return compareSchemas(definition, obj, path)
}