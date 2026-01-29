import { Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import { InterpolationSync2dSystem } from '#/systems';
import { beforeEach, describe, expect, it } from 'vitest';

describe('InterpolationSync2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new InterpolationSync2dSystem();
      expect(system).toBeInstanceOf(InterpolationSync2dSystem);
      expect(system.name).toBe('InterpolationSync2dSystem');
      expect(system.type).toBe('sync');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let transform2dComponent: Transform2dComponent;

    beforeEach(() => {
      entity = new Entity();
      transform2dComponent = new Transform2dComponent();
      entity.addComponent(transform2dComponent);
    });

    it('Should update entities Transform2d previousPosition to match position', () => {
      const originalPosition = new Vector2d({ x: 0, y: 0 });
      const currentPosition = new Vector2d({ x: 5, y: 10 });

      transform2dComponent.previousPosition = originalPosition;
      transform2dComponent.position = currentPosition;

      expect(transform2dComponent.previousPosition).toEqual(originalPosition);

      const system = new InterpolationSync2dSystem();
      system.update([entity]);

      expect(transform2dComponent.previousPosition).toEqual(currentPosition);
    });

    it('Should update entities Transform2d previousRotation to match rotation', () => {
      const originalRotation = 0;
      const currentRotation = Math.PI / 4; // 45 degrees in radians

      transform2dComponent.previousRotation = originalRotation;
      transform2dComponent.rotation = currentRotation;

      expect(transform2dComponent.previousRotation).toBe(originalRotation);

      const system = new InterpolationSync2dSystem();
      system.update([entity]);

      expect(transform2dComponent.previousRotation).toBe(currentRotation);
    });
  });
});
