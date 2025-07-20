import type { Geometry2dComponent, Transform2dComponent } from './components';
import type Scene from './Scene';

type DrawCircleProps = {
  x?: number;
  y?: number;
  radius: number;
  color: string;
};

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
  }: DrawCircleProps) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  render(scene: Scene) {
    this.clear();
    for (const entity of scene.entities) {
      if (!entity.hasComponent('Transform2d') || !entity.hasComponent('Geometry2d')) {
        continue;
      }

      const transform = entity.getComponent<Transform2dComponent>('Transform2d');
      const geometry = entity.getComponent<Geometry2dComponent>('Geometry2d');

      this.drawCircle({
        x: transform.position.x,
        y: transform.position.y,
        radius: geometry.radius,
        color: geometry.color,
      });
    }
  }
}
