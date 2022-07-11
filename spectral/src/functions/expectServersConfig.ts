import { IFunctionResult } from "@stoplight/spectral-core";

export default (targetVal: any, opts: any, context: any ): IFunctionResult[] => {
    if (!targetVal) {
        return [
            {
                message: '"servers" should be defined',
            },
        ]
    }
    if (!Array.isArray(targetVal)) {
        return [
            {
                message: '"servers" config should be an array, got object'
            }
        ]
    }
    const paths = context.path;
    const results: IFunctionResult[] = [];
    const expectedUrls = opts.required
    const missingUrls = [];
    for (const u of expectedUrls) {
        if (!targetVal.find(c => c.url === u)) {
            missingUrls.push(u)
        }
    }
    if (missingUrls.length) {
        return [
            {
                message: `OpenAPI \`servers\` object is missing the following required URLs: ${missingUrls.join(', ')}`,
                path: [...paths, 0]
            }
        ]
    }

    return results
};