import { describe, expect, it } from 'vitest';
import PlayerEntity from '#/entities/PlayerEntity';
import { Collider2dComponent, Geometry2dComponent, InputImpulseComponent, RigidBody2dComponent, Transform2dComponent, Vector2d, type CircleShape } from 'engine';

describe('PlayerEntity', () => {
  it('Should instantiate', () => {
    const player = new PlayerEntity();
    expect(player).toBeInstanceOf(PlayerEntity);
  });

  it('Should have a name', () => {
    const player = new PlayerEntity();
    expect(player.name).toBe('player-entity');
  });

  it('Should have a transform component', () => {
    const position = { x: 10, y: 20 };
    const player = new PlayerEntity({
      position: new Vector2d(position),
    });
    const transform = player.getComponent<Transform2dComponent>('Transform2d');
    expect(transform).toBeInstanceOf(Transform2dComponent);
    expect(transform.position.x).toBe(position.x);
    expect(transform.position.y).toBe(position.y);
  });

  it('Should have a geometry component', () => {
    const radius = 16;
    const player = new PlayerEntity({ radius });
    const geometry = player.getComponent<Geometry2dComponent>('Geometry2d');
    expect(geometry).toBeInstanceOf(Geometry2dComponent);
    expect(geometry.fillColor).toBe('red');
    expect(geometry.shape.type).toBe('circle');
    expect((geometry.shape as CircleShape).radius).toBe(radius);
  });

  it('Should have a rigid body component', () => {
    const radius = 16;
    const player = new PlayerEntity({ radius });
    const rigidBody = player.getComponent<RigidBody2dComponent>('RigidBody2d');
    expect(rigidBody).toBeInstanceOf(RigidBody2dComponent);
    expect(rigidBody.mass).toBe(radius);
  });

  it('Should have a collider component', () => {
    const radius = 16;
    const player = new PlayerEntity({ radius });
    const collider = player.getComponent<Collider2dComponent>('Collider2d');
    expect(collider).toBeInstanceOf(Collider2dComponent);
    expect(collider.shape.type).toBe('circle');
    expect((collider.shape as CircleShape).radius).toBe(radius);
  });

  it('Should have an input impulse component', () => {
    const player = new PlayerEntity();
    const inputImpulse = player.getComponent<InputImpulseComponent>('InputImpulse');
    expect(inputImpulse).toBeInstanceOf(InputImpulseComponent);
  });
});
