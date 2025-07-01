export default class Renderer {
  constructor(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.getContext('2d');
  }
}
