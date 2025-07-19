import { describe, expect, it } from 'vitest';
import { Geometry2dComponent } from '#/components';

describe('Geometry2dComponent', () => {
  it('Should instantiate', () => {
    const color = 'red';
    const radius = 64;
    const geometry2dComponent = new Geometry2dComponent({
      color,
      radius,
    });
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.type).toBe('circle');
    expect(geometry2dComponent.color).toBe(color);
    expect(geometry2dComponent.radius).toBe(radius);
  });
});
