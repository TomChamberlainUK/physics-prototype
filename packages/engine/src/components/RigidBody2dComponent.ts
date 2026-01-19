import { Vector2d } from '#/maths';
import Component from './Component';

/**
 * Parameters for constructing a RigidBody2dComponent.
 */
type ConstructorParameters = {
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
  #mass!: number;
  /** The inverse of mass, used for efficient calculations. Unit: 1/kg. */
  #inverseMass!: number;
  /** The moment of inertia, affecting resistance to angular acceleration. Unit: kilogram meter squared (kg·m²). */
  #momentOfInertia!: number | null;
  /** The inverse of moment of inertia, used for efficient calculations. Unit: 1/(kg·m²). */
  #inverseMomentOfInertia!: number | null;
  /** The restitution coefficient (bounciness) of the body in collisions. Range: 0–1. */
  #restitution!: number;
  /** The resistance to sliding motion. Range: 0–1. */
  #friction!: number;

  /**
   * Creates an instance of the RigidBody2dComponent.
   * @param parameters - The parameters to define the rigid body, see {@link ConstructorParameters}.
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
  }: ConstructorParameters = {}) {
    super('RigidBody2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.force = force;
    this.impulse = impulse;
    this.angularVelocity = angularVelocity;
    this.angularAcceleration = angularAcceleration;
    this.angularImpulse = angularImpulse;
    this.mass = mass;
    this.momentOfInertia = null;
    this.restitution = restitution;
    this.friction = friction;
  }

  /** Gets the friction coefficient of the rigid body. */
  get friction() {
    return this.#friction;
  }

  /** Sets the friction coefficient of the rigid body. */
  set friction(value: number) {
    if (value < 0 || value > 1) {
      throw new Error('Friction must be between 0 and 1.');
    }
    this.#friction = value;
  }

  /** The moment of inertia, affecting resistance to angular acceleration. Unit: kilogram meter squared (kg·m²). */
  get momentOfInertia() {
    return this.#momentOfInertia;
  }

  /** Sets the moment of inertia and updates the inverse moment of inertia accordingly. */
  set momentOfInertia(value: number | null) {
    this.#momentOfInertia = value;
    if (value === null) {
      this.#inverseMomentOfInertia = null;
    }
    else {
      this.#inverseMomentOfInertia = value > 0
        ? 1 / value
        : 0;
    }
  }

  /** The inverse of moment of inertia, used for efficient calculations. Unit: 1/(kg·m²). */
  get inverseMomentOfInertia() {
    return this.#inverseMomentOfInertia;
  }

  /** The mass of the body, affecting resistance to force. Unit: kilograms (kg). */
  get mass() {
    return this.#mass;
  }

  /** Sets the mass and updates the inverse mass accordingly. */
  set mass(value: number) {
    this.#mass = value;
    this.#inverseMass = value !== 0
      ? 1 / value
      : 0;
  }

  /** The inverse of mass, used for efficient calculations. Unit: 1/kg. */
  get inverseMass() {
    return this.#inverseMass;
  }

  /** Gets the restitution coefficient of the rigid body. */
  get restitution() {
    return this.#restitution;
  }

  /** Sets the restitution coefficient of the rigid body. */
  set restitution(value: number) {
    if (value < 0 || value > 1) {
      throw new Error('Restitution must be between 0 and 1.');
    }
    this.#restitution = value;
  }
}
