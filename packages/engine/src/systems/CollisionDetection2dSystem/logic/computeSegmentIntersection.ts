import { Vector2d } from '#/maths';

/**
 * Properties for calculating the intersection of two line segments.
 */
type Properties = {
  /** The start point of the first line segment. */
  segmentAStart: Vector2d;
  /** The end point of the first line segment. */
  segmentAEnd: Vector2d;
  /** The start point of the second line segment. */
  segmentBStart: Vector2d;
  /** The end point of the second line segment. */
  segmentBEnd: Vector2d;
};

/**
 * The output of the computeSegmentIntersection function.
 */
type Output = Vector2d | null;

/**
 * Computes the intersection point of two line segments in 2D space, if it exists.
 * @param properties - An object containing the start and end points of both line segments, see {@link Properties}.
 * @returns The intersection point as a Vector2d, or null if the segments don't intersect, see {@link Output}.
 */
export default function computeSegmentIntersection({
  segmentAStart,
  segmentAEnd,
  segmentBStart,
  segmentBEnd,
}: Properties): Output {
  // Compute the direction vectors of the segments
  const segmentAVector = segmentAEnd.subtract(segmentAStart);
  const segmentBVector = segmentBEnd.subtract(segmentBStart);

  // The denominator measures how non-parallel the lines are
  const denominator = Vector2d.crossProduct(segmentAVector, segmentBVector);

  // If the lines are parallel, there is no intersection
  if (denominator === 0) {
    return null;
  }

  // Compute the intersection points along each segment
  const segmentAIntersectionPoint = ((segmentBStart.x - segmentAStart.x) * segmentBVector.y - (segmentBStart.y - segmentAStart.y) * segmentBVector.x) / denominator;
  const segmentBIntersectionPoint = ((segmentBStart.x - segmentAStart.x) * segmentAVector.y - (segmentBStart.y - segmentAStart.y) * segmentAVector.x) / denominator;

  // Check if the intersection points are within the bounds of both segments
  if (
    segmentAIntersectionPoint >= 0
    && segmentAIntersectionPoint <= 1
    && segmentBIntersectionPoint >= 0
    && segmentBIntersectionPoint <= 1
  ) {
    // Return the exact intersection point
    return new Vector2d({
      x: segmentAStart.x + segmentAIntersectionPoint * segmentAVector.x,
      y: segmentAStart.y + segmentAIntersectionPoint * segmentAVector.y,
    });
  }

  // No intersection within the bounds of the segments
  return null;
}
