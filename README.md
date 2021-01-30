# Ember Data Record Meta

Record meta management for Ember applications.

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```shell
ember install ember-data-record-meta
```

## Usage

### Normalizing and Storing Record Meta

Using the `normalizeRecordMeta` method, we can normalize and store record meta on the `record-meta` service so we can access it later on.

`normalizeRecordMeta` accepts the same arguments as `normalize`, but also an additional options object.

If the meta keys returned by the API do not have the desired format, you can specify a `keyTransform` function.

`keyTransform` receives a meta key as its sole argument and should return that same meta key in the desired format.

In the example below, we use the `camelize` util from `@ember/string` to camelize all meta keys returned by the API.

```javascript
// app/serializers/project.js

import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import JsonApiSerializer from '@ember-data/serializer/json-api';

export default class ProjectSerializer extends JsonApiSerializer {
  @service recordMeta;

  normalize() {
    this.recordMeta.normalizeRecordMeta(...arguments, {
      keyTransform: camelize,
    });

    return super.normalize(...arguments);
  }
}
```

### Accessing Record Meta

#### Using the `record-meta` Helper

```handlebars
{{! app/templates/project.hbs }}

{{#let (record-meta this.project) as |projectMeta|}}
  {{#if projectMeta.userCanDelete}}
    <button {{on "click" this.deleteProject}} type="button">
      Delete Project
    </button>
  {{/if}}
{{/let}}
```

#### Using the `record-meta` Service

```javascript
// app/controllers/project.js

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ProjectController extends Controller {
  @service recordMeta;

  get project() {
    return this.model;
  }

  get projectMeta() {
    return this.recordMeta.getRecordMeta('project', this.project.id);
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
