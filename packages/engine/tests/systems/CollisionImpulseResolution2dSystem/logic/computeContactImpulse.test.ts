import { beforeEach, describe, expect, it } from 'vitest';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import { Vector2d } from '#/maths';
import { computeContactImpulse } from '#/systems/CollisionImpulseResolution2dSystem/logic';

describe('computeContactImpulse', () => {
  let contactPoint: Vector2d;
  let normal: Vector2d;
  let rigidBodyA: RigidBody2dComponent;
  let rigidBodyB: RigidBody2dComponent;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;

  beforeEach(() => {
    contactPoint = new Vector2d({ x: 0, y: -1 });
    normal = new Vector2d({ x: -1, y: 0 });
    rigidBodyA = new RigidBody2dComponent({
      restitution: 0,
      friction: 0.5,
      mass: 1,
      velocity: new Vector2d({ x: 5, y: 0 }),
      angularVelocity: 0,
    });
    rigidBodyA.inverseMomentOfInertia = 1;
    rigidBodyB = new RigidBody2dComponent({
      restitution: 0,
      friction: 0.5,
      mass: 1,
      velocity: new Vector2d({ x: 0, y: 0 }),
      angularVelocity: 0,
    });
    rigidBodyB.inverseMomentOfInertia = 1;
    transformA = new Transform2dComponent({
      position: new Vector2d({ x: -1, y: 0 }),
      rotation: 0,
    });
    transformB = new Transform2dComponent({
      position: new Vector2d({ x: 1, y: 0 }),
      rotation: 0,
    });
  });

  describe('Directional Correctness', () => {
    it('Should return a normal linear impulse along the contact normal', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse } = result;

      const dotProduct = Vector2d.dotProduct(normalLinearImpulse, normal);
      expect(dotProduct).toBeGreaterThan(0);
    });

    it('Should return a tangent linear impulse perpindicular to the contact normal', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      const dotProduct = Vector2d.dotProduct(tangentLinearImpulse, normal);
      expect(dotProduct).toBeCloseTo(0);
    });

    it('Should return angular impulses matching the torque direction', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const leverArmA = contactPoint.subtract(transformA.position);
      const leverArmB = contactPoint.subtract(transformB.position);
      const normalTorqueArmA = Vector2d.crossProduct(leverArmA, normal);
      const normalTorqueArmB = Vector2d.crossProduct(leverArmB, normal);

      const { normalAngularImpulseA, normalAngularImpulseB } = result;

      expect(Math.sign(normalAngularImpulseA)).toBe(Math.sign(normalTorqueArmA));
      expect(Math.sign(normalAngularImpulseB)).toBe(Math.sign(normalTorqueArmB));
    });
  });

  describe('Zero-impulse conditions', () => {
    it('Should return null when bodies are moving apart', () => {
      normal = new Vector2d({ x: 1, y: 0 });
      rigidBodyA.velocity = new Vector2d({ x: 1, y: 0 });
      rigidBodyB.velocity = new Vector2d({ x: 0, y: 0 });

      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      expect(result).toBeNull();
    });

    it('Should return a tangent linear impulse of zero when there is no friction', () => {
      rigidBodyA.friction = 0;
      rigidBodyB.friction = 0;

      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      expect(tangentLinearImpulse.getMagnitude()).toBeCloseTo(0);
    });

    it('Should return angular impulses of zero when the contact point is at the center of mass', () => {
      contactPoint = new Vector2d({ x: 0, y: 0 });
      transformA.position = new Vector2d({ x: 0, y: 0 });
      transformB.position = new Vector2d({ x: 0, y: 0 });
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const {
        normalAngularImpulseA,
        normalAngularImpulseB,
        tangentAngularImpulseA,
        tangentAngularImpulseB,
      } = result;

      expect(normalAngularImpulseA).toBeCloseTo(0);
      expect(normalAngularImpulseB).toBeCloseTo(0);
      expect(tangentAngularImpulseA).toBeCloseTo(0);
      expect(tangentAngularImpulseB).toBeCloseTo(0);
    });
  });

  describe('Conservation-style invariants', () => {
    it('Should not increase normal relative velocity after applying impulse', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse } = result;

      const impulseVelocityChangeA = normalLinearImpulse.multiply(rigidBodyA.inverseMass);
      const impulseVelocityChangeB = normalLinearImpulse.multiply(-rigidBodyB.inverseMass);

      const newVelocityA = rigidBodyA.velocity.add(impulseVelocityChangeA);
      const newVelocityB = rigidBodyB.velocity.add(impulseVelocityChangeB);
      const previousRelativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const newRelativeVelocity = newVelocityA.subtract(newVelocityB);

      const previousNormalRelativeVelocity = Vector2d.dotProduct(previousRelativeVelocity, normal);
      const newNormalRelativeVelocity = Vector2d.dotProduct(newRelativeVelocity, normal);

      expect(Math.abs(newNormalRelativeVelocity)).toBeLessThanOrEqual(Math.abs(previousNormalRelativeVelocity));
    });

    it('Should apply friction opposing tangetial motion', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      const tangent = new Vector2d({
        x: -normal.y,
        y: normal.x,
      });
      const relativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const tangentRelativeVelocity = Vector2d.dotProduct(relativeVelocity, tangent);
      const tangentImpulseDirection = Vector2d.dotProduct(tangentLinearImpulse, tangent);

      expect(tangentImpulseDirection * tangentRelativeVelocity).toBeLessThanOrEqual(0);
    });

    it('Should clamp friction impulse based on normal impulse and friction coefficients', () => {
      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse, tangentLinearImpulse } = result;

      const normalImpulseMagnitude = normalLinearImpulse.getMagnitude();
      const tangentImpulseMagnitude = tangentLinearImpulse.getMagnitude();

      const coefficientOfFriction = Math.sqrt(rigidBodyA.friction * rigidBodyB.friction);
      const maxFrictionImpulse = normalImpulseMagnitude * coefficientOfFriction;

      expect(tangentImpulseMagnitude).toBeLessThanOrEqual(maxFrictionImpulse);
    });
  });

  describe('Symmetry and equivalence', () => {
    it('Should mirror impulses when swapping bodies', () => {
      const resultAB = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!resultAB) {
        throw new Error('Expected a contact impulse to be computed for A-B');
      }

      const resultBA = computeContactImpulse({
        contactPoint,
        normal: normal.multiply(-1),
        rigidBodyA: rigidBodyB,
        rigidBodyB: rigidBodyA,
        transformA: transformB,
        transformB: transformA,
      });

      if (!resultBA) {
        throw new Error('Expected a contact impulse to be computed for B-A');
      }

      expect(resultAB.normalLinearImpulse.x).toBeCloseTo(-resultBA.normalLinearImpulse.x);
      expect(resultAB.normalLinearImpulse.y).toBeCloseTo(-resultBA.normalLinearImpulse.y);
      expect(resultAB.normalAngularImpulseA).toBeCloseTo(-resultBA.normalAngularImpulseB);
      expect(resultAB.normalAngularImpulseB).toBeCloseTo(-resultBA.normalAngularImpulseA);
      expect(resultAB.tangentLinearImpulse.x).toBeCloseTo(-resultBA.tangentLinearImpulse.x);
      expect(resultAB.tangentLinearImpulse.y).toBeCloseTo(-resultBA.tangentLinearImpulse.y);
      expect(resultAB.tangentAngularImpulseA).toBeCloseTo(-resultBA.tangentAngularImpulseB);
      expect(resultAB.tangentAngularImpulseB).toBeCloseTo(-resultBA.tangentAngularImpulseA);
    });

    it('Should mirror angular impulses when the contact point is mirrored', () => {
      const resultA = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!resultA) {
        throw new Error('Expected a contact impulse to be computed for A');
      }

      const resultB = computeContactImpulse({
        contactPoint: new Vector2d({
          x: -contactPoint.x,
          y: -contactPoint.y,
        }),
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!resultB) {
        throw new Error('Expected a contact impulse to be computed for B');
      }

      expect(resultA.normalAngularImpulseA).toBeCloseTo(-resultB.normalAngularImpulseA);
      expect(resultA.normalAngularImpulseB).toBeCloseTo(-resultB.normalAngularImpulseB);
      expect(resultA.tangentAngularImpulseA).toBeCloseTo(-resultB.tangentAngularImpulseA);
      expect(resultA.tangentAngularImpulseB).toBeCloseTo(-resultB.tangentAngularImpulseB);
    });
  });

  describe('Restitution and friction bounds', () => {
    it('Should reverse normal velocity when restitution is 1', () => {
      contactPoint = new Vector2d({ x: 0, y: 0 });
      rigidBodyA.restitution = 1;
      rigidBodyB.restitution = 1;

      const result = computeContactImpulse({
        contactPoint,
        normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const previousRelativeVelocity = rigidBodyA.velocity.subtract(rigidBodyB.velocity);
      const previousNormalRelativeVelocity = Vector2d.dotProduct(previousRelativeVelocity, normal);

      const { normalLinearImpulse } = result;

      const impulseVelocityChangeA = normalLinearImpulse.multiply(rigidBodyA.inverseMass);
      const impulseVelocityChangeB = normalLinearImpulse.multiply(rigidBodyB.inverseMass);

      const newVelocityA = rigidBodyA.velocity.add(impulseVelocityChangeA);
      const newVelocityB = rigidBodyB.velocity.subtract(impulseVelocityChangeB);
      const newRelativeVelocity = newVelocityA.subtract(newVelocityB);
      const newNormalRelativeVelocity = Vector2d.dotProduct(newRelativeVelocity, normal);

      expect(newNormalRelativeVelocity).toBeCloseTo(-previousNormalRelativeVelocity);
    });
  });
});
