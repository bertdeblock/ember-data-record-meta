import JSONAPIAdapter from '@ember-data/adapter/json-api'
import Model from '@ember-data/model'
import JSONAPISerializer from '@ember-data/serializer/json-api'
import SerializerMixin from 'ember-data-record-meta/mixins/serializer'
import { setupTest } from 'ember-qunit'
import { module, test } from 'qunit'

const UserSerializer = JSONAPISerializer.extend(SerializerMixin)
const UserModel = Model

module('Unit | Mixin | serializer', function (hooks) {
  setupTest(hooks)

  test('it normalizes record meta from a single response', async function (assert) {
    class UserAdapter extends JSONAPIAdapter {
      ajax () {
        return {
          data: {
            id: '1',
            type: 'users',
            meta: {
              key: 'value'
            }
          }
        }
      }
    }

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    const store = this.owner.lookup('service:store')
    const recordMetaService = this.owner.lookup('service:record-meta')

    await store.findRecord('user', '1')

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value'
    })
  })

  test('it normalizes record meta from an array response', async function (assert) {
    class UserAdapter extends JSONAPIAdapter {
      ajax () {
        return {
          data: [
            {
              id: '1',
              type: 'users',
              meta: {
                key: 'value'
              }
            },
            {
              id: '2',
              type: 'users',
              meta: {
                key: 'value'
              }
            }
          ]
        }
      }
    }

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    const store = this.owner.lookup('service:store')
    const recordMetaService = this.owner.lookup('service:record-meta')

    await store.findAll('user')

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value'
    })

    assert.deepEqual(recordMetaService.getRecordMeta('user', '2'), {
      key: 'value'
    })
  })

  test('it normalizes record meta from included records', async function (assert) {
    class UserAdapter extends JSONAPIAdapter {
      ajax () {
        return {
          data: [],
          included: [
            {
              id: '1',
              type: 'users',
              meta: {
                key: 'value'
              }
            },
            {
              id: '2',
              type: 'users',
              meta: {
                key: 'value'
              }
            }
          ]
        }
      }
    }

    this.owner.register('adapter:user', UserAdapter)
    this.owner.register('serializer:user', UserSerializer)
    this.owner.register('model:user', UserModel)

    const store = this.owner.lookup('service:store')
    const recordMetaService = this.owner.lookup('service:record-meta')

    await store.findAll('user')

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value'
    })

    assert.deepEqual(recordMetaService.getRecordMeta('user', '2'), {
      key: 'value'
    })
  })
})
