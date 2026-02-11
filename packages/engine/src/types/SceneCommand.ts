import type Entity from '#/Entity';

export type SceneCommand = SpawnEntitySceneCommand | DespawnEntitySceneCommand;

type SpawnEntitySceneCommand = {
  type: 'spawnEntity';
  entity: Entity;
};

type DespawnEntitySceneCommand = {
  type: 'despawnEntity';
  entityId: string;
};
