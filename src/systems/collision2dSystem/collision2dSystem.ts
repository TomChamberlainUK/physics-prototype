import type Entity from '#/Entity';
import { checkCollision, resolveCollision } from './logic';

export default function collision2dSystem(entities: Entity[]) {
  const filteredEntities = entities.filter(entity => (
    entity.hasComponents(['Collider2d', 'RigidBody2d', 'Transform2d'])
  ));
  for (let i = 0; i < filteredEntities.length; i++) {
    const entityA = filteredEntities[i];
    for (let j = i + 1; j < filteredEntities.length; j++) {
      const entityB = filteredEntities[j];
      if (checkCollision(entityA, entityB)) {
        resolveCollision(entityA, entityB);
      }
    }
  }
}
