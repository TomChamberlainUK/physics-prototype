import { beforeEach, describe, expect, it } from 'vitest';
import { RigidBody2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import { Kinetic2dSystem } from '#/systems';

describe('Kinetic2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new Kinetic2dSystem();
      expect(system).toBeInstanceOf(Kinetic2dSystem);
      expect(system.name).toBe('Kinetic2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    const physicsHz = 60;
    const deltaTime = 1 / physicsHz;

    let kinetic2dSystem: Kinetic2dSystem;

    beforeEach(() => {
      kinetic2dSystem = new Kinetic2dSystem();
    });

    it('Should increase an entity\'s velocity by its impulse and then reduce its impulse to zero', () => {
      const entity = new Entity();
      const transformComponent = new Transform2dComponent();
      const rigidBody2dComponent = new RigidBody2dComponent({
        impulse: new Vector2d({ x: 1, y: 2 }),
      });
      entity.addComponents([
        transformComponent,
        rigidBody2dComponent,
      ]);
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.velocity).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.velocity.x).toBe(1);
      expect(rigidBody2dComponent.velocity.y).toBe(2);
      expect(rigidBody2dComponent.impulse).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.impulse.x).toBe(0);
      expect(rigidBody2dComponent.impulse.y).toBe(0);
    });

    it('Should increase an entity\'s velocity by its acceleration multiplied by deltaTime', () => {
      const initialVelocity = new Vector2d({ x: 1, y: 2 });
      const acceleration = new Vector2d({ x: 0.5, y: 1 });
      const expectedVelocity = initialVelocity.add(acceleration.multiply(deltaTime));

      const entity = new Entity();
      const transformComponent = new Transform2dComponent();
      const rigidBody2dComponent = new RigidBody2dComponent({
        acceleration,
        velocity: initialVelocity,
      });
      entity.addComponents([
        transformComponent,
        rigidBody2dComponent,
      ]);

      kinetic2dSystem.update([entity], { deltaTime });

      expect(rigidBody2dComponent.velocity).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.velocity.x).toBe(expectedVelocity.x);
      expect(rigidBody2dComponent.velocity.y).toBe(expectedVelocity.y);
    });

    it('Should increase an entity\'s position by its velocity multiplied by deltaTime', () => {
      const initialPosition = new Vector2d({ x: 0, y: 0 });
      const initialVelocity = new Vector2d({ x: 1, y: 2 });
      const expectedPosition = initialPosition.add(initialVelocity.multiply(deltaTime));

      const entity = new Entity();
      const transformComponent = new Transform2dComponent({
        position: initialPosition,
      });
      const rigidBody2dComponent = new RigidBody2dComponent({
        velocity: initialVelocity,
      });
      entity.addComponents([
        transformComponent,
        rigidBody2dComponent,
      ]);

      kinetic2dSystem.update([entity], { deltaTime });

      expect(transformComponent.position).toBeInstanceOf(Vector2d);
      expect(transformComponent.position.x).toBe(expectedPosition.x);
      expect(transformComponent.position.y).toBe(expectedPosition.y);
    });
  });
});
