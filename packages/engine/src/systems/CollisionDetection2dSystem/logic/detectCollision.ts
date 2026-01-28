import type { Collider2dComponent, Transform2dComponent } from '#/components';
import type { Collision } from '#/types';
import detectBoxBoxCollision from './detectBoxBoxCollision';
import detectBoxCircleCollision from './detectBoxCircleCollision';
import detectCircleCircleCollision from './detectCircleCircleCollision';

/**
 * Properties required to detect a collision.
 */
type Properties = {
  /** Collider component of circle A */
  colliderA: Collider2dComponent;
  /** Collider component of circle B */
  colliderB: Collider2dComponent;
  /** Transform component of circle A */
  transformA: Transform2dComponent;
  /** Transform component of circle B */
  transformB: Transform2dComponent;
};

/**
 * Detects a collision between two entities based on their collider shapes.
 * @param properties - An object containing the collider and transform components of the two entities, see {@link Properties}.
 * @returns An object containing whether a collision occurred, its normal, the overlap distance, and contact points, see {@link Collision}.
 */
export default function detectCollision({
  colliderA,
  colliderB,
  transformA,
  transformB,
}: Properties): Collision {
  switch (colliderA.shape.type) {
    case 'box':
      switch (colliderB.shape.type) {
        case 'box':
          return detectBoxBoxCollision({
            colliderA,
            colliderB,
            transformA,
            transformB,
          });
        case 'circle':
          return detectBoxCircleCollision({
            colliderA,
            colliderB,
            transformA,
            transformB,
          });
        default:
          return {
            isColliding: false,
          };
      }
    case 'circle':
      switch (colliderB.shape.type) {
        case 'circle':
          return detectCircleCircleCollision({
            colliderA,
            colliderB,
            transformA,
            transformB,
          });
        case 'box':
          return detectBoxCircleCollision({
            colliderA,
            colliderB,
            transformA,
            transformB,
          });
        default:
          return {
            isColliding: false,
          };
      }
  }
}
