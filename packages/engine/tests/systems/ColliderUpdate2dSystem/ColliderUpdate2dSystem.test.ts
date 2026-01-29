import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { ColliderUpdate2dSystem } from '#/systems';
import * as computeAABBModule from '#/systems/ColliderUpdate2dSystem/logic/computeAABB';
import * as computeWorldVerticesModule from '#/systems/ColliderUpdate2dSystem/logic/computeWorldVertices';

describe('ColliderUpdate2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new ColliderUpdate2dSystem();
      expect(system).toBeInstanceOf(ColliderUpdate2dSystem);
      expect(system.name).toBe('ColliderUpdate2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let system: ColliderUpdate2dSystem;

    let computeAABBSpy: MockInstance<typeof computeAABBModule.default>;
    let computeWorldVerticesSpy: MockInstance<typeof computeWorldVerticesModule.default>;

    beforeAll(() => {
      computeAABBSpy = vi.spyOn(computeAABBModule, 'default');
      computeWorldVerticesSpy = vi.spyOn(computeWorldVerticesModule, 'default');
    });

    beforeEach(() => {
      system = new ColliderUpdate2dSystem();
      entity = new Entity();
    });

    afterEach(() => {
      computeAABBSpy.mockClear();
      computeWorldVerticesSpy.mockClear();
    });

    afterAll(() => {
      computeAABBSpy.mockRestore();
      computeWorldVerticesSpy.mockRestore();
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
        computeAABBSpy.mockReturnValueOnce(expectedAABB);
        system.update([entity]);
        expect(collider2dComponent.aabb).toEqual(expectedAABB);
      });

      it('Should update the worldVertices of entities', () => {
        const expectedWorldVertices = [
          new Vector2d({ x: -0.5, y: -0.5 }),
          new Vector2d({ x: 0.5, y: -0.5 }),
          new Vector2d({ x: 0.5, y: 0.5 }),
          new Vector2d({ x: -0.5, y: 0.5 }),
        ];
        computeWorldVerticesSpy.mockReturnValueOnce(expectedWorldVertices);
        system.update([entity]);
        expect(collider2dComponent.worldVertices).toEqual(expectedWorldVertices);
      });
    });

    describe('When passed entities without required components', () => {
      it('Should not update the AABB of entities', () => {
        system.update([entity]);
        expect(computeAABBSpy).not.toHaveBeenCalled();
      });

      it('Should not update the worldVertices of entities', () => {
        system.update([entity]);
        expect(computeWorldVerticesSpy).not.toHaveBeenCalled();
      });
    });
  });
});
