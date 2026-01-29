/**
 * Properties for calculating the moment of inertia of a circle.
 */
type Properties = {
  /** The mass of the circle. Unit: kilograms (kg). */
  mass: number;
  /** The radius of the circle. Unit: meters (m). */
  radius: number;
};

/**
 * Calculates the moment of inertia for a circle shape.
 * @param properties - An object containing the mass and radius of the circle, see {@link Properties}.
 * @returns The moment of inertia. Unit: kilogram meter squared (kg·m²).
 */
export default function getCircleMomentOfInertia({ mass, radius }: Properties) {
  return (1 / 2) * mass * radius * radius;
}
