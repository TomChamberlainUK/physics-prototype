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
  /** The angular velocity of the rigid body. */
  angularVelocity?: number;
  /** The angular acceleration of the rigid body. */
  angularAcceleration?: number;
  /** The angular impulse applied to the rigid body. */
  angularImpulse?: number;
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
  /** The angular velocity of the rigid body. */
  angularVelocity: number;
  /** The angular acceleration of the rigid body. */
  angularAcceleration: number;
  /** The angular impulse applied to the rigid body. */
  angularImpulse: number;

  /**
   * Creates an instance of the RigidBody2dComponent.
   * @param velocity - The velocity of the rigid body.
   * @param acceleration - The acceleration of the rigid body.
   * @param force - The force applied to the rigid body.
   * @param impulse - The impulse applied to the rigid body.
   * @param mass - The mass of the rigid body.
   * @param restitution - The restitution coefficient of the rigid body.
   * @param friction - The friction coefficient of the rigid body.
   * @param angularVelocity - The angular velocity of the rigid body.
   * @param angularAcceleration - The angular acceleration of the rigid body.
   * @param angularImpulse - The angular impulse applied to the rigid body.
   */
  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    force = new Vector2d(),
    impulse = new Vector2d(),
    mass = 1,
    restitution = 0.8,
    friction = 0.3,
    angularVelocity = 0,
    angularAcceleration = 0,
    angularImpulse = 0,
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
    this.angularVelocity = angularVelocity;
    this.angularAcceleration = angularAcceleration;
    this.angularImpulse = angularImpulse;
  }
}
