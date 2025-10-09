import { describe, expect, it } from 'vitest';
import BoxEntity from '#/entities/BoxEntity';
import { Collider2dComponent, Geometry2dComponent, RigidBody2dComponent, Transform2dComponent, Vector2d, type BoxShape } from 'engine';

describe('BoxEntity', () => {
  it('Should instantiate', () => {
    const player = new BoxEntity();
    expect(player).toBeInstanceOf(BoxEntity);
  });

  it('Should have a name', () => {
    const name = 'box-entity';
    const player = new BoxEntity({ name });
    expect(player.name).toBe(name);
  });

  it('Should have a transform component', () => {
    const position = { x: 10, y: 20 };
    const player = new BoxEntity({
      position: new Vector2d(position),
    });
    const transform = player.getComponent<Transform2dComponent>('Transform2d');
    expect(transform).toBeInstanceOf(Transform2dComponent);
    expect(transform.position.x).toBe(position.x);
    expect(transform.position.y).toBe(position.y);
  });

  it('Should have a geometry component', () => {
    const width = 32;
    const height = 32;
    const color = 'blue';
    const player = new BoxEntity({ width, height, color });
    const geometry = player.getComponent<Geometry2dComponent>('Geometry2d');
    expect(geometry).toBeInstanceOf(Geometry2dComponent);
    expect(geometry.color).toBe(color);
    expect(geometry.shape.type).toBe('box');
    expect((geometry.shape as BoxShape).width).toBe(width);
    expect((geometry.shape as BoxShape).height).toBe(height);
  });

  it('Should have a rigid body component', () => {
    const mass = 32;
    const player = new BoxEntity({ mass });
    const rigidBody = player.getComponent<RigidBody2dComponent>('RigidBody2d');
    expect(rigidBody).toBeInstanceOf(RigidBody2dComponent);
    expect(rigidBody.mass).toBe(mass);
  });

  it('Should have a collider component', () => {
    const width = 32;
    const height = 32;
    const player = new BoxEntity({ width, height });
    const collider = player.getComponent<Collider2dComponent>('Collider2d');
    expect(collider).toBeInstanceOf(Collider2dComponent);
    expect(collider.shape.type).toBe('box');
    expect((collider.shape as BoxShape).width).toBe(width);
    expect((collider.shape as BoxShape).height).toBe(height);
  });
});
