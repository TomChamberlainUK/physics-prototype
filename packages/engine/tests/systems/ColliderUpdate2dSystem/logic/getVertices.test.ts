import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { getVertices } from '#/systems/ColliderUpdate2dSystem/logic';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getVertices', () => {
  let entity: Entity;
  let collider: Collider2dComponent;
  let transform: Transform2dComponent;

  beforeEach(() => {
    entity = new Entity();
  });

  describe('When passed an entity with valid components', () => {
    beforeEach(() => {
      transform = new Transform2dComponent();
      entity.addComponent(transform);
    });

    describe('When passed an entity with a box collider', () => {
      const width = 10;
      const height = 5;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      beforeEach(() => {
        collider = new Collider2dComponent({
          shape: {
            type: 'box',
            width,
            height,
          },
        });
        entity.addComponent(collider);
      });

      it('Should return its vertices', () => {
        const expectedVertices = [
          { x: -halfWidth, y: -halfHeight },
          { x: halfWidth, y: -halfHeight },
          { x: halfWidth, y: halfHeight },
          { x: -halfWidth, y: halfHeight },
        ];
        const vertices = getVertices(entity);
        expect(vertices).toEqual(expectedVertices);
      });

      it('Should return its translated vertices', () => {
        transform.position.x = 20;
        transform.position.y = 10;
        const expectedVertices = [
          { x: transform.position.x - halfWidth, y: transform.position.y - halfHeight },
          { x: transform.position.x + halfWidth, y: transform.position.y - halfHeight },
          { x: transform.position.x + halfWidth, y: transform.position.y + halfHeight },
          { x: transform.position.x - halfWidth, y: transform.position.y + halfHeight },
        ];
        const vertices = getVertices(entity);
        expect(vertices).toEqual(expectedVertices);
      });

      it('Should return its rotated vertices', () => {
        transform.rotation = Math.PI / 2; // 90 degrees
        const cos = Math.cos(transform.rotation);
        const sin = Math.sin(transform.rotation);
        const expectedVertices = [
          { x: -halfWidth, y: -halfHeight },
          { x: halfWidth, y: -halfHeight },
          { x: halfWidth, y: halfHeight },
          { x: -halfWidth, y: halfHeight },
        ].map(vertex => ({
          x: vertex.x * cos - vertex.y * sin,
          y: vertex.x * sin + vertex.y * cos,
        }));
        const vertices = getVertices(entity);
        expect(vertices).toEqual(expectedVertices);
      });

      it('Should return its translated and rotated vertices', () => {
        transform.position.x = 15;
        transform.position.y = -5;
        transform.rotation = Math.PI / 4; // 45 degrees
        const cos = Math.cos(transform.rotation);
        const sin = Math.sin(transform.rotation);
        const expectedVertices = [
          { x: -halfWidth, y: -halfHeight },
          { x: halfWidth, y: -halfHeight },
          { x: halfWidth, y: halfHeight },
          { x: -halfWidth, y: halfHeight },
        ].map(vertex => ({
          x: vertex.x * cos - vertex.y * sin + transform.position.x,
          y: vertex.x * sin + vertex.y * cos + transform.position.y,
        }));
        const vertices = getVertices(entity);
        expect(vertices).toEqual(expectedVertices);
      });
    });

    describe('When passed an entity with a circle collider', () => {
      beforeEach(() => {
        collider = new Collider2dComponent({
          shape: {
            type: 'circle',
            radius: 5,
          },
        });
        entity.addComponent(collider);
      });

      it('Should return null', () => {
        const vertices = getVertices(entity);
        expect(vertices).toBeNull();
      });
    });
  });

  describe('When passed an entity without valid components', () => {
    it('Should return null', () => {
      const vertices = getVertices(entity);
      expect(vertices).toBeNull();
    });
  });
});
