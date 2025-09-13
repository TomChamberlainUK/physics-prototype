import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Renderer from '#/Renderer';
import Scene from '#/Scene';
import Entity from '#/Entity';
import { Geometry2dComponent, Transform2dComponent } from '#/components';
import { expectCallOrder } from './utils';
import { Vector2d } from '#/maths';

describe('Renderer', () => {
  let renderer: Renderer;
  let canvas: HTMLCanvasElement;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  describe('constructor()', () => {
    let canvasGetContextSpy: MockInstance<typeof HTMLCanvasElement.prototype.getContext>;

    beforeAll(() => {
      canvasGetContextSpy = vi.spyOn(canvas, 'getContext');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('Should instantiate', () => {
      expect(renderer).toBeInstanceOf(Renderer);
    });

    it('Should set the canvas size to match the window', () => {
      expect(canvas.width).toBe(window.innerWidth);
      expect(canvas.height).toBe(window.innerHeight);
    });

    it('Should get the canvas rendering context', () => {
      expect(canvasGetContextSpy).toHaveBeenCalledWith('2d');
    });

    it('Should expose the canvas', () => {
      expect(renderer.canvas).toBe(canvas);
    });

    it('Should expose the rendering context', () => {
      expect(renderer.ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    it('Should clear the canvas', () => {
      const mockCtxClearRect = vi.spyOn(renderer.ctx, 'clearRect');

      renderer.clear();

      expect(mockCtxClearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('drawCircle()', () => {
    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    it('Should draw a circle on the canvas', () => {
      const mockCtxArc = vi.spyOn(renderer.ctx, 'arc');
      const mockCtxBeginPath = vi.spyOn(renderer.ctx, 'beginPath');
      const mockCtxClosePath = vi.spyOn(renderer.ctx, 'closePath');
      const mockCtxFill = vi.spyOn(renderer.ctx, 'fill');

      renderer.drawCircle({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 64,
        color: 'white',
      });

      expect(renderer.ctx.fillStyle).toBe('#ffffff');
      expect(mockCtxBeginPath).toHaveBeenCalled();
      expect(mockCtxArc).toHaveBeenCalledWith(
        canvas.width / 2,
        canvas.height / 2,
        64,
        0,
        2 * Math.PI,
      );
      expect(mockCtxClosePath).toHaveBeenCalled();
      expect(mockCtxFill).toHaveBeenCalled();
      expectCallOrder([
        mockCtxBeginPath,
        mockCtxArc,
        mockCtxClosePath,
        mockCtxFill,
      ]);
    });
  });

  describe('render()', () => {
    let clearSpy: MockInstance<typeof renderer.clear>;
    let drawCircleSpy: MockInstance<typeof renderer.drawCircle>;

    beforeEach(() => {
      renderer = new Renderer(canvas);
      clearSpy = vi.spyOn(renderer, 'clear');
      drawCircleSpy = vi.spyOn(renderer, 'drawCircle');
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('Should clear the canvas', () => {
      const scene = new Scene();
      renderer.render(scene, 0);
      expect(clearSpy).toHaveBeenCalled();
    });

    it('Should draw a circle for each entity with Transform2d and Geometry2d components', () => {
      const position = new Vector2d({ x: 100, y: 150 });
      const color = 'red';
      const radius = 50;
      const scene = new Scene();
      const entity = new Entity();
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({ color, radius }));
      scene.addEntity(entity);
      renderer.render(scene, 0);
      expect(drawCircleSpy).toHaveBeenCalledWith({ x: position.x, y: position.y, radius, color });
    });

    it('Should interpolate the entity position based on the alpha value', () => {
      const previousPosition = new Vector2d({ x: 100, y: 150 });
      const currentPosition = new Vector2d({ x: 200, y: 250 });
      const color = 'red';
      const radius = 50;
      const alpha = 0.5;
      const expectedX = previousPosition.x + (currentPosition.x - previousPosition.x) * alpha;
      const expectedY = previousPosition.y + (currentPosition.y - previousPosition.y) * alpha;
      const scene = new Scene();
      const entity = new Entity();
      const transform2dComponent = new Transform2dComponent();
      const geometry2dComponent = new Geometry2dComponent({ color, radius });
      entity.addComponents([
        transform2dComponent,
        geometry2dComponent
      ]);
      transform2dComponent.previousPosition = previousPosition;
      transform2dComponent.position = currentPosition;
      scene.addEntity(entity);
      renderer.render(scene, alpha);
      expect(drawCircleSpy).toHaveBeenCalledWith({ x: expectedX, y: expectedY, radius, color });
    });

    it('Should skip entities without Transform2d or Geometry2d components', () => {
      const scene = new Scene();
      const entity = new Entity();
      scene.addEntity(entity);
      renderer.render(scene, 0);
      expect(drawCircleSpy).not.toHaveBeenCalled();
    });
  });
});
