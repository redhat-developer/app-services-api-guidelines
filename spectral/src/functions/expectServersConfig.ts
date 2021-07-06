import { IFunctionPaths, IFunctionResult } from "@stoplight/spectral";

export default (targetVal: any, opts: any, paths: IFunctionPaths): IFunctionResult[] => {
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
    const rootPath = paths.target !== void 0 ? paths.target : paths.given
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
                path: [...rootPath, 0]
            }
        ]
    }

    return results
};