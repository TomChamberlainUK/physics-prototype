import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import type { CollisionPair } from './collisionDetection2dSystem/types';

export default function collisionPositionCorrection2dSystem(collisionPairs: CollisionPair[]) {
  const filteredCollisionPairs = collisionPairs.filter(({ entityA, entityB }) => (
    entityA.hasComponents(['RigidBody2d', 'Transform2d']) && entityB.hasComponents(['RigidBody2d', 'Transform2d'])
  ));
  for (const { entityA, entityB, overlap, normal } of filteredCollisionPairs) {
    const transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
    const transformB = entityB.getComponent<Transform2dComponent>('Transform2d');
    const rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
    const rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');

    const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;

    if (totalInverseMass === 0) return; // Both static

    const correction = normal.multiply(overlap / totalInverseMass);

    transformA.position = transformA.position.add(correction.multiply(rigidBodyA.inverseMass));
    transformB.position = transformB.position.subtract(correction.multiply(rigidBodyB.inverseMass));
  }
}
