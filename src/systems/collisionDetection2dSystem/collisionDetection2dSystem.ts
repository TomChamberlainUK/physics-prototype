import type Entity from '#/Entity';
import { getCollision } from './logic';
import type { CollisionPair } from '#/types';

export default function collisionDetection2dSystem(entities: Entity[]) {
  const filteredEntities = entities.filter(entity => (
    entity.hasComponents(['Collider2d', 'Transform2d'])
  ));
  const collisionPairs: CollisionPair[] = [];
  for (let i = 0; i < filteredEntities.length; i++) {
    for (let j = i + 1; j < filteredEntities.length; j++) {
      const entityA = filteredEntities[i];
      const entityB = filteredEntities[j];
      const { isColliding, normal, overlap } = getCollision(entityA, entityB);
      if (!isColliding) {
        continue;
      }
      collisionPairs.push({
        entityA,
        entityB,
        normal: normal!,
        overlap: overlap!
      });
    }
  }
  return collisionPairs;
}
