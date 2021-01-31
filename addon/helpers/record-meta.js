import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { inject as service } from '@ember/service';
import Model from '@ember-data/model';
import { EVENT } from 'ember-data-record-meta/-private/config';
import { assertMessage } from 'ember-data-record-meta/-private/utils';

export default class RecordMetaHelper extends Helper {
  @service('record-meta') recordMetaService;

  modelName = null;
  recordId = null;

  constructor() {
    super(...arguments);

    addListener(
      this.recordMetaService,
      EVENT.RECORD_META_CHANGED,
      this.recordMetaChangedHandler
    );
  }

  willDestroy() {
    super.willDestroy(...arguments);

    removeListener(
      this.recordMetaService,
      EVENT.RECORD_META_CHANGED,
      this.recordMetaChangedHandler
    );
  }

  compute([record]) {
    assertRecord(record);

    this.cacheRecordProperties(record);

    return this.recordMetaService.getRecordMeta(this.modelName, this.recordId);
  }

  @action
  recordMetaChangedHandler(modelName, recordId) {
    if (modelName === this.modelName && recordId === this.recordId) {
      this.recompute();
    }
  }

  cacheRecordProperties(record) {
    this.modelName = record.constructor.modelName;
    this.recordId = record.id;
  }
}

function assertRecord(record) {
  assert(
    assertMessage(
      `Record must be an instance of "@ember-data/model". "${record}" provided.`
    ),
    record instanceof Model
  );
}
