import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Renderer from '#/Renderer';
import { expectCallOrder } from './utils';

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
});
