import Helper from '@ember/component/helper'
import { action } from '@ember/object'
import { addListener, removeListener } from '@ember/object/events'
import { inject as service } from '@ember/service'
import { EVENT } from 'ember-data-record-meta/-private/config'

export default class RecordMetaHelper extends Helper {
  @service('record-meta') recordMetaService

  modelName = null
  recordId = null

  constructor () {
    super(...arguments)

    addListener(
      this.recordMetaService,
      EVENT.RECORD_META_CHANGED,
      this.recordMetaChangedHandler
    )
  }

  willDestroy () {
    super.willDestroy(...arguments)

    removeListener(
      this.recordMetaService,
      EVENT.RECORD_META_CHANGED,
      this.recordMetaChangedHandler
    )
  }

  compute ([record]) {
    this.cacheRecordProperties(record)

    return this.recordMetaService.getRecordMeta(this.modelName, this.recordId)
  }

  @action
  recordMetaChangedHandler (modelName, recordId) {
    if (modelName === this.modelName && recordId === this.recordId) {
      this.recompute()
    }
  }

  cacheRecordProperties (record) {
    this.modelName = record.constructor.modelName
    this.recordId = record.id
  }
}
