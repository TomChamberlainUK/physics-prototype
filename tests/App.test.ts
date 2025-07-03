import { render, screen } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '#/App.svelte';

describe('App', () => {
  const mockRenderer = vi.hoisted(() => vi.fn());
  const mockCtxArc = vi.hoisted(() => vi.fn());
  const mockCtxFill = vi.hoisted(() => vi.fn());

  beforeAll(() => {
    vi.mock(import('#/Renderer'), () => {
      const Renderer = mockRenderer;
      Renderer.prototype.ctx = {
        fillStyle: '#000',
        arc: mockCtxArc,
        fill: mockCtxFill,
      };
      return { default: Renderer };
    });
  });

  beforeEach(() => {
    render(App);
  });

  it('Should render a canvas', () => {
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('Should instantiate a Renderer', () => {
    expect(mockRenderer).toHaveBeenCalled();
  });

  it('Should render a white circle on the canvas', () => {
    const canvas = screen.getByTestId<HTMLCanvasElement>('canvas');
    expect(mockRenderer.prototype.ctx.fillStyle).toBe('white');
    expect(mockCtxArc).toHaveBeenCalledWith(
      canvas.width / 2,
      canvas.height / 2,
      64,
      0,
      2 * Math.PI,
    );
    expect(mockCtxFill).toHaveBeenCalled();
  });
});
