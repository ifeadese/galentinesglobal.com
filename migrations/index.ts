import * as migration_20261007_231923_initial from './20261007_231923_initial';

export const migrations = [
  {
    up: migration_20261007_231923_initial.up,
    down: migration_20261007_231923_initial.down,
    name: '20261007_231923_initial'
  },
];
