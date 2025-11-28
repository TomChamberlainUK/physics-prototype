import { Collider2dComponent, Entity, Geometry2dComponent, RigidBody2dComponent, Transform2dComponent, Vector2d } from 'engine';

type Props = {
  position?: Vector2d;
  rotation?: number;
  width?: number;
  height?: number;
  mass?: number;
  fillColor?: string;
  name?: string;
};

export default class BoxEntity extends Entity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    width = 16,
    height = 16,
    mass,
    rotation = 0,
    fillColor = 'white',
    name,
  }: Props = {}) {
    super({ name });
    this.addComponents([
      new Transform2dComponent({
        position,
        rotation,
      }),
      new Geometry2dComponent({
        fillColor,
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
        mass: mass ?? width * height,
        restitution: 0.8,
      }),
    ]);
  }
}
