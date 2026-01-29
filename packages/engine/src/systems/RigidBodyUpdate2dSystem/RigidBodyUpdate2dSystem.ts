import type { Collider2dComponent, RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import System from '../System';
import { getBoxMomentOfInertia, getCircleMomentOfInertia } from './logic';

/**
 * A system that updates rigid bodies' moments of inertia based on their colliders.
 */
export default class RigidBodyUpdate2dSystem extends System {
  name = 'RigidBodyUpdate2dSystem';
  type = 'physics';

  /**
   * Updates the rigid bodies' moments of inertia based on their colliders.
   * @param entities - The entities to update.
   */
  update(entities: Entity[]): void {
    for (const entity of entities) {
      if (!entity.hasComponents(['Collider2d', 'RigidBody2d'])) {
        continue;
      }

      const collider = entity.getComponent<Collider2dComponent>('Collider2d');
      const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');

      let momentOfInertia: number;

      switch (collider.shape.type) {
        case 'box':
          momentOfInertia = getBoxMomentOfInertia({
            mass: rigidBody.mass,
            width: collider.shape.width,
            height: collider.shape.height,
          });
          break;
        case 'circle':
          momentOfInertia = getCircleMomentOfInertia({
            mass: rigidBody.mass,
            radius: collider.shape.radius,
          });
          break;
        default:
          momentOfInertia = 0;
      }

      rigidBody.momentOfInertia = momentOfInertia;
    }
  }
}
