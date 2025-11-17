import type { AABB, Shape } from '#/types';
import Component from './Component';

/**
 * Parameters for constructing a Collider2dComponent.
 */
type ConstructorParams = {
  /** The shape of the collider. */
  shape: Shape;
};

/**
 * A component that defines a 2D collider for an entity.
 */
export default class Collider2dComponent extends Component {
  /** The axis-aligned bounding box of the collider. */
  aabb: AABB | null;
  /** The shape of the collider. */
  shape: Shape;
  /** The vertices of the collider, if applicable. */
  vertices: { x: number; y: number }[] | null;

  /**
   * Creates an instance of the Collider2dComponent.
   * @param shape - The shape of the collider.
   */
  constructor({ shape }: ConstructorParams) {
    super('Collider2d');
    this.aabb = null;
    this.shape = shape;
    this.vertices = null;
  }
}
