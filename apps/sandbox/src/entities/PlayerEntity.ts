import { InputImpulseComponent, Vector2d, type Shape } from 'engine';
import PhysicsEntity from './PhysicsEntity';

type Props = {
  position?: Vector2d;
  shape?: Shape;
};

export default class PlayerEntity extends PhysicsEntity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    shape = { type: 'circle', radius: 16 },
  }: Props = {}) {
    super({ name: 'player-entity', position, shape });
    this.addComponents([
      new InputImpulseComponent(),
    ]);
  }
}
