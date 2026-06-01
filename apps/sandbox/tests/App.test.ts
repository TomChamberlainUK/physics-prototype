import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '#/App.svelte';
import SandboxGame from '#/SandboxGame';

const startGameMock = vi.hoisted(() => vi.fn());
const stopGameMock = vi.hoisted(() => vi.fn());

vi.mock('#/SandboxGame', () => ({
  default: vi.fn(class {
    start = startGameMock;
    stop = stopGameMock;
  }),
}));

describe('App', () => {
  let unmount: () => void;

  beforeEach(() => {
    const rendered = render(App);
    unmount = rendered.unmount;
  });

  afterEach(() => {
    startGameMock.mockClear();
    stopGameMock.mockClear();
  });

  it('Should render a canvas', () => {
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('Should instantiate a SandboxGame', () => {
    expect(SandboxGame).toHaveBeenCalled();
  });

  it('Should start the game', () => {
    expect(startGameMock).toHaveBeenCalled();
  });

  it('Should stop the game on unmount', () => {
    unmount();
    expect(stopGameMock).toHaveBeenCalled();
  });
});
