import Collider2dComponent from '#/components/Collider2dComponent';
import { describe, expect, it } from 'vitest';

describe('Collider2dComponent', () => {
  it('Should instantiate', () => {
    const component = new Collider2dComponent({
      shape: {
        type: 'circle',
        radius: 1,
      },
    });
    expect(component).toBeInstanceOf(Collider2dComponent);
    expect(component.name).toBe('Collider2d');
    expect(component.shape).toEqual({
      type: 'circle',
      radius: 1,
    });
  });
})