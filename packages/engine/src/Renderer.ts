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
    this.ctx.save();
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
    this.ctx.restore();
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
    this.ctx.save();
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
    this.ctx.restore();
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
   * Draws a shape defined by a list of vertices on the canvas.
   * @param vertices - The vertices of the shape to draw.
   * @param fillColor - The fill color of the shape (optional).
   * @param strokeColor - The stroke color of the shape (optional).
   */
  drawShape({
    vertices,
    fillColor,
    strokeColor,
  }: {
    /** The vertices of the shape to draw. */
    vertices: { x: number; y: number }[];
    /** The fill color of the shape (optional). */
    fillColor?: string;
    /** The stroke color of the shape (optional). */
    strokeColor?: string;
  }) {
    if (vertices.length === 0) {
      return;
    }

    if (!vertices[0]) {
      throw new Error('Vertex 0 is undefined');
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      const vertex = vertices[i];
      if (!vertex) {
        throw new Error(`Vertex ${i} is undefined`);
      }
      this.ctx.lineTo(vertex.x, vertex.y);
    }
    this.ctx.closePath();
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  /**
   * Resets the origin of the canvas to the center.
   */
  resetOrigin() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
  }

  /**
   * Saves the current state of the canvas context.
   */
  save() {
    this.ctx.save();
  }

  /**
   * Restores the last saved state of the canvas context.
   */
  restore() {
    this.ctx.restore();
  }

  /**
   * Translates the canvas context by the given vector.
   * @param x - The x-component of the translation vector.
   * @param y - The y-component of the translation vector.
   */
  translate({ x, y }: { x: number; y: number }) {
    this.ctx.translate(x, y);
  }

  /**
   * Rotates the canvas context by the given angle.
   * @param angle - The angle in radians to rotate the context.
   */
  rotate(angle: number) {
    this.ctx.rotate(angle);
  }
}
