import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ProjectController extends Controller {
  @service recordMeta;

  get project() {
    return this.model;
  }

  get projectMeta() {
    return this.recordMeta.getRecordMeta('project', this.project.id);
  }

  deleteProject() {
    alert('Delete Project');
  }
}
