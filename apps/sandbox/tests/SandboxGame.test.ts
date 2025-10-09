import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Renderer } from 'engine';
import SandboxGame from '#/SandboxGame';
import { SandboxScene } from '#/scenes';

describe('SandboxGame', () => {
  let game: SandboxGame;

  const GameMock = vi.hoisted(() => (
    vi.fn()
  ));

  beforeAll(() => {
    vi.mock('engine', async () => ({
      ...(await vi.importActual('engine')),
      Game: GameMock,
    }));
  });

  beforeEach(() => {
    game = new SandboxGame({
      canvas: document.createElement('canvas'),
    });
  });

  it('Should instantiate', () => {
    expect(game).toBeInstanceOf(SandboxGame);
  });

  it('Should set a renderer', () => {
    expect(GameMock).toHaveBeenCalledWith(
      expect.objectContaining({
        renderer: expect.any(Renderer),
      }),
    );
  });

  it('Should set a scene', () => {
    expect(GameMock).toHaveBeenCalledWith(
      expect.objectContaining({
        scene: expect.any(SandboxScene),
      }),
    );
  });

  it('Should set physicsHz to 120', () => {
    expect(GameMock).toHaveBeenCalledWith(
      expect.objectContaining({
        physicsHz: 120,
      }),
    );
  });
});
