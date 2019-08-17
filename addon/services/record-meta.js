import { getOwner } from '@ember/application'
import { assert } from '@ember/debug'
import { sendEvent } from '@ember/object/events'
import Service from '@ember/service'
import { typeOf } from '@ember/utils'
import { EVENT } from 'ember-data-record-meta/config'

const NO_RECORD_META_FOUND = null

export default class RecordMetaService extends Service {
  /**
   * State
   */

  recordMetaMap = {}

  /**
   * Methods
   */

  setRecordMeta (modelName, recordId, recordMeta) {
    assert(
      assertMessage('The "modelName" argument must be a string.'),
      typeOf(modelName) === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument must be a string.'),
      typeOf(recordId) === 'string'
    )

    assert(
      assertMessage('The "recordMeta" argument must be an object.'),
      typeOf(recordMeta) === 'object'
    )

    this.recordMetaMap = {
      ...this.recordMetaMap,
      [modelName]: {
        ...this.recordMetaMap[modelName],
        [recordId]: recordMeta
      }
    }

    sendEvent(this, EVENT.RECORD_META_CHANGED, [modelName, recordId])
  }

  getRecordMeta (modelName, recordId) {
    assert(
      assertMessage('The "modelName" argument must be a string.'),
      typeOf(modelName) === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument must be a string.'),
      typeOf(recordId) === 'string'
    )

    const recordMeta =
      this.recordMetaMap[modelName] && this.recordMetaMap[modelName][recordId]

    if (recordMeta) {
      return recordMeta
    }

    return NO_RECORD_META_FOUND
  }
}

function assertMessage (message) {
  return `ember-data-record-meta: ${message}`
}
