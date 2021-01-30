import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProjectRoute extends Route {
  @service store;

  model() {
    return this.store.findRecord('project', '1');
  }
}
