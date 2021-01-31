import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { sendEvent } from '@ember/object/events';
import Service from '@ember/service';
import { EVENT } from 'ember-data-record-meta/-private/config';
import { assertMessage } from 'ember-data-record-meta/-private/utils';

export default class RecordMetaService extends Service {
  recordMetaMap = {};

  setRecordMeta(modelName, recordId, recordMeta) {
    assertModelName(modelName, this);
    assertRecordId(recordId);
    assertRecordMeta(recordMeta);

    this.recordMetaMap = {
      ...this.recordMetaMap,
      [modelName]: {
        ...this.recordMetaMap[modelName],
        [recordId]: recordMeta,
      },
    };

    sendEvent(this, EVENT.RECORD_META_CHANGED, [modelName, recordId]);
  }

  getRecordMeta(modelName, recordId) {
    assertModelName(modelName, this);
    assertRecordId(recordId);

    const recordMeta = this.recordMetaMap[modelName]?.[recordId];

    if (recordMeta) {
      return recordMeta;
    }

    return null;
  }

  normalizeRecordMeta(modelClass, payload, { keyTransform } = {}) {
    let recordMeta = payload.meta;

    if (!recordMeta) {
      return;
    }

    if (keyTransform) {
      recordMeta = transformRecordMetaKeys(recordMeta, keyTransform);
    }

    const modelName = modelClass.modelName;
    const recordId = payload.id;

    this.setRecordMeta(modelName, recordId, recordMeta);
  }
}

function transformRecordMetaKeys(recordMeta, keyTransform) {
  assertKeyTransform(keyTransform);

  return Object.keys(recordMeta).reduce((recordMetaTransformed, key) => {
    recordMetaTransformed[keyTransform(key)] = recordMeta[key];

    return recordMetaTransformed;
  }, {});
}

function assertKeyTransform(keyTransform) {
  assert(
    assertMessage('"keyTransform" must be a function.'),
    typeof keyTransform === 'function'
  );
}

function assertModelName(modelName, service) {
  assert(
    assertMessage(`No model was found named "${modelName}".`),
    getOwner(service).factoryFor(`model:${modelName}`)
  );
}

function assertRecordId(recordId) {
  assert(
    assertMessage('The "recordId" argument must be a string or a number.'),
    typeof recordId === 'string' || typeof recordId === 'number'
  );
}

function assertRecordMeta(recordMeta) {
  assert(
    assertMessage('The "recordMeta" argument must be an object.'),
    typeof recordMeta === 'object'
  );
}
