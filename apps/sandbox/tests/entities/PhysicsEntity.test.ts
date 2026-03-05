import { describe, expect, it } from 'vitest';
import {
  type Collider2dComponent,
  type Geometry2dComponent,
  type RigidBody2dComponent,
  type Transform2dComponent,
  Vector2d,
} from 'engine';
import { PhysicsEntity } from '#/entities';

describe('PhysicsEntity', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const physicsEntity = new PhysicsEntity();
      expect(physicsEntity).toBeInstanceOf(PhysicsEntity);
      expect(physicsEntity.name).toBe('physics-entity');
    });

    it('Should set a name', () => {
      const name = 'physics-entity-test';
      const physicsEntity = new PhysicsEntity({ name });
      expect(physicsEntity.name).toBe(name);
    });

    it('Should set a Transform2d component', () => {
      const position = new Vector2d({ x: 50, y: 100 });
      const rotation = Math.PI / 2;
      const physicsEntity = new PhysicsEntity({
        position,
        rotation,
      });
      const transform = physicsEntity.getComponent<Transform2dComponent>('Transform2d');
      expect(transform.position.x).toBe(position.x);
      expect(transform.position.y).toBe(position.y);
      expect(transform.rotation).toBe(rotation);
    });

    it('Should set a Geometry2d component', () => {
      const shape = { type: 'box', width: 32, height: 32 } as const;
      const fillColor = 'red';
      const physicsEntity = new PhysicsEntity({
        shape,
        fillColor,
      });
      const geometry = physicsEntity.getComponent<Geometry2dComponent>('Geometry2d');
      expect(geometry.shape).toBe(shape);
      expect(geometry.fillColor).toBe(fillColor);
    });

    it('Should set a Collider2d component', () => {
      const shape = { type: 'box', width: 32, height: 32 } as const;
      const physicsEntity = new PhysicsEntity({
        shape,
      });
      const collider = physicsEntity.getComponent<Collider2dComponent>('Collider2d');
      expect(collider.shape).toBe(shape);
    });

    it('Should set a RigidBody2d component', () => {
      const radius = 16;
      const shape = { type: 'circle', radius } as const;
      const physicsEntity = new PhysicsEntity({
        shape,
      });
      const rigidBody = physicsEntity.getComponent<RigidBody2dComponent>('RigidBody2d');
      expect(rigidBody.mass).toBeCloseTo(Math.PI * radius * radius);
    });
  });
});
