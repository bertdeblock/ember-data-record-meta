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
