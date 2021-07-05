import { RuleCollection } from "@stoplight/spectral";

const rules: RuleCollection = {
	// 'operation-tags': 'off',
	// 'openapi-tags': 'off',
	oas3minimum:
	{
		given: '$',
		description: 'OpenAPI version must be >= 3',
		recommended: true,
		severity: 'warn',
		then:
		{
			field: 'openapi',
			function: 'pattern',
			functionOptions: { match: '3.[0-9]?.[0-9]' }
		}
	},
	'servers-config':
	{
		given: '$',
		severity: 'warn',
		recommended: true,
		then:
		{
			function: 'expectServersConfig',
			field: 'servers',
			functionOptions:
			{
				required:
					['https://api.openshift.com',
						'https://api.stage.openshift.com',
						'http://localhost:8000',
						'/']
			}
		}
	},
	'info-license-apache2.0':
	{
		severity: 'warn',
		recommended: true,
		given: '$',
		then:
		{
			function: 'pattern',
			field: 'info.license.name',
			functionOptions: { match: 'Apache 2.0' }
		},
	},
	'info-license-apache2.0-url':
	{
		severity: 'warn',
		recommended: true,
		given: '$',
		then:
		{
			function: 'pattern',
			field: 'info.license.url',
			functionOptions: { match: 'https://www.apache.org/licenses/LICENSE-2.0.html' }
		}
	},
	'invalid-path-regexp':
	{
		given: '$.paths[*]~',
		severity: 'warn',
		description: 'OpenAPI paths must start with `/api/`, followed by a version. All paths must follow camel_case',
		then:
		{
			function: 'pattern',
			functionOptions: { match: '/api/([a-z_]*){1,}(/v[0-9]*(alpha|beta)?)(/{?[a-z_]*}?){1,}$' }
		}
	},
	'invalid-response-media-type':
	{
		given: '$.paths.*.*.responses.*.content',
		description: 'application/json is the only acceptable content type',
		severity: 'error',
		then: { function: 'truthy', field: 'application/json' }
	},
	'invalid-error-schema':
	{
		given: '$.paths',
		severity: 'error',
		then: { function: 'errorSchema' }
	},
	'invalid-object-resource-schema':
	{
		given: '$.paths',
		severity: 'error',
		then: { function: 'resourceSchema' }
	}
}

export default rules;