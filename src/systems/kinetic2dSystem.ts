import type Entity from '#/Entity';
import type { Kinetic2dComponent, Transform2dComponent } from '#/components';

export default function kinetic2dSystem(entities: Entity[]) {
  for (const entity of entities) {
    if (!entity.hasComponent('Transform2d') || !entity.hasComponent('Kinetic2d')) {
      continue;
    }
    const transform = entity.getComponent<Transform2dComponent>('Transform2d');
    const kinetic = entity.getComponent<Kinetic2dComponent>('Kinetic2d');
    transform.position.x += kinetic.velocity.x;
    transform.position.y += kinetic.velocity.y;
  }
}
