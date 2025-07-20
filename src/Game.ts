import type Renderer from './Renderer';
import type Scene from './Scene';

type Props = {
  renderer: Renderer;
  scene: Scene;
};

export default class Game {
  renderer: Renderer;
  scene: Scene;
  isRunning: boolean = false;
  #frameId: number | null = null;

  constructor({ renderer, scene }: Props) {
    this.renderer = renderer;
    this.scene = scene;
    this.step = this.step.bind(this);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.#frameId = requestAnimationFrame(this.step);
  }

  stop() {
    this.isRunning = false;
    if (this.#frameId === null) {
      return;
    }
    cancelAnimationFrame(this.#frameId);
    this.#frameId = null;
  }

  step() {
    if (!this.isRunning) return;
    this.scene.update();
    this.renderer.render(this.scene);
    this.#frameId = requestAnimationFrame(this.step);
  }
}
