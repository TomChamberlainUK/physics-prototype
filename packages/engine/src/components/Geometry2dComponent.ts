import Component from './Component';
import type { Shape } from '#/types';

type Props = {
  fillColor?: string;
  strokeColor?: string;
  shape: Shape;
};

export default class Geometry2dComponent extends Component {
  fillColor?: string;
  strokeColor?: string;
  shape: Shape;

  constructor({
    fillColor,
    strokeColor,
    shape,
  }: Props) {
    super('Geometry2d');
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.shape = shape;
  }
}
