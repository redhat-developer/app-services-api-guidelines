# RHOAS Spectral Ruleset

A custom ruleset for [Spectral](https://stoplight.io/open-source/spectral/) following the RHOAS API Guidelines.

## Using

> [npm](https://docs.npmjs.com/) is required to use Spectral.

To use this Spectral ruleset add the following to your `.spectral.yaml`:

```yaml
extends: '@rhoas/spectral-ruleset'
```

Alternatively you need to create new ruleset

`
echo "extends: '@rhoas/spectral-ruleset'" > .spectral.yaml
`

Run the Spectral CLI:

```shell
npm install -g @stoplight/spectral@5.9.0
spectral lint ./path/to/openapi.yaml
```

## Rules

The RHOAS ruleset extends the Spectral built-in "oas" ruleset (except `operation-tags`, `openapi-tags`). You can see the full list of rules from that ruleset [here](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md)

### rhoas-oas3minimum

OpenAPI schemas should be a minimum of v3.

```yaml
openapi: 3.0
```

**Recommended**: Yes

**Severity**: warning

### rhoas-servers-config

The `servers` OpenAPI object must be defined and must specify at minimum the following URLs:

```yaml
servers:
- url: https://api.openshift.com
- url: https://api.stage.openshift.com
- url: http://localhost:8000
- url: /
```

**Recommended**: Yes

**Severity**: warning

### rhoas-info-license-apache2.0:

The `info.license.name` field must be "Apache 2.0".

```yaml
info:
  license:
    name: 'Apache 2.0'
```

**Recommended**: Yes
**Severity**: warning

### rhoas-info-license-apache2.0-url:

The `info.license.url` field must have the correct link for Apache 2.0.

```yaml
info:
  license:
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
```

**Recommended**: Yes

**Severity**: warning

### rhoas-path-regexp

All paths must match the specified regular expression: `\/api\/([a-z_]*){1,}(\/v[0-9]*(alpha|beta)?)(\/{?[a-z_]*}?){0,}$`.

- The first segment must be `/api`
- The second segment can only contain alphabetical characters and underscores "_"
- The third segment must specify the API version. This can be a major version such as `v1` or a channel-version such as `v1beta`, `v1alpha`.
- All following segments must follow `camel_case` and can only contain alphabetical characters.

**Recommended**: Yes
**Severity**: warning

### rhoas-response-media-type

The content type for all responses must be `application/json`.

**Recommended**: Yes

**Severity**: error

### rhoas-error-response

All error response bodies must reference `#/components/Schemas/Error`

**Recommended**: Yes

**Severity**: error

### rhoas-object-resource-schema

All API response bodies must be an `object` with three required properties:

```yaml
type: object
required: [id, kind, href]
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

### rhoas-schema-name-camel-case

All JSON schema objects defined in `components.schemas` must follow `CamelCase`.

**Recommended**: Yes

**Severity**: warning
### rhoas-schema-properties-snake-case

All JSON schema properties defined must follow `camel_case`.

**Recommended**: Yes

**Severity**: error

### rhoas-error-schema

`components.schema` MUST have a valid `Error` object.

```yaml
Error:
  type: object
  required: [id, kind, href, code, reason]
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

**Severity**: warning

### rhoas-object-schema

`components.schema` MUST have a valid `ObjectReference` object.

```yaml
ObjectReference:
  type: object
  required: [id, kind, href]
  properties:
    id:
      type: string
    kind:
      type: string
    href:
      type: string
```

**Recommended**: Yes

**Severity**: warning

### rhoas-list-schema

`components.schema` MUST have a valid `List` object.

```yaml
List:
  required:
    - kind
    - page
    - size
    - total
    - items
  type: object
  properties:
    items:
      type: array
    kind:
      type: string
    page:
      type: integer
    size:
      type: integer
    total:
      type: integer
```

**Recommended**: Yes

**Severity**: warning

### rhoas-external-$ref

`$ref` values cannot be a relative path to an external file. Please use the absolute URL or convert it to an internal `$ref`.

**Recommended**: Yes

**Severity**: error

## Development

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

Validate OpenAPI files using the uncompiled ruleset:

```shell
yarn build
yarn spectral-lint ./examples/openapi-valid.yaml
```
