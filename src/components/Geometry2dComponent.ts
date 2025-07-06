import Component from './Component';

export default class Geometry2dComponent extends Component {
  type: string;
  radius: number;
  color: string;

  constructor() {
    super('Geometry2d');
    this.color = 'white';
    this.radius = 32;
    this.type = 'circle';
  }
}
