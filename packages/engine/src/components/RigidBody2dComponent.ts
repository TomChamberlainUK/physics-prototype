import { Vector2d } from '#/maths';
import Component from './Component';

/**
 * Parameters for constructing a RigidBody2dComponent.
 */
type ConstructorParams = {
  /** The velocity of the rigid body. */
  velocity?: Vector2d;
  /** The acceleration of the rigid body. */
  acceleration?: Vector2d;
  /** The force applied to the rigid body. */
  force?: Vector2d;
  /** The impulse applied to the rigid body. */
  impulse?: Vector2d;
  /** The mass of the rigid body. */
  mass?: number;
  /** The restitution coefficient of the rigid body. */
  restitution?: number;
  /** The friction coefficient of the rigid body. */
  friction?: number;
};

/**
 * A component that defines a 2D rigid body for an entity.
 */
export default class RigidBody2dComponent extends Component {
  /** The velocity of the rigid body. */
  velocity: Vector2d;
  /** The acceleration of the rigid body. */
  acceleration: Vector2d;
  /** The force applied to the rigid body. */
  force: Vector2d;
  /** The impulse applied to the rigid body. */
  impulse: Vector2d;
  /** The mass of the rigid body. */
  mass: number;
  /** The inverse mass of the rigid body. */
  inverseMass: number;
  /** The restitution coefficient of the rigid body. */
  restitution: number;
  /** The friction coefficient of the rigid body. */
  friction: number;

  /**
   * Creates an instance of the RigidBody2dComponent.
   * @param velocity - The velocity of the rigid body.
   * @param acceleration - The acceleration of the rigid body.
   * @param force - The force applied to the rigid body.
   * @param impulse - The impulse applied to the rigid body.
   * @param mass - The mass of the rigid body.
   * @param restitution - The restitution coefficient of the rigid body.
   * @param friction - The friction coefficient of the rigid body.
   */
  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    force = new Vector2d(),
    impulse = new Vector2d(),
    mass = 1,
    restitution = 0.8,
    friction = 0.3,
  }: ConstructorParams = {}) {
    super('RigidBody2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.force = force;
    this.impulse = impulse;
    this.mass = mass;
    this.inverseMass = mass !== 0
      ? 1 / mass
      : 0;
    this.restitution = restitution;
    this.friction = friction;
  }
}
