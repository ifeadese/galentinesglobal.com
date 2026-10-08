import * as migration_20261007_231923_initial from './20261007_231923_initial';
import * as migration_20261008_020109_content_model from './20261008_020109_content_model';

export const migrations = [
  {
    up: migration_20261007_231923_initial.up,
    down: migration_20261007_231923_initial.down,
    name: '20261007_231923_initial',
  },
  {
    up: migration_20261008_020109_content_model.up,
    down: migration_20261008_020109_content_model.down,
    name: '20261008_020109_content_model'
  },
];
