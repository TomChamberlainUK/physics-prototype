import { Game, Renderer } from 'engine';
import { SandboxScene } from './scenes';

type Params = {
  canvas: HTMLCanvasElement;
};

export default class SandboxGame extends Game {
  constructor({ canvas }: Params) {
    const renderer = new Renderer(canvas);

    const scene = new SandboxScene({
      height: canvas.height,
      width: canvas.width,
    });

    super({
      renderer,
      scene,
      physicsHz: 120,
    });
  }
}
