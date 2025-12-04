import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionImpulseResolution2dSystem } from '#/systems';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CollisionImpulseResolution2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new CollisionImpulseResolution2dSystem();
      expect(system).toBeInstanceOf(CollisionImpulseResolution2dSystem);
      expect(system.name).toBe('CollisionImpulseResolution2dSystem');
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
    let transformA: Transform2dComponent;
    let transformB: Transform2dComponent;

    beforeEach(() => {
      collisionImpulseResolution2dSystem = new CollisionImpulseResolution2dSystem();
      entityA = new Entity();
      entityB = new Entity();
      transformA = new Transform2dComponent();
      transformB = new Transform2dComponent();
      rigidBodyA = new RigidBody2dComponent({
        restitution: 1,
        friction: 0,
      });
      rigidBodyB = new RigidBody2dComponent({
        restitution: 1,
        friction: 0,
      });
      entityA.addComponents([transformA, rigidBodyA]);
      entityB.addComponents([transformB, rigidBodyB]);
    });

    it('Should apply a linear impulse to colliding entities', () => {
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: -1, y: 0 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        }],
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: -5, y: 0 }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: 5, y: 0 }));
    });

    it('Should apply an angular impulse to colliding entities', () => {
      rigidBodyA.inverseMomentOfInertia = 1;
      rigidBodyB.inverseMomentOfInertia = 1;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: -1, y: 0 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 1 })],
          },
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(2.5);
      expect(rigidBodyB.angularImpulse).toBe(-2.5);
    });

    it('Should not apply a linear impulse to separating entities', () => {
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 1, y: 0 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        }],
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: 0, y: 0 }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: 0, y: 0 }));
    });

    it('Should not apply an angular impulse to separating entities', () => {
      rigidBodyA.inverseMomentOfInertia = 1;
      rigidBodyB.inverseMomentOfInertia = 1;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 1, y: 0 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 1 })],
          },
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(0);
      expect(rigidBodyB.angularImpulse).toBe(0);
    });

    it.todo('Should not apply a linear impulse to static entities');

    it.todo('Should not apply an angular impulse to static entities');

    it('Should scale applied linear impulse based on restitution', () => {
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
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal,
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        }],
      });

      expect(rigidBodyA.impulse.x).toBeCloseTo(expectedImpulseA.x);
      expect(rigidBodyA.impulse.y).toBeCloseTo(expectedImpulseA.y);
      expect(rigidBodyB.impulse.x).toBeCloseTo(expectedImpulseB.x);
      expect(rigidBodyB.impulse.y).toBeCloseTo(expectedImpulseB.y);
    });

    it('Should scale applied angular impulse based on restitution', () => {
      const restitution = 0.5;
      rigidBodyA.restitution = restitution;
      rigidBodyB.restitution = restitution;
      rigidBodyA.inverseMomentOfInertia = 1;
      rigidBodyB.inverseMomentOfInertia = 1;
      rigidBodyA.velocity = new Vector2d(speed, 0);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: -1, y: 0 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 1 })],
          },
        }],
      });
      expect(rigidBodyA.angularImpulse).toBeLessThan(2.5);
      expect(rigidBodyB.angularImpulse).toBeGreaterThan(-2.5);
    });

    it('Should apply a linear impulse from friction', () => {
      rigidBodyA.friction = 0.5;
      rigidBodyB.friction = 0.5;
      rigidBodyA.velocity = new Vector2d(speed, speed);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: -1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: 0 })],
          },
        }],
      });
      expect(rigidBodyA.impulse.x).toBe(-2.5);
      expect(rigidBodyA.impulse.y).toBe(-5);
      expect(rigidBodyB.impulse.x).toBe(2.5);
      expect(rigidBodyB.impulse.y).toBe(5);
    });

    it('Should apply an angular impulse from friction', () => {
      rigidBodyA.friction = 0.5;
      rigidBodyB.friction = 0.5;
      rigidBodyA.inverseMomentOfInertia = 1;
      rigidBodyB.inverseMomentOfInertia = 1;
      rigidBodyA.velocity = new Vector2d(speed, speed);
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold: {
            normal: new Vector2d({ x: 0, y: -1 }),
            overlap: 1,
            contactPoints: [new Vector2d({ x: 0, y: -1 })],
          },
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(-2.5);
      expect(rigidBodyB.angularImpulse).toBe(2.5);
    });
  });
});
