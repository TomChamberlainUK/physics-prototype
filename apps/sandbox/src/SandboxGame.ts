import { Game, KeyboardInput, Renderer } from 'engine';
import { SandboxScene } from './scenes';

type Params = {
  canvas: HTMLCanvasElement;
};

export default class SandboxGame extends Game {
  constructor({ canvas }: Params) {
    const renderer = new Renderer(canvas);

    const input = new KeyboardInput();
    input.enable();

    const scene = new SandboxScene({
      input,
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
