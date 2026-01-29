/**
 * Properties for calculating the moment of inertia of a box.
 */
type Properties = {
  /** The mass of the box. Unit: kilograms (kg). */
  mass: number;
  /** The width of the box. Unit: meters (m). */
  width: number;
  /** The height of the box. Unit: meters (m). */
  height: number;
};

/**
 * Calculates the moment of inertia for a box shape.
 * @param properties - An object containing the mass, width, and height of the box, see {@link Properties}.
 * @returns The moment of inertia. Unit: kilogram meter squared (kg·m²).
 */
export default function getBoxMomentOfInertia({ mass, width, height }: Properties) {
  return (1 / 12) * mass * (width * width + height * height);
}
