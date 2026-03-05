import type { Vector2d } from '#src/maths/index.js';
import type { AABB, Shape } from '#src/types/index.js';
import Component from '../Component.js';
import { getVertices } from './logic/index.js';

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
  /** The local-space vertices of the collider (relative to the collider's origin). */
  localVertices: Vector2d[] | null;
  /** The world-space vertices of the collider (transformed by the entity's transform). */
  worldVertices: Vector2d[] | null;

  /**
   * Creates an instance of the Collider2dComponent.
   * @param parameters - The shape of the collider, see {@link ConstructorParams}.
   */
  constructor({ shape }: ConstructorParams) {
    super('Collider2d');
    this.aabb = null;
    this.shape = shape;
    this.localVertices = getVertices(shape);
    this.worldVertices = null;
  }
}
