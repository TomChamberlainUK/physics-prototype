import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { computeAABB } from '#src/systems/ColliderUpdate2dSystem/logic/index.js';
import * as computeBoxAABBModule from '#src/systems/ColliderUpdate2dSystem/logic/computeBoxAABB.js';
import * as computeCircleAABBModule from '#src/systems/ColliderUpdate2dSystem/logic/computeCircleAABB.js';

describe('computeAABB', () => {
  let collider: Collider2dComponent;
  let transform: Transform2dComponent;

  beforeEach(() => {
    transform = new Transform2dComponent();
  });

  describe('When passed a box collider', () => {
    const expectedAABB = {
      min: { x: -16, y: -8 },
      max: { x: 16, y: 8 },
    };

    let computeBoxAABBSpy: MockInstance<typeof computeBoxAABBModule.default>;

    beforeAll(() => {
      computeBoxAABBSpy = vi.spyOn(computeBoxAABBModule, 'default');
    });

    beforeEach(() => {
      collider = new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 16,
        },
      });
    });

    afterEach(() => {
      computeBoxAABBSpy.mockClear();
    });

    afterAll(() => {
      computeBoxAABBSpy.mockRestore();
    });

    it('Should return the result of computeBoxAABB', () => {
      const aabb = computeAABB({ collider, transform });
      expect(computeBoxAABBSpy).toHaveBeenCalledWith({
        width: 32,
        height: 16,
        position: transform.position,
        rotation: transform.rotation,
      });
      expect(aabb).toEqual(expectedAABB);
    });
  });

  describe('When passed a circle collider', () => {
    const expectedAABB = {
      min: { x: -16, y: -16 },
      max: { x: 16, y: 16 },
    };

    let computeCircleAABBSpy: MockInstance<typeof computeCircleAABBModule.default>;

    beforeAll(() => {
      computeCircleAABBSpy = vi.spyOn(computeCircleAABBModule, 'default');
      computeCircleAABBSpy.mockReturnValue(expectedAABB);
    });

    beforeEach(() => {
      collider = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
    });

    afterEach(() => {
      computeCircleAABBSpy.mockClear();
    });

    afterAll(() => {
      computeCircleAABBSpy.mockRestore();
    });

    it('Should return the result of computeCircleAABB', () => {
      const aabb = computeAABB({ collider, transform });
      expect(computeCircleAABBSpy).toHaveBeenCalledWith({
        radius: 16,
        position: transform.position,
      });
      expect(aabb).toEqual(expectedAABB);
    });
  });
});
