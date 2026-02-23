import type Renderer from './Renderer';
import type Scene from './Scene';

/**
 * Parameters for creating a Game.
 */
type Params = {
  /** The physics update frequency in hertz (updates per second). */
  physicsHz?: number;
  /** The renderer used for rendering the game. */
  renderer: Renderer;
  /** The scene to be rendered. */
  scene: Scene;
};

/**
 * The Game class manages the main loop, updating the scene and rendering.
 */
export default class Game {
  /** The renderer used for rendering the game. */
  renderer: Renderer;
  /** The scene to be rendered. */
  scene: Scene;
  /** The fixed time step for physics updates. */
  #fixedDeltaTime: number;
  /** The ID of the current animation frame. */
  #frameId: number | null = null;
  /** Indicates whether the game is currently running. */
  #isRunning: boolean = false;
  /** Timestamp of the last frame. */
  #lastFrameTimestamp: number;
  /** Maximum frame time to avoid spiral of death. */
  #maxFrameTime: number;
  /** Accumulated time for physics updates. */
  #timeAccumulator: number;

  /**
   * Creates an instance of the Game class.
   * @param renderer - The renderer used for rendering the game.
   * @param scene - The scene to be rendered.
   * @param physicsHz - The physics update frequency in hertz (updates per second).
   */
  constructor({
    renderer,
    scene,
    physicsHz = 60,
  }: Params) {
    this.renderer = renderer;
    this.scene = scene;
    this.step = this.step.bind(this);
    this.#fixedDeltaTime = 1 / physicsHz;
    this.#maxFrameTime = 0.25;
    this.#timeAccumulator = 0;
    this.#lastFrameTimestamp = performance.now() / 1000;
  }

  /** Indicates whether the game is currently running. */
  get isRunning() {
    return this.#isRunning;
  }

  /**
   * Starts the game loop.
   */
  start() {
    if (this.#isRunning) return;
    this.#isRunning = true;
    this.#timeAccumulator = 0;
    this.#lastFrameTimestamp = performance.now() / 1000;
    this.#frameId = requestAnimationFrame(this.step);
  }

  /**
   * Stops the game loop.
   */
  stop() {
    this.#isRunning = false;
    if (this.#frameId === null) return;
    cancelAnimationFrame(this.#frameId);
    this.#frameId = null;
  }

  /**
   * The main game loop step.
   */
  step() {
    if (!this.#isRunning) return;

    const currentFrameTimestamp = performance.now() / 1000;
    let frameTime = currentFrameTimestamp - this.#lastFrameTimestamp;
    if (frameTime > this.#maxFrameTime) {
      frameTime = this.#maxFrameTime; // avoid spiral of death
    }
    this.#lastFrameTimestamp = currentFrameTimestamp;

    this.#timeAccumulator += frameTime;

    this.scene.executeCommands();
    while (this.#timeAccumulator >= this.#fixedDeltaTime) {
      this.scene.updateHistory();
      this.scene.updatePhysics(this.#fixedDeltaTime);
      this.scene.executeCommands();
      this.#timeAccumulator -= this.#fixedDeltaTime;
    }

    const alpha = this.#timeAccumulator / this.#fixedDeltaTime;
    this.scene.updateRender({ alpha, renderer: this.renderer });

    this.#frameId = requestAnimationFrame(this.step);
  }
}
