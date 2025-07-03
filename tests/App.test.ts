import { render, screen } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '#/App.svelte';

describe('App', () => {
  const mockRenderer = vi.hoisted(() => vi.fn());
  const mockDrawCircle = vi.hoisted(() => vi.fn());

  beforeAll(() => {
    vi.mock(import('#/Renderer'), () => {
      const Renderer = mockRenderer;
      Renderer.prototype.drawCircle = mockDrawCircle;
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
    expect(mockDrawCircle).toHaveBeenCalledWith({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 64,
      color: 'white',
    });
  });
});
