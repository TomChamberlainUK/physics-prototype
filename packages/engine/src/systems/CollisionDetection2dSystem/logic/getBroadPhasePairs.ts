import type { Collider2dComponent } from '#/components';
import type Entity from '#/Entity';
import getAABBOverlap from './getAABBOverlap';

export default function getBroadPhasePairs(entities: Entity[]) {
  const candidatePairs: [Entity, Entity][] = [];
  for (let i = 0; i < entities.length; i++) {
    const entityA = entities[i];
    if (!entityA?.hasComponent('Collider2d')) {
      continue;
    }
    for (let j = i + 1; j < entities.length; j++) {
      const entityB = entities[j];
      if (!entityB || !entityB.hasComponent('Collider2d')) {
        continue;
      }
      const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
      const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
      if (!colliderA.aabb || !colliderB.aabb) {
        candidatePairs.push([entityA, entityB]);
        continue;
      }
      const aabbOverlap = getAABBOverlap(colliderA.aabb, colliderB.aabb);
      if (!aabbOverlap) {
        continue;
      }
      candidatePairs.push([entityA, entityB]);
    }
  }
  return candidatePairs;
}
