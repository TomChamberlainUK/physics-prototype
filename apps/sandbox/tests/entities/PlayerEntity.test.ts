import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerEntity } from '#/entities';
import {
  Collider2dComponent,
  Geometry2dComponent,
  InputImpulseComponent,
  Transform2dComponent,
  Vector2d,
} from 'engine';

describe('PlayerEntity', () => {
  it('Should instantiate', () => {
    const player = new PlayerEntity();
    expect(player).toBeInstanceOf(PlayerEntity);
  });

  it('Should have a name', () => {
    const player = new PlayerEntity();
    expect(player.name).toBe('player-entity');
  });

  it('Should have an input impulse component', () => {
    const player = new PlayerEntity();
    const inputImpulse = player.getComponent<InputImpulseComponent>('InputImpulse');
    expect(inputImpulse).toBeInstanceOf(InputImpulseComponent);
  });

  describe('When passed a position', () => {
    it('Should set the position', () => {
      const position = { x: 10, y: 20 };
      const player = new PlayerEntity({
        position: new Vector2d(position),
      });
      const transform = player.getComponent<Transform2dComponent>('Transform2d');
      expect(transform).toBeInstanceOf(Transform2dComponent);
      expect(transform.position.x).toBe(position.x);
      expect(transform.position.y).toBe(position.y);
    });
  });

  describe('When passed a circle shape', () => {
    const shape = { type: 'circle', radius: 16 } as const;

    let player: PlayerEntity;

    beforeEach(() => {
      player = new PlayerEntity({ shape });
    });

    it('Should set the Geometry2d component shape', () => {
      const geometry = player.getComponent<Geometry2dComponent>('Geometry2d');
      expect(geometry).toBeInstanceOf(Geometry2dComponent);
      expect(geometry.shape.type).toBe('circle');
      expect((geometry.shape)).toBe(shape);
    });

    it('Should set the Collider2d component shape', () => {
      const collider = player.getComponent<Collider2dComponent>('Collider2d');
      expect(collider).toBeInstanceOf(Collider2dComponent);
      expect(collider.shape.type).toBe('circle');
      expect((collider.shape)).toBe(shape);
    });
  });

  describe('When passed a box shape', () => {
    const shape = { type: 'box', width: 32, height: 32 } as const;

    let player: PlayerEntity;

    beforeEach(() => {
      player = new PlayerEntity({ shape });
    });

    it('Should set the Geometry2d component shape', () => {
      const geometry = player.getComponent<Geometry2dComponent>('Geometry2d');
      expect(geometry).toBeInstanceOf(Geometry2dComponent);
      expect(geometry.shape).toBe(shape);
    });

    it('Should set the Collider2d component shape', () => {
      const collider = player.getComponent<Collider2dComponent>('Collider2d');
      expect(collider).toBeInstanceOf(Collider2dComponent);
      expect(collider.shape).toBe(shape);
    });
  });
});
