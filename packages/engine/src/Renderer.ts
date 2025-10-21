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

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCircle({
    x = 0,
    y = 0,
    radius,
    color,
    strokeColor,
  }: {
    x?: number;
    y?: number;
    radius: number;
    color: string;
    strokeColor?: string;
  }) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  }

  drawBox({
    x = 0,
    y = 0,
    width,
    height,
    color,
    strokeColor,
  }: {
    x?: number;
    y?: number;
    width: number;
    height: number;
    color: string;
    strokeColor?: string;
  }) {
    const topLeftX = x - width / 2;
    const topLeftY = y - height / 2;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(topLeftX, topLeftY, width, height);
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.strokeRect(topLeftX, topLeftY, width, height);
    }
  }

  resetOrigin() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
  }
}
