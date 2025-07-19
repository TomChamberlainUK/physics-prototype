import { describe, expect, it, vi } from 'vitest';
import Renderer from '#/Renderer';
import render2dGeometrySystem from '#/systems/render2dGeometrySystem';
import Entity from '#/Entity';
import { Geometry2dComponent, Transform2dComponent } from '#/components';

describe('render2dGeometrySystem', () => {
  const position = { x: 100, y: 150 };
  const color = 'red';
  const radius = 50;

  describe('When passed incompatible entities', () => {
    it('Should not render anything', () => {
      const canvas = document.createElement('canvas');
      const entity = new Entity();
      const renderer = new Renderer(canvas);
      const mockDrawCircle = vi.spyOn(renderer, 'drawCircle');
      render2dGeometrySystem([entity], renderer);
      expect(mockDrawCircle).not.toHaveBeenCalled();
    });
  });

  describe('When passed entities with Transform2d and Geometry2d components', () => {
    it('Should render the geometry based on the components', () => {
      const canvas = document.createElement('canvas');
      const entity = new Entity();
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({ color, radius }));
      const renderer = new Renderer(canvas);
      const mockDrawCircle = vi.spyOn(renderer, 'drawCircle');
      render2dGeometrySystem([entity], renderer);
      expect(mockDrawCircle).toHaveBeenCalledWith({
        radius,
        color,
        x: position.x,
        y: position.y,
      });
    });
  });
});
