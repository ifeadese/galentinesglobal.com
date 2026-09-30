import * as migration_20260930_120444_initial from './20260930_120444_initial';

export const migrations = [
  {
    up: migration_20260930_120444_initial.up,
    down: migration_20260930_120444_initial.down,
    name: '20260930_120444_initial'
  },
];
