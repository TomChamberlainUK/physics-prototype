import { Vector2d } from '#/maths';
import Component from './Component';

/**
 * Parameters for constructing a RigidBody2dComponent.
 */
type ConstructorParams = {
  /** The current linear velocity of the body. Unit: meters per second (m/s). */
  velocity?: Vector2d;
  /** The current linear acceleration of the body. Unit: meters per second squared (m/s²). */
  acceleration?: Vector2d;
  /** The total force to be applied this frame. Unit: newtons (N). */
  force?: Vector2d;
  /** Instantaneous change in linear momentum, applied this frame. Unit: newton-seconds (N·s). */
  impulse?: Vector2d;
  /** The current angular velocity (rate of rotation). Unit: radians per second (rad/s). */
  angularVelocity?: number;
  /** The current angular acceleration (rate of change of angular velocity). Unit: radians per second squared (rad/s²). */
  angularAcceleration?: number;
  /** Instantaneous change in angular momentum, applied this frame. Unit: newton-meter-seconds (N·m·s). */
  angularImpulse?: number;
  /** The mass of the body, affecting resistance to force. Unit: kilograms (kg). */
  mass?: number;
  /** The restitution coefficient (bounciness) of the body in collisions. Range: 0–1. */
  restitution?: number;
  /** The resistance to sliding motion. Range: 0–1. */
  friction?: number;
};

/**
 * A component that defines a 2D rigid body for an entity.
 */
export default class RigidBody2dComponent extends Component {
  /** The current linear velocity of the body. Unit: meters per second (m/s). */
  velocity: Vector2d;
  /** The current linear acceleration of the body. Unit: meters per second squared (m/s²). */
  acceleration: Vector2d;
  /** The total force to be applied this frame. Unit: newtons (N). */
  force: Vector2d;
  /** Instantaneous change in linear momentum, applied this frame. Unit: newton-seconds (N·s). */
  impulse: Vector2d;
  /** The current angular velocity (rate of rotation). Unit: radians per second (rad/s). */
  angularVelocity: number;
  /** The current angular acceleration (rate of change of angular velocity). Unit: radians per second squared (rad/s²). */
  angularAcceleration: number;
  /** Instantaneous change in angular momentum, applied this frame. Unit: newton-meter-seconds (N·m·s). */
  angularImpulse: number;
  /** The mass of the body, affecting resistance to force. Unit: kilograms (kg). */
  mass: number;
  /** The inverse of mass, used for efficient calculations. Unit: 1/kg. */
  inverseMass: number;
  /** The restitution coefficient (bounciness) of the body in collisions. Range: 0–1. */
  restitution: number;
  /** The resistance to sliding motion. Range: 0–1. */
  friction: number;

  /**
   * Creates an instance of the RigidBody2dComponent.
   * @param velocity - The current linear velocity of the body. Unit: meters per second (m/s).
   * @param acceleration - The current linear acceleration of the body. Unit: meters per second squared (m/s²).
   * @param force - The total force to be applied this frame. Unit: newtons (N).
   * @param impulse - Instantaneous change in linear momentum, applied this frame. Unit: newton-seconds (N·s).
   * @param angularVelocity - The current angular velocity (rate of rotation). Unit: radians per second (rad/s).
   * @param angularAcceleration - The current angular acceleration (rate of change of angular velocity). Unit: radians per second squared (rad/s²).
   * @param angularImpulse - Instantaneous change in angular momentum, applied this frame. Unit: newton-meter-seconds (N·m·s).
   * @param mass - The mass of the body, affecting resistance to force. Unit: kilograms (kg).
   * @param restitution - The restitution coefficient (bounciness) of the body in collisions. Range: 0–1.
   * @param friction - The resistance to sliding motion. Range: 0–1.
   */
  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    force = new Vector2d(),
    impulse = new Vector2d(),
    angularVelocity = 0,
    angularAcceleration = 0,
    angularImpulse = 0,
    mass = 1,
    restitution = 0.8,
    friction = 0.3,
  }: ConstructorParams = {}) {
    super('RigidBody2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.force = force;
    this.impulse = impulse;
    this.angularVelocity = angularVelocity;
    this.angularAcceleration = angularAcceleration;
    this.angularImpulse = angularImpulse;
    this.mass = mass;
    this.inverseMass = mass !== 0
      ? 1 / mass
      : 0;
    this.restitution = restitution;
    this.friction = friction;
  }
}
