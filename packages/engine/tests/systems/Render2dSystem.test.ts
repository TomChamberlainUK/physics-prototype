import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Geometry2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import Renderer from '#/Renderer';
import Render2dSystem from '#/systems/Render2dSystem';
import * as lerpModule from '#/utils/lerp';

describe('Render2dSystem', () => {
  let canvas: HTMLCanvasElement;
  let renderer: Renderer;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  beforeEach(() => {
    renderer = new Renderer(canvas);
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new Render2dSystem();
      expect(system).toBeInstanceOf(Render2dSystem);
      expect(system.name).toBe('Render2dSystem');
      expect(system.type).toBe('render');
    });
  });

  describe('update()', () => {
    const fillColor = 'black';
    const strokeColor = 'white';
    const position = new Vector2d({ x: 100, y: 150 });

    let entity: Entity;
    let system: Render2dSystem;

    let drawBoxSpy: MockInstance<typeof renderer.drawBox>;
    let drawCircleSpy: MockInstance<typeof renderer.drawCircle>;
    let lerpSpy: MockInstance<typeof lerpModule.default>;

    beforeAll(() => {
      lerpSpy = vi.spyOn(lerpModule, 'default');
    });

    beforeEach(() => {
      entity = new Entity();
      system = new Render2dSystem();
      drawBoxSpy = vi.spyOn(renderer, 'drawBox');
      drawCircleSpy = vi.spyOn(renderer, 'drawCircle');
    });

    afterEach(() => {
      drawBoxSpy.mockClear();
      drawCircleSpy.mockClear();
      lerpSpy.mockClear();
    });

    afterAll(() => {
      drawBoxSpy.mockRestore();
      drawCircleSpy.mockRestore();
      lerpSpy.mockRestore();
    });

    it('Should draw a circle for any entity with circular geometry', () => {
      const radius = 50;
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({
        fillColor,
        strokeColor,
        shape: {
          type: 'circle',
          radius,
        },
      }));
      system.update([entity], { alpha: 1, renderer });
      expect(drawCircleSpy).toHaveBeenCalledWith({
        x: position.x,
        y: position.y,
        radius,
        fillColor,
        strokeColor,
      });
    });

    it('Should draw a box for any entity with box geometry', () => {
      const width = 120;
      const height = 80;
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({
        fillColor,
        strokeColor,
        shape: {
          type: 'box',
          width,
          height,
        },
      }));
      system.update([entity], { alpha: 1, renderer });
      expect(drawBoxSpy).toHaveBeenCalledWith({
        x: position.x,
        y: position.y,
        width,
        height,
        fillColor,
        strokeColor,
      });
    });

    it('Should interpolate the entity position based on the alpha value', () => {
      const radius = 50;
      const alpha = 0.5;
      const previousPosition = new Vector2d({ x: 0, y: 0 });
      const currentPosition = new Vector2d({ x: 100, y: 100 });
      const expectedX = 50;
      const expectedY = 50;
      lerpSpy.mockImplementationOnce(() => expectedX);
      lerpSpy.mockImplementationOnce(() => expectedY);
      const transform2dComponent = new Transform2dComponent();
      const geometry2dComponent = new Geometry2dComponent({
        shape: {
          type: 'circle',
          radius,
        },
      });
      entity.addComponents([
        transform2dComponent,
        geometry2dComponent,
      ]);
      transform2dComponent.previousPosition = previousPosition;
      transform2dComponent.position = currentPosition;
      system.update([entity], { alpha, renderer });
      expect(lerpSpy).toHaveBeenNthCalledWith(1, previousPosition.x, currentPosition.x, alpha);
      expect(lerpSpy).toHaveBeenNthCalledWith(2, previousPosition.y, currentPosition.y, alpha);
      expect(drawCircleSpy).toHaveBeenCalledWith({
        x: expectedX,
        y: expectedY,
        radius,
      });
    });

    it('Should skip entities without Transform2d or Geometry2d components', () => {
      system.update([entity], { alpha: 1, renderer });
      expect(drawBoxSpy).not.toHaveBeenCalled();
      expect(drawCircleSpy).not.toHaveBeenCalled();
    });

    it('Should do nothing if no renderer is provided', () => {
      entity.addComponent(new Transform2dComponent());
      entity.addComponent(new Geometry2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      }));
      system.update([entity], { alpha: 1 });
      expect(drawCircleSpy).not.toHaveBeenCalled();
      expect(drawBoxSpy).not.toHaveBeenCalled();
    });
  });
});
