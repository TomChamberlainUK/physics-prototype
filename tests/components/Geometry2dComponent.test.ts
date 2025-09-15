import { describe, expect, it } from 'vitest';
import { Geometry2dComponent } from '#/components';

describe('Geometry2dComponent', () => {
  it('Should instantiate with a circle shape', () => {
    const color = 'red';
    const radius = 64;
    const geometry2dComponent = new Geometry2dComponent({
      color,
      shape: {
        type: 'circle',
        radius,
      },
    });
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.color).toBe(color);
    expect(geometry2dComponent.shape).toEqual({
      type: 'circle',
      radius,
    });
  });

  it('Should instantiate with a box shape', () => {
    const color = 'blue';
    const width = 32;
    const height = 16;
    const geometry2dComponent = new Geometry2dComponent({
      color,
      shape: {
        type: 'box',
        width,
        height,
      },
    });
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.color).toBe(color);
    expect(geometry2dComponent.shape).toEqual({
      type: 'box',
      width,
      height,
    });
  });
});
