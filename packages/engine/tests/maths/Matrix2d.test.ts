import { Matrix2d } from '#/maths';
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
      const matrix = Matrix2d.translation({ x: 10, y: 20 });
      expect(matrix.elements).toEqual([1, 0, 0, 1, 10, 20]);
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
      const matrix = Matrix2d.scaling({ x: 2, y: 3 });
      expect(matrix.elements).toEqual([2, 0, 0, 3, 0, 0]);
    });
  });

  describe('multiply()', () => {
    it('Should multiply two matrices', () => {
      const translation = Matrix2d.translation({ x: 2, y: 3 });
      const rotation = Matrix2d.rotation(Math.PI / 2);
      const result = Matrix2d.multiply(translation, rotation);
      const cos = Math.cos(Math.PI / 2);
      const sin = Math.sin(Math.PI / 2);
      const expected = [cos, sin, -sin, cos, 2, 3];
      expect(result.elements).toEqual(expected);
    });
  });

  describe('transformPoint()', () => {
    it('Should transform a point using the matrix', () => {
      const matrix = Matrix2d.translation({ x: 10, y: 20 });
      const point = { x: 1, y: 0 };
      const transformedPoint = matrix.transformPoint(point);
      expect(transformedPoint).toEqual({ x: 11, y: 20 });
    });
  });
});
