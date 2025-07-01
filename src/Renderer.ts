export default class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas rendering context');
    }

    this.canvas = canvas;
    this.ctx = ctx;
  }
}
