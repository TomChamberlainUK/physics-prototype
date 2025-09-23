import Component from './Component';
import type { Shape } from '#/types';

type Props = {
  color?: string;
  shape: Shape;
};

export default class Geometry2dComponent extends Component {
  shape: Shape;
  color: string;

  constructor({
    color = 'white',
    shape,
  }: Props) {
    super('Geometry2d');
    this.color = color;
    this.shape = shape;
  }
}
