import { getOwner } from '@ember/application'
import { assert } from '@ember/debug'
import { sendEvent } from '@ember/object/events'
import Service from '@ember/service'
import { EVENT } from 'ember-data-record-meta/-private/config'

const NO_RECORD_META_FOUND = null

export default class RecordMetaService extends Service {
  recordMetaMap = {}

  setRecordMeta (modelName, recordId, recordMeta) {
    assert(
      assertMessage('The "modelName" argument must be a string.'),
      typeof modelName === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument must be a string or a number.'),
      typeof recordId === 'string' || typeof recordId === 'number'
    )

    assert(
      assertMessage('The "recordMeta" argument must be an object.'),
      typeof recordMeta === 'object'
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
      typeof modelName === 'string'
    )

    assert(
      assertMessage(`No model was found for "${modelName}".`),
      getOwner(this).factoryFor(`model:${modelName}`)
    )

    assert(
      assertMessage('The "recordId" argument must be a string or a number.'),
      typeof recordId === 'string' || typeof recordId === 'number'
    )

    const recordMeta = this.recordMetaMap[modelName]?.[recordId]

    if (recordMeta) {
      return recordMeta
    }

    return NO_RECORD_META_FOUND
  }

  normalizeRecordMeta (modelClass, payload, { keyTransform } = {}) {
    let recordMeta = payload.meta

    if (!recordMeta) {
      return
    }

    if (keyTransform) {
      recordMeta = this.transformRecordMetaKeys(recordMeta, keyTransform)
    }

    const modelName = modelClass.modelName
    const recordId = payload.id

    this.setRecordMeta(modelName, recordId, recordMeta)
  }

  transformRecordMetaKeys (recordMeta, keyTransform) {
    assert(
      assertMessage('"keyTransform" must be a function.'),
      typeof keyTransform === 'function'
    )

    return Object.keys(recordMeta).reduce((recordMetaTransformed, key) => {
      recordMetaTransformed[keyTransform(key)] = recordMeta[key]

      return recordMetaTransformed
    }, {})
  }
}

function assertMessage (message) {
  return `ember-data-record-meta: ${message}`
}
