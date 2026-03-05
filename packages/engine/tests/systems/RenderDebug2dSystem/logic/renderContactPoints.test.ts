import { afterAll, afterEach, beforeAll, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Vector2d } from '#src/maths/index.js';
import Renderer from '#src/Renderer.js';
import { renderContactPoints } from '#src/systems/RenderDebug2dSystem/logic/index.js';
import { expectCallOrder } from '../../../utils/index.js';

describe('renderContactPoints', () => {
  let renderer: Renderer;

  let rendererSaveSpy: MockInstance<typeof renderer.save>;
  let rendererTranslateSpy: MockInstance<typeof renderer.translate>;
  let rendererDrawCircleSpy: MockInstance<typeof renderer.drawCircle>;
  let rendererRestoreSpy: MockInstance<typeof renderer.restore>;

  beforeAll(() => {
    renderer = new Renderer(document.createElement('canvas'));
    rendererSaveSpy = vi.spyOn(renderer, 'save');
    rendererTranslateSpy = vi.spyOn(renderer, 'translate');
    rendererDrawCircleSpy = vi.spyOn(renderer, 'drawCircle');
    rendererRestoreSpy = vi.spyOn(renderer, 'restore');
  });

  afterEach(() => {
    rendererSaveSpy.mockClear();
    rendererTranslateSpy.mockClear();
    rendererDrawCircleSpy.mockClear();
    rendererRestoreSpy.mockClear();
  });

  afterAll(() => {
    rendererSaveSpy.mockRestore();
    rendererTranslateSpy.mockRestore();
    rendererDrawCircleSpy.mockRestore();
    rendererRestoreSpy.mockRestore();
  });

  it('Should render a contact points at the correct position', () => {
    const contactPoint = new Vector2d({ x: 10, y: 20 });
    renderContactPoints([contactPoint], { renderer });
    expect(rendererSaveSpy).toHaveBeenCalled();
    expect(rendererTranslateSpy).toHaveBeenNthCalledWith(1, contactPoint);
    expect(rendererDrawCircleSpy).toHaveBeenCalled();
    expect(rendererDrawCircleSpy).toHaveBeenNthCalledWith(1, { radius: 2, fillColor: 'red' });
    expect(rendererRestoreSpy).toHaveBeenCalled();
    expectCallOrder([
      rendererSaveSpy,
      rendererTranslateSpy,
      rendererDrawCircleSpy,
      rendererRestoreSpy,
    ]);
  });

  it('Should render multiple contact points', () => {
    const contactPointA = new Vector2d({ x: 10, y: 20 });
    const contactPointB = new Vector2d({ x: -5, y: 15 });
    renderContactPoints([contactPointA, contactPointB], { renderer });
    expect(rendererSaveSpy).toHaveBeenCalledTimes(2);
    expect(rendererTranslateSpy).toHaveBeenNthCalledWith(1, contactPointA);
    expect(rendererTranslateSpy).toHaveBeenNthCalledWith(2, contactPointB);
    expect(rendererDrawCircleSpy).toHaveBeenCalledTimes(2);
    expect(rendererDrawCircleSpy).toHaveBeenNthCalledWith(1, { radius: 2, fillColor: 'red' });
    expect(rendererDrawCircleSpy).toHaveBeenNthCalledWith(2, { radius: 2, fillColor: 'red' });
    expect(rendererRestoreSpy).toHaveBeenCalledTimes(2);
  });
});
