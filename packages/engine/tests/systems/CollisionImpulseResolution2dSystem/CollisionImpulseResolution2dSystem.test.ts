import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionImpulseResolution2dSystem } from '#/systems';
import * as computeContactManifoldImpulseModule from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactManifoldImpulse';
import type { ContactManifold } from '#/types';

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
    let collisionImpulseResolution2dSystem: CollisionImpulseResolution2dSystem;
    let entityA: Entity;
    let entityB: Entity;
    let rigidBodyA: RigidBody2dComponent;
    let rigidBodyB: RigidBody2dComponent;
    let transformA: Transform2dComponent;
    let transformB: Transform2dComponent;
    let contactManifold: ContactManifold;

    let computeContactManifoldImpulseSpy: MockInstance<typeof computeContactManifoldImpulseModule.default>;

    beforeAll(() => {
      computeContactManifoldImpulseSpy = vi.spyOn(computeContactManifoldImpulseModule, 'default');
      collisionImpulseResolution2dSystem = new CollisionImpulseResolution2dSystem();
    });

    beforeEach(() => {
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
      rigidBodyA.inverseMomentOfInertia = 1;
      rigidBodyB.inverseMomentOfInertia = 1;
      entityA.addComponents([transformA, rigidBodyA]);
      entityB.addComponents([transformB, rigidBodyB]);
      contactManifold = {
        normal: new Vector2d({ x: 0, y: 1 }),
        contactPoints: [
          new Vector2d({ x: 1, y: 1 }),
          new Vector2d({ x: -1, y: 1 }),
        ],
        overlap: 0.5,
      };
    });

    afterEach(() => {
      computeContactManifoldImpulseSpy.mockClear();
    });

    afterAll(() => {
      computeContactManifoldImpulseSpy.mockRestore();
    });

    it('Should compute the contact manifold impulse', () => {
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(computeContactManifoldImpulseSpy).toHaveBeenCalledWith({
        angularVelocityA: rigidBodyA.angularVelocity,
        angularVelocityB: rigidBodyB.angularVelocity,
        contactPoints: contactManifold.contactPoints,
        frictionA: rigidBodyA.friction,
        frictionB: rigidBodyB.friction,
        inverseMassA: rigidBodyA.inverseMass,
        inverseMassB: rigidBodyB.inverseMass,
        inverseMomentOfInertiaA: rigidBodyA.inverseMomentOfInertia,
        inverseMomentOfInertiaB: rigidBodyB.inverseMomentOfInertia,
        normal: contactManifold.normal,
        positionA: transformA.position,
        positionB: transformB.position,
        restitutionA: rigidBodyA.restitution,
        restitutionB: rigidBodyB.restitution,
        velocityA: rigidBodyA.velocity,
        velocityB: rigidBodyB.velocity,
      });
    });

    it('Should apply the normal linear impulse to the rigid bodies', () => {
      const value = 10;
      computeContactManifoldImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: value, y: value }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: value, y: value }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: -value, y: -value }));
    });

    it('Should apply the normal angular impulse to the rigid bodies', () => {
      const value = 10;
      computeContactManifoldImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: value,
        normalAngularImpulseB: value,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(value);
      expect(rigidBodyB.angularImpulse).toBe(-value);
    });

    it('Should apply the tangent linear impulse to the rigid bodies', () => {
      const value = 10;
      computeContactManifoldImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: value, y: value }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: value, y: value }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: -value, y: -value }));
    });

    it('Should apply the tangent angular impulse to the rigid bodies', () => {
      const value = 10;
      computeContactManifoldImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: value,
        tangentAngularImpulseB: value,
      });
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(value);
      expect(rigidBodyB.angularImpulse).toBe(-value);
    });
  });
});
