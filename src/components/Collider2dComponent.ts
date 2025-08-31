import Component from './Component';

type CircleCollider = {
  type: 'circle';
  radius: number;
};

type ColliderShape = CircleCollider;

type Props = {
  shape: ColliderShape;
}

export default class Collider2dComponent extends Component {
  shape: ColliderShape;

  constructor({ shape }: Props) {
    super('Collider2d');
    this.shape = shape;
  }
}