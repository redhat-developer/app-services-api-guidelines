import { IFunctionResult } from "@stoplight/spectral";

export default (targetVal: any): IFunctionResult[] => {
    if (!targetVal || !targetVal.length) {
        return
    }

    if (targetVal.startsWith('https') || targetVal.startsWith('http') || targetVal.startsWith('#/')) {
        return;
    } else {
        return [{
            message: 'Only local relative `$ref` or absolute external URL `$ref` is allowed'
        }]
    }
}
