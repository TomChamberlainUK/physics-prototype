import type { Collider2dComponent, RigidBody2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import { Vector2d } from '#/maths';

export default function resolveCollision(entityA: Entity, entityB: Entity) {
  const colliderA = entityA.getComponent<Collider2dComponent>('Collider2d');
  const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
  const rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
  const colliderB = entityB.getComponent<Collider2dComponent>('Collider2d');
  const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');
  const rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');

  // Calculate collision normal and overlap
  const difference = transformA.position.subtract(transformB.position);
  const distance = difference.getLength();
  const totalRadius = colliderA.shape.radius + colliderB.shape.radius;
  const overlap = totalRadius - distance;

  if (distance === 0) return; // Prevent division by zero

  // Move circles apart (positional correction)
  const collisionNormal = difference.getUnit();
  const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;
  if (totalInverseMass === 0) return; // Both static

  const correction = collisionNormal.multiply(overlap / totalInverseMass);
  transformA.position = transformA.position.add(correction.multiply(rigidBodyA.inverseMass));
  transformB.position = transformB.position.subtract(correction.multiply(rigidBodyB.inverseMass));

  // Calculate relative velocity
  const relativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
  const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, collisionNormal);

  if (velocityAlongNormal > 0) return; // Already separating

  // Calculate restitution (bounciness)
  const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);

  // Calculate impulse scalar
  const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / totalInverseMass;
  const impulse = collisionNormal.multiply(impulseMagnitude);

  // Apply impulse to velocities
  rigidBodyA.velocity = rigidBodyA.velocity.add(impulse.multiply(rigidBodyA.inverseMass));
  rigidBodyB.velocity = rigidBodyB.velocity.subtract(impulse.multiply(rigidBodyB.inverseMass));
}