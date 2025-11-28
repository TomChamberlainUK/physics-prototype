import { Collider2dComponent, Entity, Geometry2dComponent, RigidBody2dComponent, Transform2dComponent, Vector2d } from 'engine';

type Props = {
  position?: Vector2d;
  radius?: number;
  fillColor?: string;
  name?: string;
};

export default class CircleEntity extends Entity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    radius = 16,
    fillColor = 'white',
    name,
  }: Props = {}) {
    super({ name });
    this.addComponents([
      new Transform2dComponent({
        position,
      }),
      new Geometry2dComponent({
        fillColor,
        shape: {
          type: 'circle',
          radius: radius,
        },
      }),
      new RigidBody2dComponent({
        mass: Math.PI * radius * radius,
      }),
      new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: radius,
        },
      }),
    ]);
  }
}
