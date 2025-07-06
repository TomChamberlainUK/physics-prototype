import Component from './Component';

type ConstructorProps = {
  velocity?: { x: number; y: number };
  acceleration?: { x: number; y: number };
  mass?: number;
};

export default class Kinetic2dComponent extends Component {
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  mass: number;

  constructor({
    velocity = { x: 0, y: 0 },
    acceleration = { x: 0, y: 0 },
    mass = 1,
  }: ConstructorProps = {}) {
    super('Kinetic2d');
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
  }
}
