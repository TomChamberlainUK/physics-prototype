import type { Shape } from '#/types';
import Component from './Component';

type Props = {
  shape: Shape;
}

export default class Collider2dComponent extends Component {
  shape: Shape;

  constructor({ shape }: Props) {
    super('Collider2d');
    this.shape = shape;
  }
}