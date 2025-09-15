import type { Geometry2dComponent, Transform2dComponent } from './components';
import type Scene from './Scene';

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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCircle({
    x = 0,
    y = 0,
    radius,
    color,
  }: {
    x?: number;
    y?: number;
    radius: number;
    color: string;
  }) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawBox({
    x = 0,
    y = 0,
    width,
    height,
    color,
  }: {
    x?: number;
    y?: number;
    width: number;
    height: number;
    color: string;
  }) {
    const topLeftX = x - width / 2;
    const topLeftY = y - height / 2;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(topLeftX, topLeftY, width, height);
  }

  render(scene: Scene, alpha: number) {
    this.clear();
    for (const entity of scene.entities) {
      if (!entity.hasComponents(['Transform2d', 'Geometry2d'])) {
        continue;
      }

      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const geometry = entity.getComponent<Geometry2dComponent>('Geometry2d');

      const x = transform.previousPosition.x + (transform.position.x - transform.previousPosition.x) * alpha;
      const y = transform.previousPosition.y + (transform.position.y - transform.previousPosition.y) * alpha;

      switch (geometry.shape.type) {
        case 'circle':
          this.drawCircle({
            x,
            y,
            radius: geometry.shape.radius,
            color: geometry.color,
          });
          break;
        case 'box':
          this.drawBox({
            x,
            y,
            width: geometry.shape.width,
            height: geometry.shape.height,
            color: geometry.color,
          });
          break;
      }
    }
  }
}
