import { Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { InterpolationSync2dSystem } from '#/systems';
import { describe, expect, it } from 'vitest';

describe('InterpolationSync2dSystemNew', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new InterpolationSync2dSystem();
      expect(system).toBeInstanceOf(InterpolationSync2dSystem);
      expect(system.type).toBe('sync');
    });
  });

  describe('update()', () => {
    it('Should update entities Transform2d previousPosition to match position', () => {
      const originalPosition = new Vector2d({ x: 0, y: 0 });
      const currentPosition = new Vector2d({ x: 5, y: 10 });

      const entity = new Entity();
      const transform2dComponent = new Transform2dComponent();
      entity.addComponent(transform2dComponent);
      transform2dComponent.previousPosition = originalPosition;
      transform2dComponent.position = currentPosition;

      expect(transform2dComponent.previousPosition).toEqual(originalPosition);

      const system = new InterpolationSync2dSystem();
      system.update([entity]);

      expect(transform2dComponent.previousPosition).toEqual(currentPosition);
    });
  });
});
