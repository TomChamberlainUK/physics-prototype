import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';
import * as computeContactPointImpulseModule from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactPointImpulse';
import computeContactManifoldImpulse from '#/systems/CollisionImpulseResolution2dSystem/logic/computeContactManifoldImpulse';
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

  let computeContactPointImpulseSpy: MockInstance<typeof computeContactPointImpulseModule.default>;

  beforeAll(() => {
    computeContactPointImpulseSpy = vi.spyOn(computeContactPointImpulseModule, 'default');
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
    computeContactPointImpulseSpy.mockClear();
  });

  afterAll(() => {
    computeContactPointImpulseSpy.mockRestore();
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
      expect(computeContactPointImpulseSpy).toHaveBeenCalledWith({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalLinearImpulse: new Vector2d({
        x: firstValue,
        y: firstValue,
      }),
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalLinearImpulse: new Vector2d({
        x: secondValue,
        y: secondValue,
      }),
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseA: firstValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseA: secondValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseB: firstValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      normalAngularImpulseB: secondValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentLinearImpulse: new Vector2d({
        x: firstValue,
        y: firstValue,
      }),
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentLinearImpulse: new Vector2d({
        x: secondValue,
        y: secondValue,
      }),
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseA: firstValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseA: secondValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseB: firstValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
      ...defaultOutput,
      tangentAngularImpulseB: secondValue,
    });
    computeContactPointImpulseSpy.mockReturnValueOnce({
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
