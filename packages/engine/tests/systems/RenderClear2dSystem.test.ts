import Renderer from '#/Renderer';
import { RenderClear2dSystem } from '#/systems';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RenderClear2dSystem', () => {
  let canvas: HTMLCanvasElement;
  let renderer: Renderer;
  let system: RenderClear2dSystem;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  beforeEach(() => {
    renderer = new Renderer(canvas);
    system = new RenderClear2dSystem();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(system).toBeInstanceOf(RenderClear2dSystem);
      expect(system.type).toBe('render');
    });
  });

  describe('update()', () => {
    it('Should clear the renderer', () => {
      const clearSpy = vi.spyOn(renderer, 'clear');
      system.update([], { renderer });
      expect(clearSpy).toHaveBeenCalled();
    });

    it('Should reset the renderer origin', () => {
      const resetOriginSpy = vi.spyOn(renderer, 'resetOrigin');
      system.update([], { renderer });
      expect(resetOriginSpy).toHaveBeenCalled();
    });
  });
});
