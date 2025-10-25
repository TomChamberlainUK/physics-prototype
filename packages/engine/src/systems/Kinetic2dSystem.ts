import type Entity from '#/Entity';
import type { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import System from './System';

export default class Kinetic2dSystem extends System {
  name = 'Kinetic2dSystem';
  type = 'physics';

  update(entities: Entity[], { deltaTime }: Context) {
    if (!deltaTime) return;
    for (const entity of entities) {
      if (!entity.hasComponents(['Transform2d', 'RigidBody2d'])) {
        continue;
      }
      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');
      rigidBody.velocity = rigidBody.velocity.add(rigidBody.impulse);
      rigidBody.impulse = new Vector2d();
      rigidBody.velocity = rigidBody.velocity.add(rigidBody.acceleration.multiply(deltaTime));
      transform.position = transform.position.add(rigidBody.velocity.multiply(deltaTime));
    }
  }
}
