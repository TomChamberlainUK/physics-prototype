import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
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
      canvasGetContextSpy.mockClear();
    });

    afterAll(() => {
      canvasGetContextSpy.mockRestore();
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
    let mockCtxClearRect: MockInstance<typeof renderer.ctx.clearRect>;
    let mockCtxSetTransform: MockInstance<typeof renderer.ctx.setTransform>;

    beforeAll(() => {
      mockCtxClearRect = vi.spyOn(renderer.ctx, 'clearRect');
      mockCtxSetTransform = vi.spyOn(renderer.ctx, 'setTransform');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
      renderer.clear();
    });

    afterEach(() => {
      mockCtxClearRect.mockClear();
      mockCtxSetTransform.mockClear();
    });

    afterAll(() => {
      mockCtxClearRect.mockRestore();
      mockCtxSetTransform.mockRestore();
    });

    it('Should reset the canvas transform to top-left-origin', () => {
      expect(mockCtxSetTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });

    it('Should clear the canvas', () => {
      expect(mockCtxClearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('drawCircle()', () => {
    let mockCtxArc: MockInstance<typeof renderer.ctx.arc>;
    let mockCtxBeginPath: MockInstance<typeof renderer.ctx.beginPath>;
    let mockCtxClosePath: MockInstance<typeof renderer.ctx.closePath>;
    let mockCtxFill: MockInstance<typeof renderer.ctx.fill>;

    beforeAll(() => {
      mockCtxArc = vi.spyOn(renderer.ctx, 'arc');
      mockCtxBeginPath = vi.spyOn(renderer.ctx, 'beginPath');
      mockCtxClosePath = vi.spyOn(renderer.ctx, 'closePath');
      mockCtxFill = vi.spyOn(renderer.ctx, 'fill');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    afterAll(() => {
      mockCtxArc.mockRestore();
      mockCtxBeginPath.mockRestore();
      mockCtxClosePath.mockRestore();
      mockCtxFill.mockRestore();
    });

    it('Should draw a circle on the canvas', () => {
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

  describe('drawBox()', () => {
    let mockCtxFillRect: MockInstance<typeof renderer.ctx.fillRect>;

    beforeAll(() => {
      mockCtxFillRect = vi.spyOn(renderer.ctx, 'fillRect');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    afterEach(() => {
      mockCtxFillRect.mockClear();
    });

    afterAll(() => {
      mockCtxFillRect.mockRestore();
    });

    it('Should draw a box on the canvas', () => {
      const centerX = 100;
      const centerY = 150;
      const width = 200;
      const height = 100;

      renderer.drawBox({
        x: centerX,
        y: centerY,
        width,
        height,
        color: 'blue',
      });

      expect(mockCtxFillRect).toHaveBeenCalledWith(
        centerX - width / 2,
        centerY - height / 2,
        width,
        height,
      );
    });
  });

  describe('render()', () => {
    let clearSpy: MockInstance<typeof renderer.clear>;
    let drawBoxSpy: MockInstance<typeof renderer.drawBox>;
    let drawCircleSpy: MockInstance<typeof renderer.drawCircle>;
    let resetOriginSpy: MockInstance<typeof renderer.resetOrigin>;

    beforeEach(() => {
      renderer = new Renderer(canvas);
      clearSpy = vi.spyOn(renderer, 'clear');
      drawBoxSpy = vi.spyOn(renderer, 'drawBox');
      drawCircleSpy = vi.spyOn(renderer, 'drawCircle');
      resetOriginSpy = vi.spyOn(renderer, 'resetOrigin');
    });

    afterEach(() => {
      clearSpy.mockClear();
      drawBoxSpy.mockClear();
      drawCircleSpy.mockClear();
      resetOriginSpy.mockClear();
    });

    afterAll(() => {
      clearSpy.mockRestore();
      drawBoxSpy.mockRestore();
      drawCircleSpy.mockRestore();
      resetOriginSpy.mockRestore();
    });

    it('Should clear the canvas', () => {
      const scene = new Scene();
      renderer.render(scene, 0);
      expect(clearSpy).toHaveBeenCalled();
    });

    it('Should reset the canvas origin', () => {
      const scene = new Scene();
      renderer.render(scene, 0);
      expect(resetOriginSpy).toHaveBeenCalled();
    });

    it('Should draw a circle for any entity with circular geometry', () => {
      const position = new Vector2d({ x: 100, y: 150 });
      const color = 'red';
      const radius = 50;
      const scene = new Scene();
      const entity = new Entity();
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({
        color,
        shape: {
          type: 'circle',
          radius,
        },
      }));
      scene.addEntity(entity);
      renderer.render(scene, 0);
      expect(drawCircleSpy).toHaveBeenCalledWith({ x: position.x, y: position.y, radius, color });
    });

    it('Should draw a box for any entity with box geometry', () => {
      const position = new Vector2d({ x: 200, y: 250 });
      const color = 'blue';
      const width = 120;
      const height = 80;
      const scene = new Scene();
      const entity = new Entity();
      entity.addComponent(new Transform2dComponent({ position }));
      entity.addComponent(new Geometry2dComponent({
        color,
        shape: {
          type: 'box',
          width,
          height,
        },
      }));
      scene.addEntity(entity);
      renderer.render(scene, 0);
      expect(drawBoxSpy).toHaveBeenCalledWith({ x: position.x, y: position.y, width, height, color });
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
      const geometry2dComponent = new Geometry2dComponent({
        color,
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
      scene.addEntity(entity);
      renderer.render(scene, alpha);
      expect(drawCircleSpy).toHaveBeenCalledWith({
        x: expectedX,
        y: expectedY,
        radius,
        color,
      });
    });

    it('Should skip entities without Transform2d or Geometry2d components', () => {
      const scene = new Scene();
      const entity = new Entity();
      scene.addEntity(entity);
      renderer.render(scene, 0);
      expect(drawCircleSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetOrigin()', () => {
    let mockCtxSetTransform: MockInstance<typeof renderer.ctx.setTransform>;
    let mockCtxTranslate: MockInstance<typeof renderer.ctx.translate>;

    beforeAll(() => {
      mockCtxSetTransform = vi.spyOn(renderer.ctx, 'setTransform');
      mockCtxTranslate = vi.spyOn(renderer.ctx, 'translate');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
      renderer.resetOrigin();
    });

    afterEach(() => {
      mockCtxSetTransform.mockClear();
      mockCtxTranslate.mockClear();
    });

    afterAll(() => {
      mockCtxSetTransform.mockRestore();
      mockCtxTranslate.mockRestore();
    });

    it('Should reset the canvas origin to the center corner', () => {
      expect(renderer.ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
      expect(renderer.ctx.translate).toHaveBeenCalledWith(
        renderer.canvas.width / 2,
        renderer.canvas.height / 2,
      );
    });
  });
});
