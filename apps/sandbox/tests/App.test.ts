import { render, screen } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '#/App.svelte';

describe('App', () => {
  const startGameMock = vi.hoisted(() => vi.fn());
  const SandboxGameMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(() => ({
        start: startGameMock,
      }))
  ));

  beforeAll(() => {
    vi.mock(import('#/SandboxGame'), () => ({
      default: SandboxGameMock,
    }));
  });

  beforeEach(() => {
    render(App);
  });

  it('Should render a canvas', () => {
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('Should instantiate a SandboxGame', () => {
    expect(SandboxGameMock).toHaveBeenCalled();
  });

  it('Should start the game', () => {
    expect(startGameMock).toHaveBeenCalled();
  });
});
