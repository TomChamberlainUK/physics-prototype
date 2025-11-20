/**
 * Parameters for calculating the moment of inertia of a box.
 */
type Parameters = {
  /** The mass of the box. Unit: kilograms (kg). */
  mass: number;
  /** The width of the box. Unit: meters (m). */
  width: number;
  /** The height of the box. Unit: meters (m). */
  height: number;
};

/**
 * Calculates the moment of inertia for a box shape.
 * @param mass - The mass of the box. Unit: kilograms (kg).
 * @param width - The width of the box. Unit: meters (m).
 * @param height - The height of the box. Unit: meters (m).
 * @returns The moment of inertia. Unit: kilogram meter squared (kg·m²).
 */
export default function getBoxMomentOfInertia({ mass, width, height }: Parameters) {
  return (1 / 12) * mass * (width * width + height * height);
}
