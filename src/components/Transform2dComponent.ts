import { Vector2d } from '#/maths';
import Component from './Component';

type ConstructorProps = {
  position?: Vector2d;
  rotation?: number;
  scale?: Vector2d;
};

export default class Transform2dComponent extends Component {
  position: Vector2d;
  rotation: number;
  scale: Vector2d;

  constructor({
    position = new Vector2d(),
    rotation = 0,
    scale = new Vector2d(1, 1),
  }: ConstructorProps = {}) {
    super('Transform2d');
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
