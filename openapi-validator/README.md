## RHOAS Spectral Ruleset

An OpenAPI validation CLI following the RHOAS API Guidelines.

### Development

> NOTE: This project uses [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for easier development.

Install dependencies:

```shell
yarn install
```

Build:

```shell
yarn build
```

**Running examples**

Validate OpenAPI files using the uncompiled TypeScript CLI:

```shell
yarn validate-dev ./examples/openapi-valid.yaml
```

### Using

It is recommended to use `npx` to validate your documents to ensure you use the latest validation rules:

```shell
npx @rhoas/openapi-validator validate ./path/to/openapi.yaml
```

### Rules

The RHOAS ruleset extends the Spectral built-in "oas" ruleset (except `operation-tags`, `openapi-tags`). You can see the full list of rules from that ruleset [here](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md)

#### oas3minimum

OpenAPI schemas should be a minimum of v3.

```yaml
openapi: 3.0
```

**Recommended**: Yes
**Severity**: warn

#### servers-config

The `servers` OpenAPI object must be defined and must specify at minimum the following URLs:

```yaml
servers:
- url: https://api.openshift.com
- url: https://api.stage.openshift.com
- url: http://localhost:8000
- url: /
```

**Recommended**: Yes
**Severity**: warn

#### info-license-apache2.0:

The `info.license.name` field must be "Apache 2.0".

```yaml
info:
  license:
    name: 'Apache 2.0'
```

**Recommended**: Yes
**Severity**: warn

#### info-license-apache2.0:

The `info.license.url` field must have the correct link for Apache 2.0.

```yaml
info:
  license:
    url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
```

**Recommended**: Yes
**Severity**: warn

#### invalid-path-regexp

All paths must match the specified regular expression: `/api/([a-z_]*){1,}(/v[0-9]*(alpha|beta)?)(/{?[a-z_]*}?){1,}$"`.

- The first segment must be `/api`
- The second segment can only contain alphabetical characters and underscores "_"
- The third segment must specify the API version. This can be a major version such as `v1` or a channel-version such as `v1beta`, `v1alpha`.
- All following segments must follow `camel_case` and can only contain alphabetical characters.

**Recommended**: Yes
**Severity**: warn

#### invalid-response-media-type

The content type for all responses must be `application/json`.

**Recommended**: Yes
**Severity**: error

#### invalid-error-schema

All error response bodies must match the following schema:

```yaml
type: object
properties:
  id:
    type: string
  kind:
    type: string
  href:
    type: string
  code:
    type: string
  reason:
    type: string
```

**Recommended**: Yes
**Severity**: error

#### invalid-object-resource-schema

All API response bodies must be an `object` with three required properties:

```yaml
type: object
properties:
  id:
    type: string
  kind:
    type: string
  href:
    type: string
```

**Recommended**: Yes
**Severity**: error