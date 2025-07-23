type Props = {
  x: number;
  y: number;
};

export default class Vector2d {
  x: number = 0;
  y: number = 0;

  constructor();
  constructor({ x, y }: Props);
  constructor(x: number, y: number);
  constructor(arg1?: Props | number, arg2?: number) {
    if (typeof arg1 === 'object') {
      this.x = arg1.x;
      this.y = arg1.y;
    }
    else if (
      typeof arg1 === 'number'
      && typeof arg2 === 'number'
    ) {
      this.x = arg1;
      this.y = arg2;
    }
  }

  add({ x, y }: Vector2d): Vector2d {
    return new Vector2d(this.x + x, this.y + y);
  }

  subtract({ x, y }: Vector2d): Vector2d {
    return new Vector2d(this.x - x, this.y - y);
  }

  multiply(scalar: number): Vector2d {
    return new Vector2d(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2d {
    return new Vector2d(this.x / scalar, this.y / scalar);
  }

  getNormal(): Vector2d {
    return new Vector2d(-this.y, this.x);
  }

  getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  getMagnitudeSquared(): number {
    return this.x ** 2 + this.y ** 2;
  }

  getLength(): number {
    return this.getMagnitude();
  }

  getLengthSquared(): number {
    return this.getMagnitudeSquared();
  }

  static dotProduct(
    vector1: Vector2d,
    vector2: Vector2d,
  ): number {
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
  }

  static crossProduct(
    vector1: Vector2d,
    vector2: Vector2d,
  ): number {
    return (vector1.x * vector2.y) - (vector1.y * vector2.x);
  }
}
