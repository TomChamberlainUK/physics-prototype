import type Entity from '#src/Entity.js';

export type SceneCommand = SpawnEntitySceneCommand | DespawnEntitySceneCommand;

type SpawnEntitySceneCommand = {
  type: 'spawnEntity';
  entity: Entity;
};

type DespawnEntitySceneCommand = {
  type: 'despawnEntity';
  entityId: string;
};
