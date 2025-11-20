import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Renderer from '#/Renderer';
import { expectCallOrder } from './utils';

describe('Renderer', () => {
  const fillColor = '#ffffff';
  const strokeColor = '#ffffff';

  let renderer: Renderer;
  let canvas: HTMLCanvasElement;

  let ctxSaveSpy: MockInstance<typeof renderer.ctx.save>;
  let ctxMoveToSpy: MockInstance<typeof renderer.ctx.moveTo>;
  let ctxLineToSpy: MockInstance<typeof renderer.ctx.lineTo>;
  let ctxBeginPathSpy: MockInstance<typeof renderer.ctx.beginPath>;
  let ctxClosePathSpy: MockInstance<typeof renderer.ctx.closePath>;
  let ctxFillSpy: MockInstance<typeof renderer.ctx.fill>;
  let ctxStrokeSpy: MockInstance<typeof renderer.ctx.stroke>;
  let ctxRestoreSpy: MockInstance<typeof renderer.ctx.restore>;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  beforeEach(() => {
    renderer = new Renderer(canvas);
    ctxSaveSpy = vi.spyOn(renderer.ctx, 'save');
    ctxMoveToSpy = vi.spyOn(renderer.ctx, 'moveTo');
    ctxLineToSpy = vi.spyOn(renderer.ctx, 'lineTo');
    ctxBeginPathSpy = vi.spyOn(renderer.ctx, 'beginPath');
    ctxClosePathSpy = vi.spyOn(renderer.ctx, 'closePath');
    ctxFillSpy = vi.spyOn(renderer.ctx, 'fill');
    ctxStrokeSpy = vi.spyOn(renderer.ctx, 'stroke');
    ctxRestoreSpy = vi.spyOn(renderer.ctx, 'restore');
  });

  afterEach(() => {
    ctxSaveSpy.mockClear();
    ctxMoveToSpy.mockClear();
    ctxLineToSpy.mockClear();
    ctxBeginPathSpy.mockClear();
    ctxClosePathSpy.mockClear();
    ctxFillSpy.mockClear();
    ctxStrokeSpy.mockClear();
    ctxRestoreSpy.mockClear();
  });

  afterAll(() => {
    ctxSaveSpy.mockRestore();
    ctxMoveToSpy.mockRestore();
    ctxLineToSpy.mockRestore();
    ctxBeginPathSpy.mockRestore();
    ctxClosePathSpy.mockRestore();
    ctxFillSpy.mockRestore();
    ctxStrokeSpy.mockRestore();
    ctxRestoreSpy.mockRestore();
  });

  describe('constructor()', () => {
    let canvasGetContextSpy: MockInstance<typeof HTMLCanvasElement.prototype.getContext>;
    let resetOriginSpy: MockInstance<typeof Renderer.prototype.resetOrigin>;

    beforeAll(() => {
      canvasGetContextSpy = vi.spyOn(canvas, 'getContext');
      resetOriginSpy = vi.spyOn(Renderer.prototype, 'resetOrigin');
    });

    afterEach(() => {
      canvasGetContextSpy.mockClear();
      resetOriginSpy.mockClear();
    });

    afterAll(() => {
      canvasGetContextSpy.mockRestore();
      resetOriginSpy.mockRestore();
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
    let ctxClearRectSpy: MockInstance<typeof renderer.ctx.clearRect>;
    let ctxSetTransformSpy: MockInstance<typeof renderer.ctx.setTransform>;

    beforeAll(() => {
      ctxClearRectSpy = vi.spyOn(renderer.ctx, 'clearRect');
      ctxSetTransformSpy = vi.spyOn(renderer.ctx, 'setTransform');
    });

    beforeEach(() => {
      renderer.clear();
    });

    afterEach(() => {
      ctxClearRectSpy.mockClear();
      ctxSetTransformSpy.mockClear();
    });

    afterAll(() => {
      ctxClearRectSpy.mockRestore();
      ctxSetTransformSpy.mockRestore();
    });

    it('Should reset the canvas transform to top-left-origin', () => {
      expect(ctxSetTransformSpy).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });

    it('Should clear the canvas', () => {
      expect(ctxClearRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('drawCircle()', () => {
    let ctxArcSpy: MockInstance<typeof renderer.ctx.arc>;

    beforeAll(() => {
      ctxArcSpy = vi.spyOn(renderer.ctx, 'arc');
    });

    afterAll(() => {
      ctxArcSpy.mockRestore();
    });

    afterEach(() => {
      ctxArcSpy.mockClear();
    });

    it('Should draw a circle on the canvas', () => {
      renderer.drawCircle({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 64,
      });
      expect(ctxSaveSpy).toHaveBeenCalled();
      expect(ctxBeginPathSpy).toHaveBeenCalled();
      expect(ctxArcSpy).toHaveBeenCalledWith(
        canvas.width / 2,
        canvas.height / 2,
        64,
        0,
        2 * Math.PI,
      );
      expect(ctxClosePathSpy).toHaveBeenCalled();
      expect(ctxRestoreSpy).toHaveBeenCalled();
      expectCallOrder([
        ctxSaveSpy,
        ctxBeginPathSpy,
        ctxArcSpy,
        ctxClosePathSpy,
        ctxRestoreSpy,
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
        expect(ctxFillSpy).toHaveBeenCalled();
        expectCallOrder([
          ctxSaveSpy,
          ctxBeginPathSpy,
          ctxArcSpy,
          ctxClosePathSpy,
          ctxFillSpy,
          ctxRestoreSpy,
        ]);
      });
    });

    describe('When fillColor is not provided', () => {
      it('Should not draw a fill on the circle', () => {
        renderer.drawCircle({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 64,
        });
        expect(ctxFillSpy).not.toHaveBeenCalled();
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
        expect(ctxStrokeSpy).toHaveBeenCalled();
        expectCallOrder([
          ctxSaveSpy,
          ctxBeginPathSpy,
          ctxArcSpy,
          ctxClosePathSpy,
          ctxStrokeSpy,
          ctxRestoreSpy,
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
        expect(ctxStrokeSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('drawBox()', () => {
    const centerX = 100;
    const centerY = 150;
    const width = 200;
    const height = 100;

    let ctxFillRectSpy: MockInstance<typeof renderer.ctx.fillRect>;
    let ctxStrokeRectSpy: MockInstance<typeof renderer.ctx.strokeRect>;

    beforeAll(() => {
      ctxFillRectSpy = vi.spyOn(renderer.ctx, 'fillRect');
      ctxStrokeRectSpy = vi.spyOn(renderer.ctx, 'strokeRect');
    });

    afterEach(() => {
      ctxFillRectSpy.mockClear();
      ctxStrokeRectSpy.mockClear();
    });

    afterAll(() => {
      ctxFillRectSpy.mockRestore();
      ctxStrokeRectSpy.mockRestore();
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
        expect(ctxSaveSpy).toHaveBeenCalled();
        expect(ctxFillRectSpy).toHaveBeenCalledWith(
          centerX - width / 2,
          centerY - height / 2,
          width,
          height,
        );
        expect(ctxRestoreSpy).toHaveBeenCalled();
        expectCallOrder([
          ctxSaveSpy,
          ctxFillRectSpy,
          ctxRestoreSpy,
        ]);
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
        expect(ctxFillRectSpy).not.toHaveBeenCalled();
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
        expect(ctxSaveSpy).toHaveBeenCalled();
        expect(ctxStrokeRectSpy).toHaveBeenCalledWith(
          centerX - width / 2,
          centerY - height / 2,
          width,
          height,
        );
        expect(ctxRestoreSpy).toHaveBeenCalled();
        expectCallOrder([
          ctxSaveSpy,
          ctxStrokeRectSpy,
          ctxRestoreSpy,
        ]);
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
        expect(ctxStrokeRectSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('drawLine()', () => {
    const start = { x: 100, y: 100 };
    const end = { x: 200, y: 200 };
    const lineWidth = 2;

    it('Should draw a line on the canvas', () => {
      renderer.drawLine({
        start,
        end,
        strokeColor,
        lineWidth,
      });
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

  describe('drawShape()', () => {
    describe('When provided valid vertices', () => {
      const vertices = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 },
      ];

      it('Should draw a shape on the canvas', () => {
        renderer.drawShape({ vertices });
        expect(ctxSaveSpy).toHaveBeenCalled();
        expect(ctxBeginPathSpy).toHaveBeenCalled();
        expect(ctxMoveToSpy).toHaveBeenCalledWith(vertices[0]!.x, vertices[0]!.y);
        for (const vertex of vertices.slice(1)) {
          expect(ctxLineToSpy).toHaveBeenCalledWith(vertex.x, vertex.y);
        }
        expect(ctxClosePathSpy).toHaveBeenCalled();
        expect(ctxRestoreSpy).toHaveBeenCalled();
        expectCallOrder([
          ctxSaveSpy,
          ctxBeginPathSpy,
          ctxLineToSpy,
          ctxClosePathSpy,
          ctxRestoreSpy,
        ]);
      });

      describe('When fillColor is provided', () => {
        it('Should draw a shape on the canvas with a fill', () => {
          renderer.drawShape({
            vertices,
            fillColor,
          });
          expect(ctxFillSpy).toHaveBeenCalled();
          expectCallOrder([
            ctxSaveSpy,
            ctxBeginPathSpy,
            ctxLineToSpy,
            ctxClosePathSpy,
            ctxFillSpy,
            ctxRestoreSpy,
          ]);
        });
      });

      describe('When strokeColor is provided', () => {
        it('Should draw a shape on the canvas with a stroke', () => {
          renderer.drawShape({
            vertices,
            strokeColor,
          });

          expect(ctxStrokeSpy).toHaveBeenCalled();
          expectCallOrder([
            ctxSaveSpy,
            ctxBeginPathSpy,
            ctxLineToSpy,
            ctxClosePathSpy,
            ctxStrokeSpy,
            ctxRestoreSpy,
          ]);
        });
      });
    });

    describe('When the first vertex is undefined', () => {
      it('Should throw an error', () => {
        const vertices = [
          undefined,
          { x: 200, y: 100 },
          { x: 200, y: 200 },
          { x: 100, y: 200 },
        ];
        expect(() => {
          renderer.drawShape({ vertices: vertices as { x: number; y: number }[] });
        }).toThrowError('Vertex 0 is undefined');
      });
    });

    describe('When a vertex other than the first is undefined', () => {
      it('Should throw an error', () => {
        const vertices = [
          { x: 100, y: 100 },
          undefined,
          { x: 200, y: 200 },
          { x: 100, y: 200 },
        ];
        expect(() => {
          renderer.drawShape({ vertices: vertices as { x: number; y: number }[] });
        }).toThrowError('Vertex 1 is undefined');
      });
    });

    describe('When not provided vertices', () => {
      it('Should not attempt to draw anything', () => {
        renderer.drawShape({ vertices: [] });
        expect(ctxSaveSpy).not.toHaveBeenCalled();
        expect(ctxBeginPathSpy).not.toHaveBeenCalled();
        expect(ctxMoveToSpy).not.toHaveBeenCalled();
        expect(ctxLineToSpy).not.toHaveBeenCalled();
        expect(ctxClosePathSpy).not.toHaveBeenCalled();
        expect(ctxFillSpy).not.toHaveBeenCalled();
        expect(ctxStrokeSpy).not.toHaveBeenCalled();
        expect(ctxRestoreSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('resetOrigin()', () => {
    let ctxSetTransformSpy: MockInstance<typeof renderer.ctx.setTransform>;
    let ctxTranslateSpy: MockInstance<typeof renderer.ctx.translate>;

    beforeAll(() => {
      ctxSetTransformSpy = vi.spyOn(renderer.ctx, 'setTransform');
      ctxTranslateSpy = vi.spyOn(renderer.ctx, 'translate');
    });

    beforeEach(() => {
      renderer.resetOrigin();
    });

    afterEach(() => {
      ctxSetTransformSpy.mockClear();
      ctxTranslateSpy.mockClear();
    });

    afterAll(() => {
      ctxSetTransformSpy.mockRestore();
      ctxTranslateSpy.mockRestore();
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
      const ctxSaveSpy = vi.spyOn(renderer.ctx, 'save');
      renderer.save();
      expect(ctxSaveSpy).toHaveBeenCalled();
    });
  });

  describe('restore()', () => {
    it('Should restore the previous canvas state', () => {
      const ctxRestoreSpy = vi.spyOn(renderer.ctx, 'restore');
      renderer.restore();
      expect(ctxRestoreSpy).toHaveBeenCalled();
    });
  });

  describe('translate()', () => {
    it('Should translate the canvas origin', () => {
      const ctxTranslateSpy = vi.spyOn(renderer.ctx, 'translate');
      const x = 50;
      const y = 100;
      renderer.translate({ x, y });
      expect(ctxTranslateSpy).toHaveBeenCalledWith(x, y);
    });
  });

  describe('rotate()', () => {
    it('Should rotate the canvas context', () => {
      const ctxRotateSpy = vi.spyOn(renderer.ctx, 'rotate');
      const angle = Math.PI / 4;
      renderer.rotate(angle);
      expect(ctxRotateSpy).toHaveBeenCalledWith(angle);
    });
  });
});
