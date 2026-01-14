import { afterAll, afterEach, beforeAll, describe, expect, it, vi, type MockInstance } from 'vitest';
import * as computeContactImpulseModule from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactImpulse';
import Vector2d from '#/maths/Vector2d';
import computeContactManifoldImpulse from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactManifoldImpulse';

describe('computeContactManifoldImpulse', () => {
  const defaultParams = {
    angularVelocityA: 0,
    angularVelocityB: 0,
    contactPoints: [
      new Vector2d({ x: 1, y: 1 }),
      new Vector2d({ x: -1, y: 1 }),
      new Vector2d({ x: 0, y: -1 }),
    ],
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

  const defaultOutput = {
    normalLinearImpulse: new Vector2d({ x: 0, y: 0 }),
    normalAngularImpulseA: 0,
    normalAngularImpulseB: 0,
    tangentLinearImpulse: new Vector2d({ x: 0, y: 0 }),
    tangentAngularImpulseA: 0,
    tangentAngularImpulseB: 0,
  };

  const firstValue = 10;
  const secondValue = 20;
  const thirdValue = 30;
  const averagedValue = (firstValue + secondValue + thirdValue) / 3;

  let computeContactImpulseSpy: MockInstance<typeof computeContactImpulseModule.default>;

  beforeAll(() => {
    computeContactImpulseSpy = vi.spyOn(computeContactImpulseModule, 'default');
  });

  afterEach(() => {
    computeContactImpulseSpy.mockClear();
  });

  afterAll(() => {
    computeContactImpulseSpy.mockRestore();
  });

  it('Should compute the contact impulse for each contact point', () => {
    computeContactManifoldImpulse({ ...defaultParams });
    const { contactPoints: _contactPoints, ...expectedParams } = defaultParams;
    for (const contactPoint of defaultParams.contactPoints) {
      expect(computeContactImpulseSpy).toHaveBeenCalledWith({ ...expectedParams, contactPoint });
    }
  });

  it('Should return a normal linear impulse averaged over all contact points', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalLinearImpulse: new Vector2d({
        x: firstValue,
        y: firstValue,
      }),
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalLinearImpulse: new Vector2d({
        x: secondValue,
        y: secondValue,
      }),
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalLinearImpulse: new Vector2d({
        x: thirdValue,
        y: thirdValue,
      }),
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    const expectedImpulse = new Vector2d({
      x: averagedValue,
      y: averagedValue,
    });

    expect(result.normalLinearImpulse).toEqual(expectedImpulse);
  });

  it('Should return a normal angular impulse averaged over all contact points for rigid body A', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseA: firstValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseA: secondValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseA: thirdValue,
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    expect(result.normalAngularImpulseA).toBe(averagedValue);
  });

  it('Should return a normal angular impulse averaged over all contact points for rigid body B', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseB: firstValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseB: secondValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseB: thirdValue,
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    expect(result.normalAngularImpulseB).toBe(averagedValue);
  });

  it('Should return a tangent linear impulse averaged over all contact points', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentLinearImpulse: new Vector2d({
        x: firstValue,
        y: firstValue,
      }),
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentLinearImpulse: new Vector2d({
        x: secondValue,
        y: secondValue,
      }),
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentLinearImpulse: new Vector2d({
        x: thirdValue,
        y: thirdValue,
      }),
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    const expectedImpulse = new Vector2d({
      x: averagedValue,
      y: averagedValue,
    });

    expect(result.tangentLinearImpulse).toEqual(expectedImpulse);
  });

  it('Should return a tangent angular impulse averaged over all contact points for rigid body A', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseA: firstValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseA: secondValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseA: thirdValue,
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    expect(result.tangentAngularImpulseA).toBe(averagedValue); ;
  });

  it('Should return a tangent angular impulse averaged over all contact points for rigid body B', () => {
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseB: firstValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseB: secondValue,
    });
    computeContactImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseB: thirdValue,
    });

    const result = computeContactManifoldImpulse({ ...defaultParams });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    expect(result.tangentAngularImpulseB).toBe(averagedValue);
  });
});
