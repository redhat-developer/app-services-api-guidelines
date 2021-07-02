import { SchemaMetadata } from "./compareSchemas";

export const errorSchema: SchemaMetadata = {
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