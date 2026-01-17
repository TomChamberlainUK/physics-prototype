import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import * as computeContactImpulseModule from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactImpulse';
import Vector2d from '#/maths/Vector2d';
import computeContactManifoldImpulse from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactManifoldImpulse';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import type { ContactManifold } from '#/types';

describe('computeContactManifoldImpulse', () => {
  let contactManifold: ContactManifold;
  let rigidBodyA: RigidBody2dComponent;
  let rigidBodyB: RigidBody2dComponent;
  let transformA: Transform2dComponent;
  let transformB: Transform2dComponent;

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

  beforeEach(() => {
    contactManifold = {
      normal: new Vector2d({ x: -1, y: 0 }),
      contactPoints: [
        new Vector2d({ x: 1, y: 1 }),
        new Vector2d({ x: -1, y: 1 }),
        new Vector2d({ x: 0, y: -1 }),
      ],
      overlap: 0.5,
    };
    rigidBodyA = new RigidBody2dComponent();
    rigidBodyB = new RigidBody2dComponent();
    transformA = new Transform2dComponent();
    transformB = new Transform2dComponent();
  });

  afterEach(() => {
    computeContactImpulseSpy.mockClear();
  });

  afterAll(() => {
    computeContactImpulseSpy.mockRestore();
  });

  it('Should compute the contact impulse for each contact point', () => {
    computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });
    for (const contactPoint of contactManifold.contactPoints) {
      expect(computeContactImpulseSpy).toHaveBeenCalledWith({
        contactPoint,
        normal: contactManifold.normal,
        rigidBodyA,
        rigidBodyB,
        transformA,
        transformB,
      });
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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

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

    const result = computeContactManifoldImpulse({
      contactManifold,
      rigidBodyA,
      rigidBodyB,
      transformA,
      transformB,
    });

    if (!result) {
      throw new Error('Expected a contact impulse to be computed');
    }

    expect(result.tangentAngularImpulseB).toBe(averagedValue);
  });
});
