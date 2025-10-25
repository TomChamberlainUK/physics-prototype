import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionPositionCorrection2dSystem } from '#/systems';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CollisionPositionCorrection2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new CollisionPositionCorrection2dSystem();
      expect(system).toBeInstanceOf(CollisionPositionCorrection2dSystem);
      expect(system.name).toBe('CollisionPositionCorrection2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    const radius = 16;

    let collisionPositionCorrection2dSystem: CollisionPositionCorrection2dSystem;
    let entityA: Entity;
    let entityB: Entity;
    let rigidBodyA: RigidBody2dComponent;
    let rigidBodyB: RigidBody2dComponent;
    let transformA: Transform2dComponent;
    let transformB: Transform2dComponent;

    beforeEach(() => {
      collisionPositionCorrection2dSystem = new CollisionPositionCorrection2dSystem();
      entityA = new Entity();
      entityB = new Entity();
      [entityA, entityB].forEach((entity) => {
        entity.addComponents([
          new RigidBody2dComponent(),
          new Transform2dComponent(),
        ]);
      });
      transformA = entityA.getComponent<Transform2dComponent>('Transform2d');
      transformB = entityB.getComponent<Transform2dComponent>('Transform2d');
      rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
      rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');
    });

    it('Should correct the positions of overlapping entities', () => {
      transformB.position = new Vector2d({ x: 1, y: 1 });
      const initialDistanceVector = transformA.position.subtract(transformB.position);
      expect(initialDistanceVector.getLength()).toBeLessThan(radius * 2);
      collisionPositionCorrection2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          normal: initialDistanceVector.getUnit(),
          overlap: radius * 2 - initialDistanceVector.getLength(),
        }],
      });
      const distance = transformA.position.subtract(transformB.position).getLength();
      expect(distance).toBeCloseTo(radius * 2);
    });

    it('Should correct the positions of overlapping entities based on their mass', () => {
      rigidBodyA.inverseMass = 1; // mass = 1
      rigidBodyB.inverseMass = 0.5; // mass = 2
      transformA.position = new Vector2d({ x: 0, y: 0 });
      transformB.position = new Vector2d({ x: 1, y: 0 });

      const initialA = transformA.position;
      const initialB = transformB.position;

      const overlap = 2;
      const normal = new Vector2d({ x: 1, y: 0 });

      collisionPositionCorrection2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          normal,
          overlap,
        }],
      });

      const movedA = transformA.position.subtract(initialA).x;
      const movedB = initialB.subtract(transformB.position).x;

      // A should move twice as much as B (since inverseMass is double)
      expect(movedA).toBeCloseTo(2 * movedB);
    });
  });
});
