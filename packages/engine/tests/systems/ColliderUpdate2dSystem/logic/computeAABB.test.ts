import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { computeAABB } from '#/systems/ColliderUpdate2dSystem/logic';
import * as computeBoxAABBModule from '#/systems/ColliderUpdate2dSystem/logic/computeBoxAABB';
import * as getCircleAABBModule from '#/systems/ColliderUpdate2dSystem/logic/getCircleAABB';

describe('computeAABB', () => {
  let entity: Entity;
  let transform: Transform2dComponent;
  let collider: Collider2dComponent;

  beforeEach(() => {
    entity = new Entity();
    transform = new Transform2dComponent();
    entity.addComponent(transform);
  });

  describe('When the entity has a box collider', () => {
    beforeEach(() => {
      collider = new Collider2dComponent({
        shape: {
          type: 'box',
          width: 32,
          height: 16,
        },
      });
      entity.addComponent(collider);
    });

    it('Should return the result of computeBoxAABB', () => {
      const computeBoxAABBSpy = vi.spyOn(computeBoxAABBModule, 'default');
      const expectedAABB = {
        min: { x: -16, y: -8 },
        max: { x: 16, y: 8 },
      };
      computeBoxAABBSpy.mockReturnValue(expectedAABB);
      const aabb = computeAABB(entity);
      expect(computeBoxAABBSpy).toHaveBeenCalledWith({
        width: 32,
        height: 16,
        position: transform.position,
        rotation: transform.rotation,
      });
      expect(aabb).toBe(expectedAABB);
    });
  });

  describe('When the entity has a circle collider', () => {
    beforeEach(() => {
      collider = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
      entity.addComponent(collider);
    });

    it('Should return the result of getCircleAABB', () => {
      const getCircleAABBSpy = vi.spyOn(getCircleAABBModule, 'default');
      const expectedAABB = {
        min: { x: -16, y: -16 },
        max: { x: 16, y: 16 },
      };
      getCircleAABBSpy.mockReturnValue(expectedAABB);
      const aabb = computeAABB(entity);
      expect(getCircleAABBSpy).toHaveBeenCalledWith({
        radius: 16,
        position: transform.position,
      });
      expect(aabb).toBe(expectedAABB);
    });
  });
});
