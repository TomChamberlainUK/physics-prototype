/**
 * Parameters for creating a Vector2d instance.
 */
type Params = {
  /** The x component of the vector. */
  x: number;
  /** The y component of the vector. */
  y: number;
};

/**
 * A 2D vector class for mathematical operations in two-dimensional space.
 */
export default class Vector2d {
  /** The x component of the vector. */
  x: number = 0;
  /** The y component of the vector. */
  y: number = 0;

  /**
   * Creates an instance of the Vector2d class.
   */
  constructor();
  /**
   * Creates an instance of the Vector2d class.
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  constructor({ x, y }: Params);
  /**
   * Creates an instance of the Vector2d class.
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  constructor(x: number, y: number);
  constructor(arg1?: Params | number, arg2?: number) {
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

  /**
   * Adds two vectors.
   * @param x - The x component of the vector to add.
   * @param y - The y component of the vector to add.
   * @returns A new Vector2d instance representing the sum of the two vectors.
   */
  add({ x, y }: Vector2d): Vector2d {
    return new Vector2d(this.x + x, this.y + y);
  }

  /**
   * Subtracts two vectors.
   * @param x - The x component of the vector to subtract.
   * @param y - The y component of the vector to subtract.
   * @returns A new Vector2d instance representing the difference of the two vectors.
   */
  subtract({ x, y }: Vector2d): Vector2d {
    return new Vector2d(this.x - x, this.y - y);
  }

  /**
   * Multiplies the vector by a scalar.
   * @param scalar - The scalar value to multiply the vector by.
   * @returns A new Vector2d instance representing the scaled vector.
   */
  multiply(scalar: number): Vector2d {
    return new Vector2d(this.x * scalar, this.y * scalar);
  }

  /**
   * Divides the vector by a scalar.
   * @param scalar - The scalar value to divide the vector by.
   * @returns A new Vector2d instance representing the divided vector.
   */
  divide(scalar: number): Vector2d {
    return new Vector2d(this.x / scalar, this.y / scalar);
  }

  /**
   * Returns the normal vector (perpendicular) to the current vector.
   * @returns A new Vector2d instance representing the normal vector.
   */
  getNormal(): Vector2d {
    return new Vector2d(-this.y, this.x);
  }

  /**
   * Calculates the magnitude (length) of the vector.
   * @see {@link getMagnitude}
   * @remarks
   * This involves computing the square root, which can be computationally expensive.
   * Consider using {@link getMagnitudeSquared} for performance-sensitive calculations.
   * @returns The magnitude of the vector.
   */
  getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Calculates the squared magnitude (length) of the vector.
   * @see {@link getLengthSquared}
   * @returns The squared magnitude of the vector.
   */
  getMagnitudeSquared(): number {
    return this.x ** 2 + this.y ** 2;
  }

  /**
   * Calculates the length (magnitude) of the vector.
   * @see {@link getMagnitude}
   * @remarks
   * This involves computing the square root, which can be computationally expensive.
   * Consider using {@link getLengthSquared} for performance-sensitive calculations.
   * @returns The length of the vector.
   */
  getLength(): number {
    return this.getMagnitude();
  }

  /**
   * Calculates the squared length (magnitude) of the vector.
   * @see {@link getMagnitudeSquared}
   * @returns The squared length of the vector.
   */
  getLengthSquared(): number {
    return this.getMagnitudeSquared();
  }

  /**
   * Returns the unit vector (normalized vector) in the same direction as the current vector.
   * @remarks
   * This involves computing the square root, which can be computationally expensive.
   * @returns A new Vector2d instance representing the unit vector.
   */
  getUnit(): Vector2d {
    const magnitude = this.getMagnitude();
    if (magnitude === 0) {
      return new Vector2d();
    }
    return this.divide(magnitude);
  }

  /**
   * Calculates the dot product of two vectors.
   * @param vector1 - The first vector.
   * @param vector2 - The second vector.
   * @returns The dot product of the two vectors.
   */
  static dotProduct(
    vector1: Vector2d,
    vector2: Vector2d,
  ): number {
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
  }

  /**
   * Calculates the cross product of two vectors.
   * @param vector1 - The first vector.
   * @param vector2 - The second vector.
   * @returns The cross product of the two vectors.
   */
  static crossProduct(
    vector1: Vector2d,
    vector2: Vector2d,
  ): number {
    return (vector1.x * vector2.y) - (vector1.y * vector2.x);
  }
}
