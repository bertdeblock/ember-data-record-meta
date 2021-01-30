import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ProjectSerializer extends JSONAPISerializer {
  @service recordMeta;

  normalize() {
    this.recordMeta.normalizeRecordMeta(...arguments, {
      keyTransform: camelize,
    });

    return super.normalize(...arguments);
  }
}
