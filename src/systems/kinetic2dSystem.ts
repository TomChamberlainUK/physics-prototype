import type Entity from '#/Entity';
import type { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';

export default function kinetic2dSystem(entities: Entity[]) {
  for (const entity of entities) {
    if (!entity.hasComponent('Transform2d') || !entity.hasComponent('RigidBody2d')) {
      continue;
    }
    const transform = entity.getComponent<Transform2dComponent>('Transform2d');
    const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');
    rigidBody.velocity = rigidBody.velocity.add(rigidBody.impulse);
    rigidBody.impulse = new Vector2d();
    rigidBody.velocity = rigidBody.velocity.add(rigidBody.acceleration);
    transform.position = transform.position.add(rigidBody.velocity);
  }
}
