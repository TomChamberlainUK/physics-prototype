import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Renderer from '#/Renderer';
import { expectCallOrder } from './utils';

describe('Renderer', () => {
  const fillColor = '#000000';
  const strokeColor = '#ffffff';

  let renderer: Renderer;
  let canvas: HTMLCanvasElement;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  describe('constructor()', () => {
    let canvasGetContextSpy: MockInstance<typeof HTMLCanvasElement.prototype.getContext>;
    let resetOriginSpy: MockInstance<typeof Renderer.prototype.resetOrigin>;

    beforeAll(() => {
      canvasGetContextSpy = vi.spyOn(canvas, 'getContext');
      resetOriginSpy = vi.spyOn(Renderer.prototype, 'resetOrigin');
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

    it('Should reset the origin', () => {
      expect(resetOriginSpy).toHaveBeenCalled();
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
    let mockCtxStroke: MockInstance<typeof renderer.ctx.stroke>;

    beforeAll(() => {
      mockCtxArc = vi.spyOn(renderer.ctx, 'arc');
      mockCtxBeginPath = vi.spyOn(renderer.ctx, 'beginPath');
      mockCtxClosePath = vi.spyOn(renderer.ctx, 'closePath');
      mockCtxFill = vi.spyOn(renderer.ctx, 'fill');
      mockCtxStroke = vi.spyOn(renderer.ctx, 'stroke');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    afterEach(() => {
      mockCtxArc.mockClear();
      mockCtxBeginPath.mockClear();
      mockCtxClosePath.mockClear();
      mockCtxFill.mockClear();
      mockCtxStroke.mockClear();
    });

    afterAll(() => {
      mockCtxArc.mockRestore();
      mockCtxBeginPath.mockRestore();
      mockCtxClosePath.mockRestore();
      mockCtxFill.mockRestore();
      mockCtxStroke.mockRestore();
    });

    it('Should draw a circle on the canvas', () => {
      renderer.drawCircle({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 64,
      });
      expect(mockCtxBeginPath).toHaveBeenCalled();
      expect(mockCtxArc).toHaveBeenCalledWith(
        canvas.width / 2,
        canvas.height / 2,
        64,
        0,
        2 * Math.PI,
      );
      expect(mockCtxClosePath).toHaveBeenCalled();
      expectCallOrder([
        mockCtxBeginPath,
        mockCtxArc,
        mockCtxClosePath,
      ]);
    });

    describe('When fillColor is provided', () => {
      it('Should draw a fill on the circle', () => {
        renderer.drawCircle({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 64,
          fillColor,
        });
        expect(renderer.ctx.fillStyle).toBe(fillColor);
        expect(mockCtxFill).toHaveBeenCalled();
        expectCallOrder([
          mockCtxBeginPath,
          mockCtxArc,
          mockCtxClosePath,
          mockCtxFill,
        ]);
      });
    });

    describe('When strokeColor is provided', () => {
      it('Should draw a stroke on the circle', () => {
        renderer.drawCircle({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 64,
          strokeColor,
        });
        expect(renderer.ctx.strokeStyle).toBe(strokeColor);
        expect(mockCtxStroke).toHaveBeenCalled();
        expectCallOrder([
          mockCtxBeginPath,
          mockCtxArc,
          mockCtxClosePath,
          mockCtxStroke,
        ]);
      });
    });

    describe('When strokeColor is not provided', () => {
      it('Should not draw a stroke on the circle', () => {
        renderer.drawCircle({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 64,
        });
        expect(mockCtxStroke).not.toHaveBeenCalled();
      });
    });
  });

  describe('drawBox()', () => {
    const centerX = 100;
    const centerY = 150;
    const width = 200;
    const height = 100;

    let mockCtxFillRect: MockInstance<typeof renderer.ctx.fillRect>;
    let mockCtxStrokeRect: MockInstance<typeof renderer.ctx.strokeRect>;

    beforeAll(() => {
      mockCtxFillRect = vi.spyOn(renderer.ctx, 'fillRect');
      mockCtxStrokeRect = vi.spyOn(renderer.ctx, 'strokeRect');
    });

    beforeEach(() => {
      renderer = new Renderer(canvas);
    });

    afterEach(() => {
      mockCtxFillRect.mockClear();
      mockCtxStrokeRect.mockClear();
    });

    afterAll(() => {
      mockCtxFillRect.mockRestore();
      mockCtxStrokeRect.mockRestore();
    });

    describe('When fillColor is provided', () => {
      it('Should draw a box on the canvas with a fill', () => {
        renderer.drawBox({
          x: centerX,
          y: centerY,
          width,
          height,
          fillColor,
        });
        expect(renderer.ctx.fillStyle).toBe(fillColor);
        expect(mockCtxFillRect).toHaveBeenCalledWith(
          centerX - width / 2,
          centerY - height / 2,
          width,
          height,
        );
      });
    });

    describe('When fillColor is not provided', () => {
      it('Should not draw a box on the canvas with a fill', () => {
        renderer.drawBox({
          x: centerX,
          y: centerY,
          width,
          height,
        });
        expect(mockCtxFillRect).not.toHaveBeenCalled();
      });
    });

    describe('When strokeColor is provided', () => {
      it('Should draw a box on the canvas with a stroke', () => {
        renderer.drawBox({
          x: centerX,
          y: centerY,
          width,
          height,
          strokeColor,
        });
        expect(renderer.ctx.strokeStyle).toBe(strokeColor);
        expect(mockCtxStrokeRect).toHaveBeenCalledWith(
          centerX - width / 2,
          centerY - height / 2,
          width,
          height,
        );
      });
    });

    describe('When strokeColor is not provided', () => {
      it('Should not draw a box on the canvas with a stroke', () => {
        renderer.drawBox({
          x: centerX,
          y: centerY,
          width,
          height,
        });
        expect(mockCtxStrokeRect).not.toHaveBeenCalled();
      });
    });
  });

  describe('drawLine()', () => {
    it('Should draw a line on the canvas', () => {
      const start = { x: 100, y: 100 };
      const end = { x: 200, y: 200 };
      const lineWidth = 2;

      const ctxSaveSpy = vi.spyOn(renderer.ctx, 'save');
      const ctxBeginPathSpy = vi.spyOn(renderer.ctx, 'beginPath');
      const ctxMoveToSpy = vi.spyOn(renderer.ctx, 'moveTo');
      const ctxLineToSpy = vi.spyOn(renderer.ctx, 'lineTo');
      const ctxStrokeSpy = vi.spyOn(renderer.ctx, 'stroke');
      const ctxRestoreSpy = vi.spyOn(renderer.ctx, 'restore');

      ctxRestoreSpy.mockImplementation(vi.fn);

      renderer.drawLine({
        start,
        end,
        strokeColor,
        lineWidth,
      });
      expect(renderer.ctx.strokeStyle).toBe(strokeColor);
      expect(renderer.ctx.lineWidth).toBe(lineWidth);
      expect(ctxMoveToSpy).toHaveBeenCalledWith(start.x, start.y);
      expect(ctxLineToSpy).toHaveBeenCalledWith(end.x, end.y);
      expect(ctxStrokeSpy).toHaveBeenCalled();
      expect(ctxRestoreSpy).toHaveBeenCalled();
      expectCallOrder([
        ctxSaveSpy,
        ctxBeginPathSpy,
        ctxMoveToSpy,
        ctxLineToSpy,
        ctxStrokeSpy,
        ctxRestoreSpy,
      ]);
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

  describe('save()', () => {
    it('Should save the current canvas state', () => {
      const mockCtxSave = vi.spyOn(renderer.ctx, 'save');
      renderer.save();
      expect(mockCtxSave).toHaveBeenCalled();
    });
  });

  describe('restore()', () => {
    it('Should restore the previous canvas state', () => {
      const mockCtxRestore = vi.spyOn(renderer.ctx, 'restore');
      renderer.restore();
      expect(mockCtxRestore).toHaveBeenCalled();
    });
  });

  describe('translate()', () => {
    it('Should translate the canvas origin', () => {
      const mockCtxTranslate = vi.spyOn(renderer.ctx, 'translate');
      const x = 50;
      const y = 100;
      renderer.translate({ x, y });
      expect(mockCtxTranslate).toHaveBeenCalledWith(x, y);
    });
  });
});
