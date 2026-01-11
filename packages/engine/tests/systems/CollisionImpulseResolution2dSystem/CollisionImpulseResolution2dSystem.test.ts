import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { CollisionImpulseResolution2dSystem } from '#/systems';
import * as computeContactImpulseModule from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactImpulse';
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

    let computeContactImpulseSpy: MockInstance<typeof computeContactImpulseModule.default>;

    beforeAll(() => {
      computeContactImpulseSpy = vi.spyOn(computeContactImpulseModule, 'default');
    });

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
      computeContactImpulseSpy.mockClear();
    });

    afterAll(() => {
      computeContactImpulseSpy.mockRestore();
    });

    it('Should compute the contact impulse for each contact point of each collision pair', () => {
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      for (const contactPoint of contactManifold.contactPoints) {
        expect(computeContactImpulseSpy).toHaveBeenCalledWith({
          angularVelocityA: rigidBodyA.angularVelocity,
          angularVelocityB: rigidBodyB.angularVelocity,
          contactPoint,
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
      }
    });

    it('Should apply the averaged normal linear impulse to the rigid bodies', () => {
      const firstValue = 10;
      const secondValue = 20;
      const averagedValue = (firstValue + secondValue) / 2;
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: firstValue, y: firstValue }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: secondValue, y: secondValue }),
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
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: averagedValue, y: averagedValue }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: -averagedValue, y: -averagedValue }));
    });

    it('Should apply the averaged normal angular impulse to the rigid bodies', () => {
      const firstValue = 10;
      const secondValue = 20;
      const averagedValue = (firstValue + secondValue) / 2;
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: firstValue,
        normalAngularImpulseB: firstValue,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: secondValue,
        normalAngularImpulseB: secondValue,
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
      expect(rigidBodyA.angularImpulse).toBe(averagedValue);
      expect(rigidBodyB.angularImpulse).toBe(-averagedValue);
    });

    it('Should apply the averaged tangent linear impulse to the rigid bodies', () => {
      const firstValue = 10;
      const secondValue = 20;
      const averagedValue = (firstValue + secondValue) / 2;
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: firstValue, y: firstValue }),
        tangentAngularImpulseA: 0,
        tangentAngularImpulseB: 0,
      });
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: secondValue, y: secondValue }),
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
      expect(rigidBodyA.impulse).toEqual(new Vector2d({ x: averagedValue, y: averagedValue }));
      expect(rigidBodyB.impulse).toEqual(new Vector2d({ x: -averagedValue, y: -averagedValue }));
    });

    it('Should apply the averaged tangent angular impulse to the rigid bodies', () => {
      const firstValue = 10;
      const secondValue = 20;
      const averagedValue = (firstValue + secondValue) / 2;
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: firstValue,
        tangentAngularImpulseB: firstValue,
      });
      computeContactImpulseSpy.mockReturnValueOnce({
        normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        normalAngularImpulseA: 0,
        normalAngularImpulseB: 0,
        tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
        tangentAngularImpulseA: secondValue,
        tangentAngularImpulseB: secondValue,
      });
      collisionImpulseResolution2dSystem.update([], {
        narrowPhaseCollisionPairs: [{
          entityA,
          entityB,
          contactManifold,
        }],
      });
      expect(rigidBodyA.angularImpulse).toBe(averagedValue);
      expect(rigidBodyB.angularImpulse).toBe(-averagedValue);
    });
  });
});
