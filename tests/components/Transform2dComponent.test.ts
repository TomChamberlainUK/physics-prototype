import { describe, expect, it } from 'vitest';
import { Transform2dComponent } from '#/components';
import Vector2d from '#/maths/Vector2d';

describe('Transform2dComponent', () => {
  it('Should instantiate', () => {
    const transform2dComponent = new Transform2dComponent();
    expect(transform2dComponent).toBeInstanceOf(Transform2dComponent);
    expect(transform2dComponent.name).toBe('Transform2d');
    expect(transform2dComponent.position).toBeInstanceOf(Vector2d);
    expect(transform2dComponent.position.x).toBe(0);
    expect(transform2dComponent.position.y).toBe(0);
    expect(transform2dComponent.rotation).toBe(0);
    expect(transform2dComponent.scale).toBeInstanceOf(Vector2d);
    expect(transform2dComponent.scale.x).toBe(1);
    expect(transform2dComponent.scale.y).toBe(1);
  });
});
