import { Vector2d } from '#/maths';
import Component from './Component';

type ConstructorProps = {
  velocity?: Vector2d;
  acceleration?: Vector2d;
  impulse?: Vector2d;
  mass?: number;
};

export default class Kinetic2dComponent extends Component {
  velocity: Vector2d;
  acceleration: Vector2d;
  impulse: Vector2d;
  mass: number;
  inverseMass: number;

  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    impulse = new Vector2d(),
    mass = 1,
  }: ConstructorProps = {}) {
    super('RigidBody2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.impulse = impulse;
    this.mass = mass;
    this.inverseMass = 1 / mass;
  }
}
