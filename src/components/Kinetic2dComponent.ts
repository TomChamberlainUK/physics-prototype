import { Vector2d } from '#/maths';
import Component from './Component';

type ConstructorProps = {
  velocity?: Vector2d;
  acceleration?: Vector2d;
  mass?: number;
};

export default class Kinetic2dComponent extends Component {
  velocity: Vector2d;
  acceleration: Vector2d;
  mass: number;

  constructor({
    velocity = new Vector2d(),
    acceleration = new Vector2d(),
    mass = 1,
  }: ConstructorProps = {}) {
    super('Kinetic2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
  }
}
