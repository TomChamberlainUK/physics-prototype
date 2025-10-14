import Collider2dComponent from '#/components/Collider2dComponent';
import { describe, expect, it } from 'vitest';

describe('Collider2dComponent', () => {
  it('Should instantiate with a circle shape', () => {
    const radius = 1;
    const component = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius,
      },
    });
    expect(component).toBeInstanceOf(Collider2dComponent);
    expect(component.name).toBe('Collider2d');
    expect(component.shape).toEqual({
      type: 'circle',
      radius,
    });
    expect(component.aabb).toBeNull();
  });

  it('Should instantiate with a box shape', () => {
    const width = 2;
    const height = 3;
    const component = new Collider2dComponent({
      shape: {
        type: 'box',
        width,
        height,
      },
    });
    expect(component).toBeInstanceOf(Collider2dComponent);
    expect(component.name).toBe('Collider2d');
    expect(component.shape).toEqual({
      type: 'box',
      width,
      height,
    });
    expect(component.aabb).toBeNull();
  });
});
