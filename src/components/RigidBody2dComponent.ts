import { Vector2d } from '#/maths';
import Component from './Component';

type ConstructorProps = {
  velocity?: Vector2d;
  acceleration?: Vector2d;
  force?: Vector2d;
  impulse?: Vector2d;
  mass?: number;
  restitution?: number;
  friction?: number;
};

export default class RigidBody2dComponent extends Component {
  velocity: Vector2d;
  acceleration: Vector2d;
  force: Vector2d;
  impulse: Vector2d;
  mass: number;
  inverseMass: number;
  restitution: number;
  friction: number;

  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    force = new Vector2d(),
    impulse = new Vector2d(),
    mass = 1,
    restitution = 0.8,
    friction = 0.3,
  }: ConstructorProps = {}) {
    super('RigidBody2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.force = force;
    this.impulse = impulse;
    this.mass = mass;
    this.inverseMass = 1 / mass;
    this.restitution = restitution;
    this.friction = friction;
  }
}
