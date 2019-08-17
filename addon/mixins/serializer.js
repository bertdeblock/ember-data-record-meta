import Mixin from '@ember/object/mixin'
import { inject as service } from '@ember/service'

export default Mixin.create({
  /**
   * Services
   */

  recordMetaService: service('record-meta'),

  /**
   * Hooks
   */

  normalize () {
    this.normalizeRecordMeta(...arguments)

    return this._super(...arguments)
  },

  normalizeRecordMeta (modelClass, payload) {
    const modelName = modelClass.modelName
    const recordId = payload.id
    const recordMeta = payload.meta

    if (!recordMeta) {
      return
    }

    this.recordMetaService.setRecordMeta(modelName, recordId, recordMeta)
  }
})
