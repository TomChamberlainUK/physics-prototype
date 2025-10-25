import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import AABBUpdate2dSystem from '#/systems/AABBUpdate2dSystem/AABBUpdate2dSystem';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import * as getAABBModule from '#/systems/AABBUpdate2dSystem/logic/getAABB';

describe('AABBUpdate2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new AABBUpdate2dSystem();
      expect(system).toBeInstanceOf(AABBUpdate2dSystem);
      expect(system.name).toBe('AABBUpdate2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let aabbUpdate2dSystem: AABBUpdate2dSystem;

    let getAABBSpy: MockInstance<typeof getAABBModule.default>;

    beforeAll(() => {
      getAABBSpy = vi.spyOn(getAABBModule, 'default');
    });

    beforeEach(() => {
      aabbUpdate2dSystem = new AABBUpdate2dSystem();
      entity = new Entity();
    });

    afterEach(() => {
      getAABBSpy.mockClear();
    });

    afterAll(() => {
      getAABBSpy.mockRestore();
    });

    describe('When passed entities with required components', () => {
      let transform2dComponent: Transform2dComponent;
      let collider2dComponent: Collider2dComponent;

      beforeEach(() => {
        transform2dComponent = new Transform2dComponent();
        collider2dComponent = new Collider2dComponent({
          shape: {
            type: 'box',
            width: 1,
            height: 1,
          },
        });
        entity.addComponents([
          transform2dComponent,
          collider2dComponent,
        ]);
      });

      it('Should update the AABB of entities', () => {
        const expectedAABB = {
          min: {
            x: -0.5,
            y: -0.5,
          },
          max: {
            x: 0.5,
            y: 0.5,
          },
        };
        getAABBSpy.mockReturnValueOnce(expectedAABB);
        aabbUpdate2dSystem.update([entity]);
        expect(collider2dComponent.aabb).toEqual(expectedAABB);
      });
    });

    describe('When passed entities without required components', () => {
      it('Should not update the AABB of entities', () => {
        aabbUpdate2dSystem.update([entity]);
        expect(getAABBSpy).not.toHaveBeenCalled();
      });
    });
  });
});
