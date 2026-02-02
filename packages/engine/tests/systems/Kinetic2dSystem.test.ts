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
    let entity: Entity;
    let transformComponent: Transform2dComponent;
    let rigidBody2dComponent: RigidBody2dComponent;

    beforeEach(() => {
      kinetic2dSystem = new Kinetic2dSystem();
      entity = new Entity();
      transformComponent = new Transform2dComponent();
      rigidBody2dComponent = new RigidBody2dComponent();
      entity.addComponents([
        transformComponent,
        rigidBody2dComponent,
      ]);
    });

    it('Should increase an entity\'s velocity by its impulse multiplied by inverse mass', () => {
      const impulse = new Vector2d({ x: 1, y: 2 });
      const mass = 2;
      rigidBody2dComponent.impulse = impulse;
      rigidBody2dComponent.mass = mass;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.velocity).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.velocity.x).toBeCloseTo(impulse.x / mass);
      expect(rigidBody2dComponent.velocity.y).toBeCloseTo(impulse.y / mass);
    });

    it('Should reduce an entity\'s impulse to zero after applying it to velocity', () => {
      rigidBody2dComponent.impulse = new Vector2d({ x: 1, y: 2 });
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.impulse).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.impulse.x).toBe(0);
      expect(rigidBody2dComponent.impulse.y).toBe(0);
    });

    it('Should increase an entity\'s velocity by its acceleration multiplied by deltaTime', () => {
      const initialVelocity = new Vector2d({ x: 1, y: 2 });
      const acceleration = new Vector2d({ x: 0.5, y: 1 });
      const expectedVelocity = initialVelocity.add(acceleration.multiply(deltaTime));
      rigidBody2dComponent.acceleration = acceleration;
      rigidBody2dComponent.velocity = initialVelocity;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.velocity).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.velocity.x).toBe(expectedVelocity.x);
      expect(rigidBody2dComponent.velocity.y).toBe(expectedVelocity.y);
    });

    it('Should reduce an entity\'s acceleration to zero after applying it to velocity', () => {
      rigidBody2dComponent.acceleration = new Vector2d({ x: 0.5, y: 1 });
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.acceleration).toBeInstanceOf(Vector2d);
      expect(rigidBody2dComponent.acceleration.x).toBe(0);
      expect(rigidBody2dComponent.acceleration.y).toBe(0);
    });

    it('Should increase an entity\'s position by its velocity multiplied by deltaTime', () => {
      const initialPosition = new Vector2d({ x: 0, y: 0 });
      const initialVelocity = new Vector2d({ x: 1, y: 2 });
      const expectedPosition = initialPosition.add(initialVelocity.multiply(deltaTime));
      transformComponent.position = initialPosition;
      rigidBody2dComponent.velocity = initialVelocity;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(transformComponent.position).toBeInstanceOf(Vector2d);
      expect(transformComponent.position.x).toBe(expectedPosition.x);
      expect(transformComponent.position.y).toBe(expectedPosition.y);
    });

    it('Should increase an entity\'s angular velocity by its angular impulse multiplied by inverse moment of inertia', () => {
      const initialAngularVelocity = 0;
      const angularImpulse = Math.PI; // Radians per second
      const momentOfInertia = 2;
      const inverseMomentOfInertia = 1 / momentOfInertia;
      const expectedAngularVelocity = initialAngularVelocity + angularImpulse * inverseMomentOfInertia;
      rigidBody2dComponent.angularVelocity = initialAngularVelocity;
      rigidBody2dComponent.angularImpulse = angularImpulse;
      rigidBody2dComponent.momentOfInertia = momentOfInertia;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.angularVelocity).toBeCloseTo(expectedAngularVelocity);
    });

    it('Should reduce angular impulse to zero after applying it to angular velocity', () => {
      const angularImpulse = Math.PI; // Radians per second
      rigidBody2dComponent.angularImpulse = angularImpulse;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.angularImpulse).toBe(0);
    });

    it('Should increase an entity\'s angular velocity by its angular acceleration multiplied by deltaTime', () => {
      const initialAngularVelocity = 0;
      const angularAcceleration = Math.PI; // Radians per second squared
      const expectedAngularVelocity = initialAngularVelocity + angularAcceleration * deltaTime;
      rigidBody2dComponent.angularVelocity = initialAngularVelocity;
      rigidBody2dComponent.angularAcceleration = angularAcceleration;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(rigidBody2dComponent.angularVelocity).toBeCloseTo(expectedAngularVelocity);
    });

    it('Should increase an entity\'s rotation by its angular velocity multiplied by deltaTime', () => {
      const initialRotation = 0;
      const angularVelocity = Math.PI; // Radians per second
      const expectedRotation = initialRotation + angularVelocity * deltaTime;
      transformComponent.rotation = initialRotation;
      rigidBody2dComponent.angularVelocity = angularVelocity;
      kinetic2dSystem.update([entity], { deltaTime });
      expect(transformComponent.rotation).toBeCloseTo(expectedRotation);
    });
  });
});
