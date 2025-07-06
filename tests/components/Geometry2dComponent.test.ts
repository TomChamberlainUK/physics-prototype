import { describe, expect, it } from 'vitest';
import { Geometry2dComponent } from '#/components';

describe('Geometry2dComponent', () => {
  it('Should instantiate', () => {
    const geometry2dComponent = new Geometry2dComponent();
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.color).toBe('white');
    expect(geometry2dComponent.radius).toBe(32);
    expect(geometry2dComponent.type).toBe('circle');
  });
});
