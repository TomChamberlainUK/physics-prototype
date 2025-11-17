import { Matrix2d } from '#/maths';

/**
 * Parameters required to calculate the AABB for a box.
 */
type Parameters = {
  /** The width of the box. */
  width: number;
  /** The height of the box. */
  height: number;
  /** The position of the box's center. */
  position: {
    x: number;
    y: number;
  };
  /** The rotation of the box in radians. */
  rotation: number;
};

/**
 * Calculates and returns the axis-aligned bounding box (AABB) for a box.
 * @param width - The width of the box.
 * @param height - The height of the box.
 * @param position - The position of the box's center.
 * @param rotation - The rotation of the box in radians.
 * @returns The calculated AABB.
 */
export default function getBoxAABB({ width, height, position, rotation }: Parameters) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const translationMatrix = Matrix2d.translation(position);
  const rotationMatrix = Matrix2d.rotation(rotation);
  const transformMatrix = Matrix2d.multiply(translationMatrix, rotationMatrix);

  // Corners of the box in local space
  const localCorners = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight },
  ];

  // Corners of the box in world space after rotation and translation
  const worldCorners = localCorners.map(corner => transformMatrix.transformPoint(corner));

  const xs = worldCorners.map(corner => corner.x);
  const ys = worldCorners.map(corner => corner.y);

  return {
    min: {
      x: Math.min(...xs),
      y: Math.min(...ys),
    },
    max: {
      x: Math.max(...xs),
      y: Math.max(...ys),
    },
  };
}
