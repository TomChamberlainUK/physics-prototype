import { beforeEach, describe, expect, it } from 'vitest';
import { Gravity2dSystem } from '#/systems';
import Entity from '#/Entity';
import RigidBody2dComponent from '#/components/RigidBody2dComponent';

describe('Gravity2dSystem', () => {
  let gravity2dSystem: Gravity2dSystem;

  beforeEach(() => {
    gravity2dSystem = new Gravity2dSystem();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(gravity2dSystem).toBeInstanceOf(Gravity2dSystem);
      expect(gravity2dSystem.name).toBe('Gravity2dSystem');
      expect(gravity2dSystem.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let rigidBody2dComponent: RigidBody2dComponent;

    beforeEach(() => {
      entity = new Entity();
      rigidBody2dComponent = new RigidBody2dComponent();
      entity.addComponent(rigidBody2dComponent);
    });

    describe('When passed an entity with a RigidBody2d component', () => {
      it('Should add gravity to its acceleration', () => {
        gravity2dSystem.update([entity]);
        expect(rigidBody2dComponent.acceleration.x).toBe(0);
        expect(rigidBody2dComponent.acceleration.y).toBeCloseTo(9.81);
      });
    });
  });
});
