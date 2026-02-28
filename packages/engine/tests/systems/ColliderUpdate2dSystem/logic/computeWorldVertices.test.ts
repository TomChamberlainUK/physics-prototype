import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import { computeWorldVertices } from '#src/systems/ColliderUpdate2dSystem/logic/index.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('computeWorldVertices', () => {
  let collider: Collider2dComponent;
  let transform: Transform2dComponent;

  beforeEach(() => {
    transform = new Transform2dComponent();
  });

  describe('When passed a box collider', () => {
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
    });

    it('Should return its vertices', () => {
      const expectedVertices = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight },
      ];
      const vertices = computeWorldVertices({ collider, transform });
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
      const vertices = computeWorldVertices({ collider, transform });
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
      const vertices = computeWorldVertices({ collider, transform });
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
      const vertices = computeWorldVertices({ collider, transform });
      expect(vertices).toEqual(expectedVertices);
    });
  });

  describe('When passed a circle collider', () => {
    beforeEach(() => {
      collider = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 5,
        },
      });
    });

    it('Should return null', () => {
      const vertices = computeWorldVertices({ collider, transform });
      expect(vertices).toBeNull();
    });
  });
});
