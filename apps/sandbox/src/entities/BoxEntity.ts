import { Collider2dComponent, Entity, Geometry2dComponent, RigidBody2dComponent, Transform2dComponent, Vector2d } from 'engine';

type Props = {
  position?: Vector2d;
  width?: number;
  height?: number;
  mass?: number;
  color?: string;
  name?: string;
};

export default class BoxEntity extends Entity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    width = 16,
    height = 16,
    mass = 16,
    color = 'white',
    name,
  }: Props = {}) {
    super({ name });
    this.addComponents([
      new Transform2dComponent({
        position,
      }),
      new Geometry2dComponent({
        color,
        shape: {
          type: 'box',
          width,
          height,
        },
      }),
      new Collider2dComponent({
        shape: {
          type: 'box',
          width,
          height,
        },
      }),
      new RigidBody2dComponent({
        mass,
        restitution: 0.8,
      }),
    ]);
  }
}
