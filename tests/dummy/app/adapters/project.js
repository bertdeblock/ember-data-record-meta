import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ProjectAdapter extends JSONAPIAdapter {
  ajax() {
    return {
      data: {
        id: '1',
        meta: {
          user_can_delete: true,
        },
        type: 'projects',
      },
    };
  }
}
