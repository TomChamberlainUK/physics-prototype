import Component from './Component';

type ConstructorProps = {
  position?: { x: number; y: number };
  rotation?: number;
  scale?: { x: number; y: number };
};

export default class Transform2dComponent extends Component {
  position: { x: number; y: number };
  rotation: number;
  scale: { x: number; y: number };

  constructor({
    position = { x: 0, y: 0 },
    rotation = 0,
    scale = { x: 1, y: 1 },
  }: ConstructorProps = {}) {
    super('Transform2d');
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
