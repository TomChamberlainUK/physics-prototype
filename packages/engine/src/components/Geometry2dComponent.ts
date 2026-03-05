import Component from './Component.js';
import type { Shape } from '#src/types/index.js';

/**
 * Parameters for constructing a Geometry2dComponent.
 */
type ConstructorParams = {
  /** The fill color of the geometry. */
  fillColor?: string;
  /** The stroke color of the geometry. */
  strokeColor?: string;
  /** The shape of the geometry. */
  shape: Shape;
};

/**
 * A component that defines 2D geometry for an entity.
 */
export default class Geometry2dComponent extends Component {
  /** The fill color of the geometry. */
  fillColor?: string;
  /** The stroke color of the geometry. */
  strokeColor?: string;
  /** The shape of the geometry. */
  shape: Shape;

  /**
   * Creates an instance of the Geometry2dComponent.
   * @param fillColor - The fill color of the geometry.
   * @param strokeColor - The stroke color of the geometry.
   * @param shape - The shape of the geometry.
   */
  constructor({
    fillColor,
    strokeColor,
    shape,
  }: ConstructorParams) {
    super('Geometry2d');
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.shape = shape;
  }
}
