import type { AABB, Shape } from '#/types';
import Component from './Component';

type Props = {
  shape: Shape;
};

export default class Collider2dComponent extends Component {
  aabb: AABB | null;
  shape: Shape;

  constructor({ shape }: Props) {
    super('Collider2d');
    this.aabb = null;
    this.shape = shape;
  }
}
