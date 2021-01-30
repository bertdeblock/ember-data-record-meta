import { camelize } from '@ember/string';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import Model from '@ember-data/model';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

class UserModel extends Model {}
class UserAdapter extends JSONAPIAdapter {
  ajax() {
    return {
      data: [
        {
          id: '1',
          meta: {
            some_key: 'some value',
          },
          type: 'users',
        },
        {
          id: '2',
          meta: {
            some_other_key: 'some other value',
          },
          type: 'users',
        },
      ],
    };
  }
}

module('Unit | Service | record-meta', function (hooks) {
  setupTest(hooks);

  test('"setRecordMeta" throws when the provided arguments are invalid', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta');

    this.owner.register('model:user', Model);

    assert.throws(() => {
      recordMetaService.setRecordMeta();
    });

    assert.throws(() => {
      recordMetaService.setRecordMeta('non-existing-model-name');
    });

    assert.throws(() => {
      recordMetaService.setRecordMeta('user');
    });

    assert.throws(() => {
      recordMetaService.setRecordMeta('user', '1');
    });

    recordMetaService.setRecordMeta('user', '1', {});
  });

  test('"getRecordMeta" throws when the provided arguments are invalid', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta');

    this.owner.register('model:user', Model);

    assert.throws(() => {
      recordMetaService.getRecordMeta();
    });

    assert.throws(() => {
      recordMetaService.getRecordMeta('non-existing-model-name');
    });

    assert.throws(() => {
      recordMetaService.getRecordMeta('user');
    });

    recordMetaService.getRecordMeta('user', '1');
  });

  test('it sets/gets record meta', function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta');

    this.owner.register('model:user', Model);
    this.owner.register('model:project', Model);

    recordMetaService.setRecordMeta('user', '1', {
      key: 'value',
    });

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value',
    });

    recordMetaService.setRecordMeta('project', '1', {
      key: 'value',
    });

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      key: 'value',
    });

    assert.deepEqual(recordMetaService.getRecordMeta('project', '1'), {
      key: 'value',
    });
  });

  test('it normalizes record meta', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    const recordMetaService = this.owner.lookup('service:record-meta');

    class UserSerializer extends JSONAPISerializer {
      normalize() {
        recordMetaService.normalizeRecordMeta(...arguments);

        return super.normalize(...arguments);
      }
    }

    this.owner.register('model:user', UserModel);
    this.owner.register('adapter:user', UserAdapter);
    this.owner.register('serializer:user', UserSerializer);

    await storeService.findAll('user');

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      some_key: 'some value',
    });

    assert.deepEqual(recordMetaService.getRecordMeta('user', '2'), {
      some_other_key: 'some other value',
    });
  });

  test('it normalizes record meta using a "keyTransform" function', async function (assert) {
    const storeService = this.owner.lookup('service:store');
    const recordMetaService = this.owner.lookup('service:record-meta');

    class UserSerializer extends JSONAPISerializer {
      normalize() {
        recordMetaService.normalizeRecordMeta(...arguments, {
          keyTransform: camelize,
        });

        return super.normalize(...arguments);
      }
    }

    this.owner.register('model:user', UserModel);
    this.owner.register('adapter:user', UserAdapter);
    this.owner.register('serializer:user', UserSerializer);

    await storeService.findAll('user');

    assert.deepEqual(recordMetaService.getRecordMeta('user', '1'), {
      someKey: 'some value',
    });

    assert.deepEqual(recordMetaService.getRecordMeta('user', '2'), {
      someOtherKey: 'some other value',
    });
  });
});
