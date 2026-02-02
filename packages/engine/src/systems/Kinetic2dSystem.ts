import type Entity from '#/Entity';
import type { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';
import System from './System';

/**
 * A system that updates the positions of 2D entities based on their rigid body physics.
 */
export default class Kinetic2dSystem extends System {
  name = 'Kinetic2dSystem';
  type = 'physics';

  /**
   * Updates positions of 2D entities based on their rigid body components.
   * @param entities - The entities in the system.
   * @param context - The context containing deltaTime information.
   */
  update(entities: Entity[], { deltaTime }: Context) {
    if (!deltaTime) return;
    for (const entity of entities) {
      if (!entity.hasComponents(['Transform2d', 'RigidBody2d'])) {
        continue;
      }

      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');

      // Update linear motion
      rigidBody.velocity = rigidBody.velocity.add(rigidBody.impulse.multiply(rigidBody.inverseMass));
      rigidBody.impulse = new Vector2d();
      rigidBody.velocity = rigidBody.velocity.add(rigidBody.acceleration.multiply(deltaTime));
      rigidBody.acceleration = new Vector2d();
      transform.position = transform.position.add(rigidBody.velocity.multiply(deltaTime));

      // Update angular motion
      rigidBody.angularVelocity += rigidBody.angularImpulse * (rigidBody.inverseMomentOfInertia ?? 0);
      rigidBody.angularImpulse = 0;
      rigidBody.angularVelocity += rigidBody.angularAcceleration * deltaTime;
      transform.rotation += rigidBody.angularVelocity * deltaTime;
    }
  }
}
