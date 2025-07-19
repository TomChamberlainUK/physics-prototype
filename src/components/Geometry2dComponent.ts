import Component from './Component';

type Props = {
  color?: string;
  radius?: number;
};

export default class Geometry2dComponent extends Component {
  type: string;
  radius: number;
  color: string;

  constructor({
    color = 'white',
    radius = 32,
  }: Props = {}) {
    super('Geometry2d');
    this.color = color;
    this.radius = radius;
    this.type = 'circle';
  }
}
