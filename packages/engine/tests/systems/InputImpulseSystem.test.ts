import { InputImpulseComponent, RigidBody2dComponent } from '#/components';
import Entity from '#/Entity';
import { KeyboardInput } from '#/input';
import Vector2d from '#/maths/Vector2d';
import { InputImpulseSystem } from '#/systems';

import { beforeEach, describe, expect, it } from 'vitest';

describe('InputImpulseSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new InputImpulseSystem();
      expect(system).toBeInstanceOf(InputImpulseSystem);
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    const force = 3600;
    const deltaTime = 1 / 60;

    let inputImpulseSystem: InputImpulseSystem;

    function getExpectedImpulse(direction: Vector2d, mass: number) {
      const directionUnit = direction.getUnit();
      const inverseMass = 1 / mass;
      return directionUnit.multiply(force * deltaTime * inverseMass);
    }

    beforeEach(() => {
      inputImpulseSystem = new InputImpulseSystem();
    });

    it.each([
      {
        name: 'no keys',
        keys: [],
        direction: { x: 0, y: 0 },
      },
      {
        name: 'w',
        keys: ['w'],
        direction: { x: 0, y: -1 },
      },
      {
        name: 's',
        keys: ['s'],
        direction: { x: 0, y: 1 },
      },
      {
        name: 'a',
        keys: ['a'],
        direction: { x: -1, y: 0 },
      },
      {
        name: 'd',
        keys: ['d'],
        direction: { x: 1, y: 0 },
      },
      {
        name: 'w + d',
        keys: ['w', 'd'],
        direction: { x: 1, y: -1 },
      },
      {
        name: 'w + a',
        keys: ['w', 'a'],
        direction: { x: -1, y: -1 },
      },
      {
        name: 's + d',
        keys: ['s', 'd'],
        direction: { x: 1, y: 1 },
      },
      {
        name: 's + a',
        keys: ['s', 'a'],
        direction: { x: -1, y: 1 },
      },
    ])('Should apply correct impulse for $name', ({ keys, direction }) => {
      const entity = new Entity();
      const rigidBody2dComponent = new RigidBody2dComponent();
      const inputImpulseComponent = new InputImpulseComponent();
      entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
      const input = {
        isPressed: (key: string) => keys.includes(key),
      } as unknown as KeyboardInput;

      inputImpulseSystem.update([entity], { input, deltaTime });

      const expectedImpulse = getExpectedImpulse(
        new Vector2d(direction),
        rigidBody2dComponent.mass,
      );

      expect(rigidBody2dComponent.impulse.x).toBeCloseTo(expectedImpulse.x);
      expect(rigidBody2dComponent.impulse.y).toBeCloseTo(expectedImpulse.y);
    });

    it('Should double the impulse when shift is pressed', () => {
      const entity = new Entity();
      const rigidBody2dComponent = new RigidBody2dComponent();
      const inputImpulseComponent = new InputImpulseComponent();
      entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
      const input = {
        isPressed: (key: string) => ['w', 'shift'].includes(key),
      } as unknown as KeyboardInput;

      inputImpulseSystem.update([entity], { input, deltaTime });

      const expectedImpulse = getExpectedImpulse(
        new Vector2d({ x: 0, y: -1 }),
        rigidBody2dComponent.mass,
      ).multiply(2);

      expect(rigidBody2dComponent.impulse.x).toBeCloseTo(expectedImpulse.x);
      expect(rigidBody2dComponent.impulse.y).toBeCloseTo(expectedImpulse.y);
    });

    it('Should normalize diagonal movement', () => {
      const entity = new Entity();
      const rigidBody2dComponent = new RigidBody2dComponent();
      const inputImpulseComponent = new InputImpulseComponent();
      entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
      const input = {
        isPressed: (key: string) => ['w', 'd'].includes(key),
      } as unknown as KeyboardInput;

      inputImpulseSystem.update([entity], { input, deltaTime });

      const singleDirectionImpulse = getExpectedImpulse(
        new Vector2d({ x: 0, y: -1 }),
        rigidBody2dComponent.mass,
      );
      const diagonalDirectionImpulse = getExpectedImpulse(
        new Vector2d({ x: 1, y: -1 }),
        rigidBody2dComponent.mass,
      );

      const singleDirectionImpulseMagnitude = singleDirectionImpulse.getMagnitude();
      const diagonalDirectionImpulseMagnitude = diagonalDirectionImpulse.getMagnitude();
      const magnitude = rigidBody2dComponent.impulse.getMagnitude();

      // The impulse magnitude when moving diagonally should be roughly equal to the impulse magnitude when moving in a single direction
      expect(diagonalDirectionImpulseMagnitude).toBeCloseTo(singleDirectionImpulseMagnitude);

      // The actual impulse applied to the rigid body should match the single direction impulse
      expect(magnitude).toBeCloseTo(singleDirectionImpulseMagnitude);
    });

    it('Should apply impulse scaled by inverse mass', () => {
      const direction = new Vector2d({ x: 0, y: -1 });

      for (const mass of [1, 2, 4]) {
        const entity = new Entity();
        const rigidBody2dComponent = new RigidBody2dComponent({
          mass,
        });
        const inputImpulseComponent = new InputImpulseComponent();
        entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
        const input = {
          isPressed: (key: string) => key === 'w',
        } as unknown as KeyboardInput;

        inputImpulseSystem.update([entity], { input, deltaTime });

        const expectedImpulse = getExpectedImpulse(direction, mass);

        expect(rigidBody2dComponent.impulse.y).toBeCloseTo(expectedImpulse.y);
        expect(rigidBody2dComponent.impulse.x).toBeCloseTo(expectedImpulse.x);
      }
    });

    it('Should not apply impulse to entities without the InputImpulse component', () => {
      const entity = new Entity();
      const rigidBody2dComponent = new RigidBody2dComponent();
      entity.addComponent(rigidBody2dComponent);
      const input = {
        isPressed: (key: string) => key === 'w',
      } as unknown as KeyboardInput;
      const deltaTime = 1 / 60;

      inputImpulseSystem.update([entity], { input, deltaTime });

      expect(rigidBody2dComponent.impulse.y).toBeCloseTo(0);
    });
  });
});
