import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Renderer from '#/Renderer';

describe('Renderer', () => {
  let renderer: Renderer;
  let canvas: HTMLCanvasElement;

  describe('constructor', () => {
    let canvasGetContextSpy: MockInstance<typeof HTMLCanvasElement.prototype.getContext>;

    beforeAll(() => {
      canvas = document.createElement('canvas');
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
});
