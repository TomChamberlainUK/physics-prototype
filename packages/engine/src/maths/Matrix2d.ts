import Vector2d from './Vector2d';

/**
 * A class representing a 2D transformation matrix.
 * The matrix is represented in the form:
 * [ a c e ]
 * [ b d f ]
 * [ 0 0 1 ]
 */
export default class Matrix2d {
  /**
   * The elements of the matrix in a flat array.
   * @remarks
   * The elements are stored in the order: [a, b, c, d, e, f] corresponding to the matrix:
   * [ a c e ]
   * [ b d f ]
   * [ 0 0 1 ]
   */
  elements: [number, number, number, number, number, number];

  /**
   * Creates a new Matrix2d instance.
   * @param a - Element at row 1, column 1 (default is 1).
   * @param b - Element at row 2, column 1 (default is 0).
   * @param c - Element at row 1, column 2 (default is 0).
   * @param d - Element at row 2, column 2 (default is 1).
   * @param e - Element at row 1, column 3 (default is 0).
   * @param f - Element at row 2, column 3 (default is 0).
   */
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this.elements = [a, b, c, d, e, f];
  }

  /**
   * Creates an identity matrix.
   * @returns A new identity matrix.
   */
  static identity() {
    return new Matrix2d();
  }

  /**
   * Creates a translation matrix.
   * @param position - The x and y translation values, see {@link Vector2d}.
   * @returns A new translation matrix.
   */
  static translation({ x, y }: Vector2d) {
    return new Matrix2d(1, 0, 0, 1, x, y);
  }

  /**
   * Creates a rotation matrix.
   * @param angle - Rotation angle in radians.
   * @returns A new rotation matrix.
   */
  static rotation(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Matrix2d(cos, sin, -sin, cos, 0, 0);
  }

  /**
   * Creates a scaling matrix.
   * @param scale - The x and y scaling factors, see {@link Vector2d}.
   * @returns A new scaling matrix.
   */
  static scaling({ x, y }: Vector2d) {
    return new Matrix2d(x, 0, 0, y, 0, 0);
  }

  /**
   * Multiplies two matrices.
   * @param matrixA - The first matrix.
   * @param matrixB - The second matrix.
   * @returns A new matrix that is the result of the multiplication.
   */
  static multiply(matrixA: Matrix2d, matrixB: Matrix2d): Matrix2d {
    const [a1, b1, c1, d1, e1, f1] = matrixA.elements;
    const [a2, b2, c2, d2, e2, f2] = matrixB.elements;
    return new Matrix2d(
      (a1 * a2) + (c1 * b2),
      (b1 * a2) + (d1 * b2),
      (a1 * c2) + (c1 * d2),
      (b1 * c2) + (d1 * d2),
      (a1 * e2) + (c1 * f2) + e1,
      (b1 * e2) + (d1 * f2) + f1,
    );
  }

  /**
   * Transforms a point using the matrix.
   * @param point - The point to transform, see {@link Vector2d}.
   * @returns The transformed point.
   */
  transformPoint({ x, y }: Vector2d) {
    const [a, b, c, d, e, f] = this.elements;
    return new Vector2d({
      x: (a * x) + (c * y) + e,
      y: (b * x) + (d * y) + f,
    });
  }
}
