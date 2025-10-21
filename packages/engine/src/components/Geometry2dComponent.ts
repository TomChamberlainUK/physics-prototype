import Component from './Component';
import type { Shape } from '#/types';

type Props = {
  color?: string;
  strokeColor?: string;
  shape: Shape;
};

export default class Geometry2dComponent extends Component {
  color: string;
  strokeColor?: string;
  shape: Shape;

  constructor({
    color = 'white',
    strokeColor,
    shape,
  }: Props) {
    super('Geometry2d');
    this.color = color;
    this.strokeColor = strokeColor;
    this.shape = shape;
  }
}
