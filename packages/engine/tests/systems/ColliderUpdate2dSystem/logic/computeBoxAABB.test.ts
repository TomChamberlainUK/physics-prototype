import { beforeEach, describe, expect, it } from 'vitest';
import { Vector2d } from '#/maths';
import { computeBoxAABB } from '#/systems/ColliderUpdate2dSystem/logic';

describe('computeBoxAABB', () => {
  let width: number;
  let height: number;
  let halfWidth: number;
  let halfHeight: number;
  let position: Vector2d;
  let rotation: number;

  beforeEach(() => {
    width = 32;
    height = 16;
    halfWidth = width / 2;
    halfHeight = height / 2;
    position = new Vector2d({ x: 0, y: 0 });
    rotation = 0;
  });

  it('Should return an AABB for a box', () => {
    const aabb = computeBoxAABB({ width, height, position, rotation });
    const expectedAABB = {
      min: { x: -halfWidth, y: -halfHeight },
      max: { x: halfWidth, y: halfHeight },
    };
    expect(aabb).toEqual(expectedAABB);
  });

  it('Should return an AABB for a translated box', () => {
    position = new Vector2d({ x: 100, y: 50 });
    const aabb = computeBoxAABB({ width, height, position, rotation });
    const expectedAABB = {
      min: { x: position.x - halfWidth, y: position.y - halfHeight },
      max: { x: position.x + halfWidth, y: position.y + halfHeight },
    };
    expect(aabb).toEqual(expectedAABB);
  });

  it('Should return an AABB for a rotated box', () => {
    rotation = Math.PI / 4; // 45 degrees
    const aabb = computeBoxAABB({ width, height, position, rotation });

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ].map(corner => ({
      x: corner.x * cos - corner.y * sin,
      y: corner.x * sin + corner.y * cos,
    }));

    const xs = corners.map(corner => corner.x);
    const ys = corners.map(corner => corner.y);

    const expectedAABB = {
      min: {
        x: Math.min(...xs),
        y: Math.min(...ys),
      },
      max: {
        x: Math.max(...xs),
        y: Math.max(...ys),
      },
    };

    expect(aabb).toEqual(expectedAABB);
  });

  it('Should return an AABB for a translated and rotated box', () => {
    position = new Vector2d({ x: 100, y: 50 });
    rotation = Math.PI / 4; // 45 degrees
    const aabb = computeBoxAABB({ width, height, position, rotation });

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ].map(corner => ({
      x: corner.x * cos - corner.y * sin + position.x,
      y: corner.x * sin + corner.y * cos + position.y,
    }));

    const xs = corners.map(corner => corner.x);
    const ys = corners.map(corner => corner.y);

    const expectedAABB = {
      min: {
        x: Math.min(...xs),
        y: Math.min(...ys),
      },
      max: {
        x: Math.max(...xs),
        y: Math.max(...ys),
      },
    };

    expect(aabb).toEqual(expectedAABB);
  });
});
