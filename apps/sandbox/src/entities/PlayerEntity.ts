import { Collider2dComponent, Entity, Geometry2dComponent, InputImpulseComponent, RigidBody2dComponent, Transform2dComponent, Vector2d } from 'engine';

type Props = {
  position?: Vector2d;
  radius?: number;
};

export default class PlayerEntity extends Entity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    radius = 16,
  }: Props = {}) {
    super({ name: 'player-entity' });
    this.addComponents([
      new Transform2dComponent({
        position,
      }),
      new Geometry2dComponent({
        color: 'red',
        shape: {
          type: 'circle',
          radius: radius,
        },
      }),
      new RigidBody2dComponent({
        mass: radius,
      }),
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: radius,
        },
      }),
      new InputImpulseComponent(),
    ]);
  }
}
