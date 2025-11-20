/**
 * Parameters for calculating the moment of inertia of a circle.
 */
type Parameters = {
  /** The mass of the circle. Unit: kilograms (kg). */
  mass: number;
  /** The radius of the circle. Unit: meters (m). */
  radius: number;
};

/**
 * Calculates the moment of inertia for a circle shape.
 * @param mass - The mass of the circle. Unit: kilograms (kg).
 * @param radius - The radius of the circle. Unit: meters (m).
 * @returns The moment of inertia. Unit: kilogram meter squared (kg·m²).
 */
export default function getCircleMomentOfInertia({ mass, radius }: Parameters) {
  return (1 / 2) * mass * radius * radius;
}
