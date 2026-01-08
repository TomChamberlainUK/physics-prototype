import { describe, expect, it } from 'vitest';
import { Vector2d } from '#/maths';
import { computeContactImpulse } from '#/systems/CollisionImpulseResolution2dSystem/logic';

describe('computeContactImpulse', () => {
  const defaultParams = {
    angularVelocityA: 0,
    angularVelocityB: 0,
    contactPoint: new Vector2d({ x: 0, y: -1 }),
    frictionA: 0.5,
    frictionB: 0.5,
    inverseMassA: 1,
    inverseMassB: 1,
    inverseMomentOfInertiaA: 1,
    inverseMomentOfInertiaB: 1,
    normal: new Vector2d({ x: -1, y: 0 }),
    positionA: new Vector2d({ x: -1, y: 0 }),
    positionB: new Vector2d({ x: 1, y: 0 }),
    restitutionA: 0,
    restitutionB: 0,
    velocityA: new Vector2d({ x: 5, y: 0 }),
    velocityB: new Vector2d({ x: 0, y: 0 }),
  };

  describe('Directional Correctness', () => {
    it('Should return a normal linear impulse along the contact normal', () => {
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse } = result;

      const dotProduct = Vector2d.dotProduct(normalLinearImpulse, defaultParams.normal);
      expect(dotProduct).toBeGreaterThan(0);
    });

    it('Should return a tangent linear impulse perpindicular to the contact normal', () => {
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      const dotProduct = Vector2d.dotProduct(tangentLinearImpulse, defaultParams.normal);
      expect(dotProduct).toBeCloseTo(0);
    });

    it('Should return angular impulses matching the torque direction', () => {
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const leverArmA = defaultParams.contactPoint.subtract(defaultParams.positionA);
      const leverArmB = defaultParams.contactPoint.subtract(defaultParams.positionB);
      const normalTorqueArmA = Vector2d.crossProduct(leverArmA, defaultParams.normal);
      const normalTorqueArmB = Vector2d.crossProduct(leverArmB, defaultParams.normal);

      const { normalAngularImpulseA, normalAngularImpulseB } = result;

      expect(Math.sign(normalAngularImpulseA)).toBe(Math.sign(normalTorqueArmA));
      expect(Math.sign(normalAngularImpulseB)).toBe(Math.sign(normalTorqueArmB));
    });
  });

  describe('Zero-impulse conditions', () => {
    it('Should return null when bodies are moving apart', () => {
      const result = computeContactImpulse({
        ...defaultParams,
        normal: new Vector2d({ x: 1, y: 0 }),
        velocityA: new Vector2d({ x: 1, y: 0 }),
        velocityB: new Vector2d({ x: 0, y: 0 }),
      });

      expect(result).toBeNull();
    });

    it('Should return a tangent linear impulse of zero when there is no friction', () => {
      const result = computeContactImpulse({
        ...defaultParams,
        frictionA: 0,
        frictionB: 0,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      expect(tangentLinearImpulse.getMagnitude()).toBeCloseTo(0);
    });

    it('Should return angular impulses of zero when the contact point is at the center of mass', () => {
      const result = computeContactImpulse({
        ...defaultParams,
        contactPoint: new Vector2d({ x: 0, y: 0 }),
        positionA: new Vector2d({ x: 0, y: 0 }),
        positionB: new Vector2d({ x: 0, y: 0 }),
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
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse } = result;

      const impulseVelocityChangeA = normalLinearImpulse.multiply(defaultParams.inverseMassA);
      const impulseVelocityChangeB = normalLinearImpulse.multiply(-defaultParams.inverseMassB);

      const newVelocityA = defaultParams.velocityA.add(impulseVelocityChangeA);
      const newVelocityB = defaultParams.velocityB.add(impulseVelocityChangeB);

      const previousRelativeVelocity = defaultParams.velocityA.subtract(defaultParams.velocityB);
      const newRelativeVelocity = newVelocityA.subtract(newVelocityB);

      const previousNormalRelativeVelocity = Vector2d.dotProduct(previousRelativeVelocity, defaultParams.normal);
      const newNormalRelativeVelocity = Vector2d.dotProduct(newRelativeVelocity, defaultParams.normal);

      expect(Math.abs(newNormalRelativeVelocity)).toBeLessThanOrEqual(Math.abs(previousNormalRelativeVelocity));
    });

    it('Should apply friction opposing tangetial motion', () => {
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { tangentLinearImpulse } = result;

      const tangent = new Vector2d({
        x: -defaultParams.normal.y,
        y: defaultParams.normal.x,
      });
      const relativeVelocity = defaultParams.velocityA.subtract(defaultParams.velocityB);
      const tangentRelativeVelocity = Vector2d.dotProduct(relativeVelocity, tangent);
      const tangentImpulseDirection = Vector2d.dotProduct(tangentLinearImpulse, tangent);

      expect(tangentImpulseDirection * tangentRelativeVelocity).toBeLessThanOrEqual(0);
    });

    it('Should clamp friction impulse based on normal impulse and friction coefficients', () => {
      const result = computeContactImpulse({ ...defaultParams });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const { normalLinearImpulse, tangentLinearImpulse } = result;

      const normalImpulseMagnitude = normalLinearImpulse.getMagnitude();
      const tangentImpulseMagnitude = tangentLinearImpulse.getMagnitude();

      const coefficientOfFriction = Math.sqrt(defaultParams.frictionA * defaultParams.frictionB);
      const maxFrictionImpulse = normalImpulseMagnitude * coefficientOfFriction;

      expect(tangentImpulseMagnitude).toBeLessThanOrEqual(maxFrictionImpulse);
    });
  });

  describe('Symmetry and equivalence', () => {
    it('Should mirror impulses when swapping bodies', () => {
      const resultAB = computeContactImpulse({ ...defaultParams });

      if (!resultAB) {
        throw new Error('Expected a contact impulse to be computed for A-B');
      }

      const resultBA = computeContactImpulse({
        ...defaultParams,
        angularVelocityA: defaultParams.angularVelocityB,
        angularVelocityB: defaultParams.angularVelocityA,
        frictionA: defaultParams.frictionB,
        frictionB: defaultParams.frictionA,
        inverseMassA: defaultParams.inverseMassB,
        inverseMassB: defaultParams.inverseMassA,
        inverseMomentOfInertiaA: defaultParams.inverseMomentOfInertiaB,
        inverseMomentOfInertiaB: defaultParams.inverseMomentOfInertiaA,
        normal: defaultParams.normal.multiply(-1),
        positionA: defaultParams.positionB,
        positionB: defaultParams.positionA,
        restitutionA: defaultParams.restitutionB,
        restitutionB: defaultParams.restitutionA,
        velocityA: defaultParams.velocityB,
        velocityB: defaultParams.velocityA,
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
      const resultA = computeContactImpulse({ ...defaultParams });

      if (!resultA) {
        throw new Error('Expected a contact impulse to be computed for A');
      }

      const resultB = computeContactImpulse({
        ...defaultParams,
        contactPoint: new Vector2d({
          x: -defaultParams.contactPoint.x,
          y: -defaultParams.contactPoint.y,
        }),
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
      const result = computeContactImpulse({
        ...defaultParams,
        contactPoint: new Vector2d({ x: 0, y: 0 }),
        restitutionA: 1,
        restitutionB: 1,
      });

      if (!result) {
        throw new Error('Expected a contact impulse to be computed');
      }

      const previousRelativeVelocity = defaultParams.velocityA.subtract(defaultParams.velocityB);
      const previousNormalRelativeVelocity = Vector2d.dotProduct(previousRelativeVelocity, defaultParams.normal);

      const { normalLinearImpulse } = result;

      const impulseVelocityChangeA = normalLinearImpulse.multiply(defaultParams.inverseMassA);
      const impulseVelocityChangeB = normalLinearImpulse.multiply(defaultParams.inverseMassB);

      const newVelocityA = defaultParams.velocityA.add(impulseVelocityChangeA);
      const newVelocityB = defaultParams.velocityB.subtract(impulseVelocityChangeB);

      const newRelativeVelocity = newVelocityA.subtract(newVelocityB);
      const newNormalRelativeVelocity = Vector2d.dotProduct(newRelativeVelocity, defaultParams.normal);

      expect(newNormalRelativeVelocity).toBeCloseTo(-previousNormalRelativeVelocity);
    });
  });
});
