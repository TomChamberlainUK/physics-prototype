/**
 * The Renderer class is responsible for drawing shapes on an HTML canvas.
 */
export default class Renderer {
  /** The HTML canvas element. */
  canvas: HTMLCanvasElement;
  /** The 2D rendering context of the canvas. */
  ctx: CanvasRenderingContext2D;

  /**
   * Creates an instance of the Renderer class.
   * @param canvas - The HTML canvas element to render on.
   * @throws Error if the rendering context cannot be obtained.
   */
  constructor(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas rendering context');
    }

    this.canvas = canvas;
    this.ctx = ctx;

    this.resetOrigin();
  }

  /**
   * Clears the entire canvas.
   */
  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws a circle on the canvas.
   * @param x - The x-coordinate of the circle's center.
   * @param y - The y-coordinate of the circle's center.
   * @param radius - The radius of the circle.
   * @param fillColor - The fill color of the circle (optional).
   * @param strokeColor - The stroke color of the circle (optional).
   */
  drawCircle({
    x = 0,
    y = 0,
    radius,
    fillColor,
    strokeColor,
  }: {
    /** The x-coordinate of the circle's center. */
    x?: number;
    /** The y-coordinate of the circle's center. */
    y?: number;
    /** The radius of the circle. */
    radius: number;
    /** The fill color of the circle (optional). */
    fillColor?: string;
    /** The stroke color of the circle (optional). */
    strokeColor?: string;
  }) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  }

  /**
   * Draws a rectangle on the canvas.
   * @param x - The x-coordinate of the rectangle's top-left corner.
   * @param y - The y-coordinate of the rectangle's top-left corner.
   * @param width - The width of the rectangle.
   * @param height - The height of the rectangle.
   * @param fillColor - The fill color of the rectangle (optional).
   * @param strokeColor - The stroke color of the rectangle (optional).
   */
  drawBox({
    /** The x-coordinate of the rectangle's center. */
    x = 0,
    /** The y-coordinate of the rectangle's center. */
    y = 0,
    /** The width of the rectangle. */
    width,
    /** The height of the rectangle. */
    height,
    /** The fill color of the rectangle (optional). */
    fillColor,
    /** The stroke color of the rectangle (optional). */
    strokeColor,
  }: {
    x?: number;
    y?: number;
    width: number;
    height: number;
    fillColor?: string;
    strokeColor?: string;
  }) {
    const topLeftX = x - width / 2;
    const topLeftY = y - height / 2;
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fillRect(topLeftX, topLeftY, width, height);
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.strokeRect(topLeftX, topLeftY, width, height);
    }
  }

  /**
   * Draws a line on the canvas.
   * @param start - The starting point of the line.
   * @param end - The ending point of the line.
   * @param strokeColor - The stroke color of the line.
   * @param lineWidth - The width of the line (default is 1).
   */
  drawLine({
    start,
    end,
    strokeColor,
    lineWidth = 1,
  }: {
    /** The starting point of the line. */
    start: { x: number; y: number };
    /** The ending point of the line. */
    end: { x: number; y: number };
    /** The stroke color of the line. */
    strokeColor: string;
    /** The width of the line (default is 1). */
    lineWidth?: number;
  }) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   * Resets the origin of the canvas to the center.
   */
  resetOrigin() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
  }
}
