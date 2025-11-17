import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { getAABB } from '#/systems/AABBUpdate2dSystem/logic';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as getBoxAABBModule from '#/systems/AABBUpdate2dSystem/logic/getBoxAABB';
import * as getCircleAABBModule from '#/systems/AABBUpdate2dSystem/logic/getCircleAABB';

describe('getAABB', () => {
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

    it('Should return the result of getBoxAABB', () => {
      const getBoxAABBSpy = vi.spyOn(getBoxAABBModule, 'default');
      const expectedAABB = {
        min: { x: -16, y: -8 },
        max: { x: 16, y: 8 },
      };
      getBoxAABBSpy.mockReturnValue(expectedAABB);
      const aabb = getAABB(entity);
      expect(getBoxAABBSpy).toHaveBeenCalledWith({
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
      const aabb = getAABB(entity);
      expect(getCircleAABBSpy).toHaveBeenCalledWith({
        radius: 16,
        position: transform.position,
      });
      expect(aabb).toBe(expectedAABB);
    });
  });
});
