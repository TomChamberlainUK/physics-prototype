import { describe, expect, it } from 'vitest';
import { Transform2dComponent } from '#/components';

describe('Transform2dComponent', () => {
  it('Should instantiate', () => {
    const position = { x: 0, y: 0 };
    const rotation = 0;
    const scale = { x: 1, y: 1 };
    const transform2dComponent = new Transform2dComponent({
      position,
      rotation,
      scale,
    });
    expect(transform2dComponent).toBeInstanceOf(Transform2dComponent);
    expect(transform2dComponent.name).toBe('Transform2d');
    expect(transform2dComponent.position).toEqual(position);
    expect(transform2dComponent.rotation).toBe(rotation);
    expect(transform2dComponent.scale).toEqual(scale);
  });
});
