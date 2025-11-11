import { Vector2d } from '#/maths';
import Component from './Component';

/**
 * Parameters for constructing a Transform2dComponent.
 */
type ConstructorParams = {
  /** The position of the transform. */
  position?: Vector2d;
  /** The rotation of the transform, measured in radians. */
  rotation?: number;
  /** The scale of the transform. */
  scale?: Vector2d;
};

/**
 * A component that defines a 2D transform for an entity.
 */
export default class Transform2dComponent extends Component {
  /** The position of the transform. */
  position: Vector2d;
  /** The previous position of the transform. */
  previousPosition: Vector2d;
  /** The rotation of the transform, measured in radians. */
  rotation: number;
  /** The previous rotation of the transform, measured in radians. */
  previousRotation: number;
  /** The scale of the transform. */
  scale: Vector2d;

  /**
   * Creates an instance of the Transform2dComponent.
   * @param position - The position of the transform.
   * @param rotation - The rotation of the transform, measured in radians.
   * @param scale - The scale of the transform.
   */
  constructor({
    position = new Vector2d(),
    rotation = 0,
    scale = new Vector2d(1, 1),
  }: ConstructorParams = {}) {
    super('Transform2d');
    this.position = position;
    this.previousPosition = new Vector2d(position);
    this.rotation = rotation;
    this.previousRotation = rotation;
    this.scale = scale;
  }
}
