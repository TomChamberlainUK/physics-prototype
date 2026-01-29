import { Collider2dComponent, Entity, Geometry2dComponent, RigidBody2dComponent, Transform2dComponent, Vector2d, type Shape } from 'engine';

type Props = {
  position?: Vector2d;
  rotation?: number;
  shape?: Shape;
  mass?: number;
  fillColor?: string;
  name?: string;
  restitution?: number;
  friction?: number;
};

export default class PhysicsEntity extends Entity {
  constructor({
    position = new Vector2d({ x: 0, y: 0 }),
    shape = { type: 'circle', radius: 16 },
    mass,
    rotation = 0,
    fillColor = 'white',
    name = 'physics-entity',
    restitution = 0.6,
    friction = 0.5,
  }: Props = {}) {
    super({ name });

    let computedMass = mass;
    if (mass === undefined) {
      switch (shape.type) {
        case 'circle':
          computedMass = Math.PI * (shape.radius ** 2);
          break;
        case 'box':
          computedMass = shape.width * shape.height;
          break;
      }
    }

    this.addComponents([
      new Transform2dComponent({
        position,
        rotation,
      }),
      new Geometry2dComponent({
        fillColor,
        shape,
      }),
      new Collider2dComponent({
        shape,
      }),
      new RigidBody2dComponent({
        mass: computedMass,
        restitution,
        friction,
      }),
    ]);
  }
}
