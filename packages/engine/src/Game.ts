import type Renderer from './Renderer';
import type Scene from './Scene';

type Props = {
  physicsHz?: number;
  renderer: Renderer;
  scene: Scene;
};

export default class Game {
  renderer: Renderer;
  scene: Scene;
  #fixedDeltaTime: number;
  #frameId: number | null = null;
  #isRunning: boolean = false;
  #lastFrameTimestamp: number;
  #maxFrameTime: number;
  #timeAccumulator: number;

  constructor({
    renderer,
    scene,
    physicsHz = 60,
  }: Props) {
    this.renderer = renderer;
    this.scene = scene;
    this.step = this.step.bind(this);
    this.#fixedDeltaTime = 1 / physicsHz;
    this.#maxFrameTime = 0.25;
    this.#timeAccumulator = 0;
    this.#lastFrameTimestamp = performance.now() / 1000;
  }

  get isRunning() {
    return this.#isRunning;
  }

  start() {
    if (this.#isRunning) return;
    this.#isRunning = true;
    this.#timeAccumulator = 0;
    this.#lastFrameTimestamp = performance.now() / 1000;
    this.#frameId = requestAnimationFrame(this.step);
  }

  stop() {
    this.#isRunning = false;
    if (this.#frameId === null) return;
    cancelAnimationFrame(this.#frameId);
    this.#frameId = null;
  }

  step() {
    if (!this.#isRunning) return;

    const currentFrameTimestamp = performance.now() / 1000;
    let frameTime = currentFrameTimestamp - this.#lastFrameTimestamp;
    if (frameTime > this.#maxFrameTime) {
      frameTime = this.#maxFrameTime; // avoid spiral of death
    }
    this.#lastFrameTimestamp = currentFrameTimestamp;

    this.#timeAccumulator += frameTime;

    this.scene.updateRender();

    while (this.#timeAccumulator >= this.#fixedDeltaTime) {
      this.scene.updatePhysics(this.#fixedDeltaTime);
      this.#timeAccumulator -= this.#fixedDeltaTime;
    }

    const alpha = this.#timeAccumulator / this.#fixedDeltaTime;

    this.renderer.render(this.scene, alpha);
    this.#frameId = requestAnimationFrame(this.step);
  }
}
