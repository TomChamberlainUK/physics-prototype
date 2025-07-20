import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Game from '#/Game';
import Renderer from '#/Renderer';
import Scene from '#/Scene';

describe('Game', () => {
  let canvas: HTMLCanvasElement;
  let renderer: Renderer;
  let scene: Scene;
  let game: Game;

  beforeAll(() => {
    canvas = document.createElement('canvas');
    renderer = new Renderer(canvas);
    scene = new Scene();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      game = new Game({
        renderer,
        scene,
      });
      expect(game).toBeInstanceOf(Game);
      expect(game.renderer).toBe(renderer);
      expect(game.scene).toBe(scene);
    });
  });

  describe('start()', () => {
    let requestAnimationFrameSpy: MockInstance<typeof requestAnimationFrame>;

    beforeAll(() => {
      requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    describe('When the game is not running', () => {
      beforeEach(() => {
        game = new Game({
          renderer,
          scene,
        });
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('Should set the game state to running', () => {
        game.start();
        expect(game.isRunning).toBe(true);
      });

      it('Should start the game loop', () => {
        game.start();
        expect(requestAnimationFrameSpy).toHaveBeenCalledWith(game.step);
      });
    });

    describe('When the game is already running', () => {
      beforeEach(() => {
        game = new Game({
          renderer,
          scene,
        });
        game.start();
        requestAnimationFrameSpy.mockClear();
      });

      it('Should not start a new game loop', () => {
        game.start();
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('stop()', () => {
    let cancelAnimationFrameSpy: MockInstance<typeof cancelAnimationFrame>;
    let requestAnimationFrameSpy: MockInstance<typeof requestAnimationFrame>;

    beforeAll(() => {
      cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
      requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    });

    beforeEach(() => {
      game = new Game({
        renderer,
        scene,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('Should set the game state to not running', () => {
      game.start();
      game.stop();
      expect(game.isRunning).toBe(false);
    });

    it('Should cancel the animation frame', () => {
      const frameId = 123;
      requestAnimationFrameSpy.mockReturnValue(frameId);
      game.start();
      game.stop();
      expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(frameId);
    });
  });

  describe('step()', () => {
    let sceneUpdateSpy: MockInstance<typeof scene.update>;
    let rendererRenderSpy: MockInstance<typeof renderer.render>;
    let requestAnimationFrameSpy: MockInstance<typeof requestAnimationFrame>;

    beforeAll(() => {
      requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
      sceneUpdateSpy = vi.spyOn(scene, 'update');
      rendererRenderSpy = vi.spyOn(renderer, 'render');
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    describe('When the game is running', () => {
      beforeEach(() => {
        game = new Game({
          renderer,
          scene,
        });
        game.start();
        requestAnimationFrameSpy.mockClear();
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('Should update the scene', () => {
        game.step();
        expect(sceneUpdateSpy).toHaveBeenCalled();
      });

      it('Should render the scene', () => {
        game.step();
        expect(rendererRenderSpy).toHaveBeenCalledWith(scene);
      });

      it('Should recursively call itself every frame', () => {
        game.step();
        expect(requestAnimationFrameSpy).toHaveBeenCalledWith(game.step);
      });
    });

    describe('When the game is not running', () => {
      beforeEach(() => {
        game = new Game({
          renderer,
          scene,
        });
      });

      it('Should not update the scene', () => {
        game.step();
        expect(sceneUpdateSpy).not.toHaveBeenCalled();
      });

      it('Should not render the scene', () => {
        game.step();
        expect(rendererRenderSpy).not.toHaveBeenCalled();
      });

      it('Should not recursively call itself every frame', () => {
        game.step();
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });
    });
  });
});
