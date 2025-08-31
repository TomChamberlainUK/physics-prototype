import { describe, expect, it } from 'vitest';
import { Vector2d } from '#/maths';

describe('Vector2d', () => {
  describe('constructor()', () => {
    describe('When passed no arguments', () => {
      it('Should instantiate with default values', () => {
        const vector = new Vector2d();
        expect(vector).toBeInstanceOf(Vector2d);
        expect(vector.x).toBe(0);
        expect(vector.y).toBe(0);
      });
    });

    describe('When passed an object', () => {
      it('Should instantiate with the given values', () => {
        const vector = new Vector2d({ x: 1, y: 2 });
        expect(vector).toBeInstanceOf(Vector2d);
        expect(vector.x).toBe(1);
        expect(vector.y).toBe(2);
      });
    });

    describe('When passed two numbers', () => {
      it('Should instantiate with the given values', () => {
        const vector = new Vector2d(3, 4);
        expect(vector).toBeInstanceOf(Vector2d);
        expect(vector.x).toBe(3);
        expect(vector.y).toBe(4);
      });
    });
  });

  describe('add()', () => {
    it('Should add two vectors correctly', () => {
      const vector1 = new Vector2d(1, 2);
      const vector2 = new Vector2d(3, 4);
      const result = vector1.add(vector2);
      expect(result).toBeInstanceOf(Vector2d);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });
  });

  describe('subtract()', () => {
    it('Should subtract two vectors correctly', () => {
      const vector1 = new Vector2d(5, 7);
      const vector2 = new Vector2d(2, 3);
      const result = vector1.subtract(vector2);
      expect(result).toBeInstanceOf(Vector2d);
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });
  });

  describe('multiply()', () => {
    it('Should multiply a vector by a scalar', () => {
      const vector = new Vector2d(2, 3);
      const scalar = 2;
      const result = vector.multiply(scalar);
      expect(result).toBeInstanceOf(Vector2d);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });
  });

  describe('divide()', () => {
    it('Should divide a vector by a scalar', () => {
      const vector = new Vector2d(6, 8);
      const scalar = 2;
      const result = vector.divide(scalar);
      expect(result).toBeInstanceOf(Vector2d);
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });
  });

  describe('getNormal()', () => {
    it('Should return a vector with the same direction but unit length', () => {
      const vector = new Vector2d(3, 4);
      const normal = vector.getNormal();
      expect(normal).toBeInstanceOf(Vector2d);
      expect(normal.x).toBe(-4);
      expect(normal.y).toBe(3);
    });
  });

  describe('getMagnitude()', () => {
    it('Should return the magnitude of the vector', () => {
      const vector = new Vector2d(3, 4);
      const magnitude = vector.getMagnitude();
      expect(magnitude).toBe(5);
    });
  });

  describe('getMagnitudeSquared()', () => {
    it('Should return the squared magnitude of the vector', () => {
      const vector = new Vector2d(3, 4);
      const magnitudeSquared = vector.getMagnitudeSquared();
      expect(magnitudeSquared).toBe(25);
    });
  });

  describe('getLength()', () => {
    it('Should return the length of the vector', () => {
      const vector = new Vector2d(3, 4);
      const length = vector.getLength();
      expect(length).toBe(5);
    });
  });

  describe('getLengthSquared()', () => {
    it('Should return the squared length of the vector', () => {
      const vector = new Vector2d(3, 4);
      const lengthSquared = vector.getLengthSquared();
      expect(lengthSquared).toBe(25);
    });
  });

  describe('getUnit()', () => {
    it('Should return a unit vector representing the direction', () => {
      const vector = new Vector2d(3, 4);
      const unit = vector.getUnit();
      expect(unit).toBeInstanceOf(Vector2d);
      expect(unit.getMagnitude()).toBeCloseTo(1);
      expect(unit.x).toBe(0.6);
      expect(unit.y).toBe(0.8);
    });

    it('Should return a zero vector when the original vector is zero', () => {
      const vector = new Vector2d(0, 0);
      const unit = vector.getUnit();
      expect(unit).toBeInstanceOf(Vector2d);
      expect(unit.x).toBe(0);
      expect(unit.y).toBe(0);
    });
  });

  describe('static dotProduct()', () => {
    it('Should return the dot product of two vectors', () => {
      const vector1 = new Vector2d(1, 2);
      const vector2 = new Vector2d(3, 4);
      const dotProduct = Vector2d.dotProduct(vector1, vector2);
      expect(dotProduct).toBe(11); // 1*3 + 2*4
    });
  });

  describe('static crossProduct()', () => {
    it('Should return the cross product of two vectors', () => {
      const vector1 = new Vector2d(1, 2);
      const vector2 = new Vector2d(3, 4);
      const crossProduct = Vector2d.crossProduct(vector1, vector2);
      expect(crossProduct).toBe(-2); // 1*4 - 2*3
    });
  });
});
