import { RigidBody2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionImpulseResolution2dSystem } from '#/systems';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CollisionImpulseResolution2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new CollisionImpulseResolution2dSystem();
      expect(system).toBeInstanceOf(CollisionImpulseResolution2dSystem);
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    const speed = 5;
  
    let collisionImpulseResolution2dSystem: CollisionImpulseResolution2dSystem;
    let entityA: Entity;
    let entityB: Entity;
    let rigidBodyA: RigidBody2dComponent;
    let rigidBodyB: RigidBody2dComponent;
  
    beforeEach(() => {
      collisionImpulseResolution2dSystem = new CollisionImpulseResolution2dSystem();
      entityA = new Entity();
      entityB = new Entity();
      [entityA, entityB].forEach(entity => {
        entity.addComponent(new RigidBody2dComponent());
      });
      rigidBodyA = entityA.getComponent<RigidBody2dComponent>('RigidBody2d');
      rigidBodyB = entityB.getComponent<RigidBody2dComponent>('RigidBody2d');
    });
  
    it('Should apply an impulse to colliding entities', () => {
      const restitution = 1;
      rigidBodyA.restitution = restitution;
      rigidBodyB.restitution = restitution;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        collisionPairs:[{
          entityA,
          entityB,
          normal: new Vector2d({ x: -1, y: 0 }),
          overlap: 1,
        }]
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: -5, y: 0 }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: 5, y: 0 }));
    });
  
    it('Should not apply an impulse to separating entities', () => {
      const restitution = 1;
      rigidBodyA.restitution = restitution;
      rigidBodyB.restitution = restitution;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        collisionPairs:[{
          entityA,
          entityB,
          normal: new Vector2d({ x: 1, y: 0 }),
          overlap: 1,
        }]
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: 0, y: 0 }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: 0, y: 0 }));
    });
  
    it.todo('Should not apply an impulse to static entities');
  
    it('Should scale applied impulse based on mass', () => {
      rigidBodyA.mass = 10;
      rigidBodyB.mass = 1;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      rigidBodyB.velocity = new Vector2d(0, 0);
  
      const restitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);
      const normal = new Vector2d({ x: -1, y: 0 });
      const relativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);
      const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;
      const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / totalInverseMass;
      const impulse = normal.multiply(impulseMagnitude);
      const expectedImpulseA = impulse.multiply(rigidBodyA.inverseMass);
      const expectedImpulseB = impulse.multiply(-rigidBodyB.inverseMass);
  
      collisionImpulseResolution2dSystem.update([], {
        collisionPairs:[{
          entityA,
          entityB,
          normal,
          overlap: 1,
        }]
      });
  
      expect(rigidBodyA.impulse.x).toBeCloseTo(expectedImpulseA.x);
      expect(rigidBodyA.impulse.y).toBeCloseTo(expectedImpulseA.y);
      expect(rigidBodyB.impulse.x).toBeCloseTo(expectedImpulseB.x);
      expect(rigidBodyB.impulse.y).toBeCloseTo(expectedImpulseB.y);
    });
  
    it('Should scale applied impulse based on restitution', () => {
      const restitution = 0.5;
      rigidBodyA.restitution = restitution;
      rigidBodyB.restitution = restitution;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      rigidBodyB.velocity = new Vector2d(0, 0);
  
      const minRestitution = Math.min(rigidBodyA.restitution, rigidBodyB.restitution);
      const normal = new Vector2d({ x: -1, y: 0 });
      const relativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const velocityAlongNormal = Vector2d.dotProduct(relativeVelocity, normal);
      const totalInverseMass = rigidBodyA.inverseMass + rigidBodyB.inverseMass;
      const impulseMagnitude = -(1 + minRestitution) * velocityAlongNormal / totalInverseMass;
      const impulse = normal.multiply(impulseMagnitude);
      const expectedImpulseA = impulse.multiply(rigidBodyA.inverseMass);
      const expectedImpulseB = impulse.multiply(-rigidBodyB.inverseMass);
  
      collisionImpulseResolution2dSystem.update([], {
        collisionPairs:[{
          entityA,
          entityB,
          normal,
          overlap: 1,
        }]
      });

      expect(rigidBodyA.impulse.x).toBeCloseTo(expectedImpulseA.x);
      expect(rigidBodyA.impulse.y).toBeCloseTo(expectedImpulseA.y);
      expect(rigidBodyB.impulse.x).toBeCloseTo(expectedImpulseB.x);
      expect(rigidBodyB.impulse.y).toBeCloseTo(expectedImpulseB.y);
    });
  });
});
