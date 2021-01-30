import { render } from '@ember/test-helpers';
import Model from '@ember-data/model';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | record-meta', function (hooks) {
  setupRenderingTest(hooks);

  test('it gets record meta', async function (assert) {
    const recordMetaService = this.owner.lookup('service:record-meta');
    const storeService = this.owner.lookup('service:store');

    this.owner.register('model:user', Model);

    const user = storeService.createRecord('user', { id: '1' });

    this.set('user', user);

    recordMetaService.setRecordMeta('user', '1', {
      key: 'value',
    });

    await render(hbs`{{get (record-meta this.user) "key"}}`);

    assert.dom().hasText('value');

    recordMetaService.setRecordMeta('user', '1', {
      key: 'new value',
    });

    assert.dom().hasText('new value');
  });
});
