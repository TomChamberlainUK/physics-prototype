import { describe, expect, it } from 'vitest';
import { Geometry2dComponent } from '#/components';

describe('Geometry2dComponent', () => {
  const color = 'black';
  const strokeColor = 'white';

  it('Should instantiate with a circle shape', () => {
    const radius = 64;
    const geometry2dComponent = new Geometry2dComponent({
      color,
      strokeColor,
      shape: {
        type: 'circle',
        radius,
      },
    });
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.color).toBe(color);
    expect(geometry2dComponent.strokeColor).toBe(strokeColor);
    expect(geometry2dComponent.shape).toEqual({
      type: 'circle',
      radius,
    });
  });

  it('Should instantiate with a box shape', () => {
    const width = 32;
    const height = 16;
    const geometry2dComponent = new Geometry2dComponent({
      color,
      strokeColor,
      shape: {
        type: 'box',
        width,
        height,
      },
    });
    expect(geometry2dComponent).toBeInstanceOf(Geometry2dComponent);
    expect(geometry2dComponent.name).toBe('Geometry2d');
    expect(geometry2dComponent.color).toBe(color);
    expect(geometry2dComponent.strokeColor).toBe(strokeColor);
    expect(geometry2dComponent.shape).toEqual({
      type: 'box',
      width,
      height,
    });
  });
});
