import { Matrix2d, Vector2d } from '#/maths';
import { describe, expect, it } from 'vitest';

describe('Matrix2d', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const matrix = new Matrix2d();
      expect(matrix).toBeInstanceOf(Matrix2d);
      expect(matrix.elements).toEqual([1, 0, 0, 1, 0, 0]);
    });
  });

  describe('identity()', () => {
    it('Should return an identity matrix', () => {
      const matrix = Matrix2d.identity();
      expect(matrix.elements).toEqual([1, 0, 0, 1, 0, 0]);
    });
  });

  describe('translation()', () => {
    it('Should return a translation matrix', () => {
      const position = new Vector2d({ x: 10, y: 20 });
      const matrix = Matrix2d.translation(position);
      expect(matrix.elements).toEqual([1, 0, 0, 1, position.x, position.y]);
    });
  });

  describe('rotation()', () => {
    it('Should return a rotation matrix', () => {
      const angle = Math.PI / 2; // 90 degrees
      const matrix = Matrix2d.rotation(angle);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      expect(matrix.elements).toEqual([cos, sin, -sin, cos, 0, 0]);
    });
  });

  describe('scaling()', () => {
    it('Should return a scaling matrix', () => {
      const scale = new Vector2d({ x: 2, y: 3 });
      const matrix = Matrix2d.scaling(scale);
      expect(matrix.elements).toEqual([scale.x, 0, 0, scale.y, 0, 0]);
    });
  });

  describe('multiply()', () => {
    it('Should multiply two matrices', () => {
      const position = new Vector2d({ x: 2, y: 3 });
      const translation = Matrix2d.translation(position);
      const rotation = Matrix2d.rotation(Math.PI / 2);
      const result = Matrix2d.multiply(translation, rotation);
      const cos = Math.cos(Math.PI / 2);
      const sin = Math.sin(Math.PI / 2);
      const expected = [cos, sin, -sin, cos, position.x, position.y];
      expect(result.elements).toEqual(expected);
    });
  });

  describe('transformPoint()', () => {
    it('Should transform a point using the matrix', () => {
      const position = new Vector2d({ x: 10, y: 20 });
      const matrix = Matrix2d.translation(position);
      const point = new Vector2d({ x: 1, y: 0 });
      const transformedPoint = matrix.transformPoint(point);
      expect(transformedPoint).toEqual({ x: point.x + position.x, y: point.y + position.y });
    });
  });
});
