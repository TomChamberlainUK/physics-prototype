import { describe, expect, it, vi } from 'vitest';
import { Collider2dComponent } from '#/components';
import * as getVerticesModule from '#/components/Collider2dComponent/logic/getVertices';

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
    expect(component.localVertices).toBeNull();
    expect(component.worldVertices).toBeNull();
  });

  it('Should instantiate with a box shape', () => {
    const width = 2;
    const height = 3;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const expectedVertices = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ];
    const getVerticesSpy = vi.spyOn(getVerticesModule, 'default');
    getVerticesSpy.mockReturnValue(expectedVertices);
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
    expect(getVerticesSpy).toHaveBeenCalledWith(component.shape);
    expect(component.localVertices).toEqual(expectedVertices);
    expect(component.worldVertices).toBeNull();
  });
});
