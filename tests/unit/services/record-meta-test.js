import Model from '@ember-data/model'
import { setupTest } from 'ember-qunit'
import { module, test } from 'qunit'

module('Unit | Service | record-meta', function (hooks) {
  setupTest(hooks)

  test('"setRecordMeta" throws when the provided arguments are invalid', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta')

    this.owner.register('model:user', Model)

    assert.throws(() => {
      recordMetaService.setRecordMeta()
    })

    assert.throws(() => {
      recordMetaService.setRecordMeta('non-existing-model-name')
    })

    assert.throws(() => {
      recordMetaService.setRecordMeta('user')
    })

    assert.throws(() => {
      recordMetaService.setRecordMeta('user', '1')
    })

    recordMetaService.setRecordMeta('user', '1', {})
  })

  test('"getRecordMeta" throws when the provided arguments are invalid', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta')

    this.owner.register('model:user', Model)

    assert.throws(() => {
      recordMetaService.getRecordMeta()
    })

    assert.throws(() => {
      recordMetaService.getRecordMeta('non-existing-model-name')
    })

    assert.throws(() => {
      recordMetaService.getRecordMeta('user')
    })

    recordMetaService.getRecordMeta('user', '1')
  })

  test('it sets/gets record meta', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta')

    this.owner.register('model:user', Model)
    this.owner.register('model:project', Model)

    recordMetaService.setRecordMeta('user', '1', {
      key: 'value'
    })

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value'
    })

    recordMetaService.setRecordMeta('project', '1', {
      key: 'value'
    })

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value'
    })

    assert.deepEqual(recordMetaService.getRecordMeta('project', '1'), {
      key: 'value'
    })
  })
})
