import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Game from '#src/Game.js';
import Renderer from '#src/Renderer.js';
import Scene from '#src/Scene.js';
import { expectCallOrder } from './utils/index.js';

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
    let requestAnimationFrameSpy: MockInstance<typeof requestAnimationFrame>;
    let sceneExecuteCommandsSpy: MockInstance<typeof scene.executeCommands>;
    let sceneUpdateHistorySpy: MockInstance<typeof scene.updateHistory>;
    let sceneUpdatePhysicsSpy: MockInstance<typeof scene.updatePhysics>;
    let sceneUpdateRenderSpy: MockInstance<typeof scene.updateRender>;

    beforeAll(() => {
      requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
      sceneExecuteCommandsSpy = vi.spyOn(scene, 'executeCommands');
      sceneUpdateHistorySpy = vi.spyOn(scene, 'updateHistory');
      sceneUpdatePhysicsSpy = vi.spyOn(scene, 'updatePhysics');
      sceneUpdateRenderSpy = vi.spyOn(scene, 'updateRender');
    });

    afterEach(() => {
      requestAnimationFrameSpy.mockClear();
      sceneExecuteCommandsSpy.mockClear();
      sceneUpdateHistorySpy.mockClear();
      sceneUpdatePhysicsSpy.mockClear();
      sceneUpdateRenderSpy.mockClear();
    });

    afterAll(() => {
      requestAnimationFrameSpy.mockRestore();
      sceneExecuteCommandsSpy.mockRestore();
      sceneUpdateHistorySpy.mockRestore();
      sceneUpdatePhysicsSpy.mockRestore();
      sceneUpdateRenderSpy.mockRestore();
    });

    describe('When the game is running', () => {
      const physicsHz = 60;
      const fixedDelta = 1 / physicsHz;

      let performanceNowSpy: MockInstance<typeof performance.now>;

      beforeAll(() => {
        performanceNowSpy = vi.spyOn(performance, 'now');
      });

      beforeEach(() => {
        game = new Game({
          renderer,
          scene,
          physicsHz,
        });
        performanceNowSpy.mockReturnValueOnce(0);
        game.start();
        requestAnimationFrameSpy.mockClear();
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('Should update the scene sync systems', () => {
        game.step();
        expect(sceneUpdateHistorySpy).toHaveBeenCalled();
      });

      it('Should update the scene physics systems when enough time has passed', () => {
        performanceNowSpy.mockReturnValueOnce(fixedDelta * 1000);
        game.step();
        expect(sceneUpdatePhysicsSpy).toHaveBeenCalled();
      });

      it('Should update the scene physics systems multiple times if enough time has passed', () => {
        performanceNowSpy.mockReturnValueOnce(fixedDelta * 3 * 1000);
        game.step();
        expect(sceneUpdatePhysicsSpy).toHaveBeenCalledTimes(3);
      });

      it('Should execute the scene commands after each sync and physics update', () => {
        performanceNowSpy.mockReturnValueOnce(fixedDelta * 3 * 1000);
        game.step();
        expectCallOrder([
          sceneExecuteCommandsSpy,
          sceneUpdateHistorySpy,
          sceneUpdatePhysicsSpy,
          sceneExecuteCommandsSpy,
          sceneUpdateHistorySpy,
          sceneUpdatePhysicsSpy,
          sceneExecuteCommandsSpy,
          sceneUpdateHistorySpy,
          sceneUpdatePhysicsSpy,
          sceneExecuteCommandsSpy,
        ]);
      });

      it('Should not update the scene physics systems when not enough time has passed', () => {
        performanceNowSpy.mockReturnValueOnce(0);
        game.step();
        expect(sceneUpdatePhysicsSpy).not.toHaveBeenCalled();
      });

      it('Should update the scene render systems', () => {
        const accumulatedTime = fixedDelta / 2;
        const expectedAlpha = accumulatedTime / fixedDelta;
        performanceNowSpy.mockReturnValueOnce(accumulatedTime * 1000);
        game.step();
        expect(sceneUpdateRenderSpy).toHaveBeenCalledWith({ alpha: expectedAlpha, renderer });
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

      it('Should not update the scene sync systems', () => {
        game.step();
        expect(sceneUpdateHistorySpy).not.toHaveBeenCalled();
      });

      it('Should not update the scene physics systems', () => {
        game.step();
        expect(sceneUpdatePhysicsSpy).not.toHaveBeenCalled();
      });

      it('Should not update the scene render systems', () => {
        game.step();
        expect(sceneUpdateRenderSpy).not.toHaveBeenCalled();
      });

      it('Should not recursively call itself every frame', () => {
        game.step();
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
      });
    });
  });
});
