import { InputImpulseComponent, RigidBody2dComponent } from '#/components';
import Entity from '#/Entity';
import { KeyboardInput } from '#/input';
import inputImpulseSystem from '#/systems/inputImpulseSystem';
import { describe, expect, it } from 'vitest';

describe('inputImpulseSystem()', () => {
  type TestCase = {
    name: string;
    keys: string[];
    expected: { x: number; y: number };
    close?: boolean;
  };

  const cases: TestCase[] = [
    {
      name: 'no keys',
      keys: [],
      expected: { x: 0, y: 0 },
    },
    {
      name: 'w',
      keys: ['w'],
      expected: { x: 0, y: -1 },
    },
    {
      name: 's',
      keys: ['s'],
      expected: { x: 0, y: 1 },
    },
    {
      name: 'a',
      keys: ['a'],
      expected: { x: -1, y: 0 },
    },
    {
      name: 'd',
      keys: ['d'],
      expected: { x: 1, y: 0 },
    },
    {
      name: 'w + d',
      keys: ['w', 'd'],
      expected: { x: 0.7071, y: -0.7071 },
    },
    {
      name: 'w + a',
      keys: ['w', 'a'],
      expected: { x: -0.7071, y: -0.7071 },
    },
    {
      name: 's + d',
      keys: ['s', 'd'],
      expected: { x: 0.7071, y: 0.7071 },
    },
    {
      name: 's + a',
      keys: ['s', 'a'],
      expected: { x: -0.7071, y: 0.7071 },
    },
  ];

  it.each(cases)('Should apply correct impulse for $name', ({ keys, expected, close }) => {
    const entity = new Entity();
    const rigidBody2dComponent = new RigidBody2dComponent();
    const inputImpulseComponent = new InputImpulseComponent();
    entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
    const input = {
      isPressed: (key: string) => keys.includes(key),
    } as unknown as KeyboardInput;

    inputImpulseSystem([entity], input);

    expect(rigidBody2dComponent.impulse.x).toBeCloseTo(expected.x, 3);
    expect(rigidBody2dComponent.impulse.y).toBeCloseTo(expected.y, 3);
  });

  it('Should normalize diagonal movement', () => {
    const entity = new Entity();
    const rigidBody2dComponent = new RigidBody2dComponent();
    const inputImpulseComponent = new InputImpulseComponent();
    entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
    const input = {
      isPressed: (key: string) => ['w', 'd'].includes(key),
    } as unknown as KeyboardInput;

    inputImpulseSystem([entity], input);

    const magnitude = rigidBody2dComponent.impulse.getMagnitude();
    expect(magnitude).toBeCloseTo(1);
  });

  it('Should apply impulse scaled by inverse mass', () => {
    const cases = [
      { mass: 1, expectedY: -1 },
      { mass: 2, expectedY: -0.5 },
      { mass: 0.5, expectedY: -2 },
    ];

    for (const { mass, expectedY } of cases) {
      const entity = new Entity();
      const rigidBody2dComponent = new RigidBody2dComponent({
        mass,
      });
      const inputImpulseComponent = new InputImpulseComponent();
      entity.addComponents([rigidBody2dComponent, inputImpulseComponent]);
      const input = {
        isPressed: (key: string) => key === 'w',
      } as unknown as KeyboardInput;

      inputImpulseSystem([entity], input);

      expect(rigidBody2dComponent.impulse.y).toBeCloseTo(expectedY);
    }
  });

  it('Should not apply impulse to entities without the InputImpulse component', () => {
    const entity = new Entity();
    const rigidBody2dComponent = new RigidBody2dComponent();
    entity.addComponent(rigidBody2dComponent);
    const input = {
      isPressed: (key: string) => key === 'w',
    } as unknown as KeyboardInput;

    inputImpulseSystem([entity], input);

    expect(rigidBody2dComponent.impulse.y).toBeCloseTo(0);
  });
});