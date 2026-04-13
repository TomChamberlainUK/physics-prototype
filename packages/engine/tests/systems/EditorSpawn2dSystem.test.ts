import { EditorSpawn2dSystem, type Context } from '#src/index.js';
import { describe, expect, it, vi } from 'vitest';

describe('EditorSpawn2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const spawner = vi.fn();
      const system = new EditorSpawn2dSystem({
        spawner,
      });
      expect(system).toBeInstanceOf(EditorSpawn2dSystem);
      expect(system.name).toBe('EditorSpawn2dSystem');
      expect(system.type).toBe('input');
      expect(system.spawner).toBe(spawner);
    });
  });

  describe('update()', () => {
    describe('When a spawn action was triggered', () => {
      it('Should add a spawnEntity command to the scene commands', () => {
        const mockEntity = { id: 'test-entity' };
        const spawner = vi.fn().mockReturnValue(mockEntity);
        const system = new EditorSpawn2dSystem({
          spawner,
        });

        const mockPosition = { x: 100, y: 200 };
        const context: Context = {
          // @ts-expect-error - we only need the wasTriggered method for this test
          actions: {
            wasTriggered: vi.fn().mockReturnValue(true),
          },
          // @ts-expect-error - we only need the getPosition method for this test
          mouseInput: {
            getPosition: vi.fn().mockReturnValue(mockPosition),
          },
          sceneCommands: [],
        };

        system.update([], context);

        expect(context.actions!.wasTriggered).toHaveBeenCalledWith('spawn');
        expect(spawner).toHaveBeenCalledWith(mockPosition);
        expect(context.sceneCommands).toContainEqual({
          type: 'spawnEntity',
          entity: mockEntity,
        });
      });
    });

    describe('When there is no spawn action triggered', () => {
      it('Should not add a spawnEntity command to the scene commands', () => {
        const spawner = vi.fn();
        const system = new EditorSpawn2dSystem({
          spawner,
        });

        const context: Context = {
          // @ts-expect-error - we only need the wasTriggered method for this test
          actions: {
            wasTriggered: vi.fn().mockReturnValue(false),
          },
          // @ts-expect-error - we only need the getPosition method for this test
          mouseInput: {
            getPosition: vi.fn(),
          },
          sceneCommands: [],
        };

        system.update([], context);

        expect(context.actions!.wasTriggered).toHaveBeenCalledWith('spawn');
        expect(spawner).not.toHaveBeenCalled();
        expect(context.sceneCommands).not.toContainEqual(
          expect.objectContaining({ type: 'spawnEntity' }),
        );
      });
    });

    describe('When there are no actions in the context', () => {
      it('Should not throw an error', () => {
        const system = new EditorSpawn2dSystem({
          spawner: vi.fn(),
        });

        const context: Context = {
          // @ts-expect-error - we only need the getPosition method for this test
          mouseInput: {
            getPosition: vi.fn(),
          },
          sceneCommands: [],
        };

        expect(() => system.update([], context)).not.toThrow();
      });
    });

    describe('When there is no mouseInput in the context', () => {
      it('Should not throw an error', () => {
        const system = new EditorSpawn2dSystem({
          spawner: vi.fn(),
        });

        const context: Context = {
          // @ts-expect-error - we only need the wasTriggered method for this test
          actions: {
            wasTriggered: vi.fn(),
          },
          sceneCommands: [],
        };

        expect(() => system.update([], context)).not.toThrow();
      });
    });

    describe('When there are no sceneCommands in the context', () => {
      it('Should not throw an error', () => {
        const system = new EditorSpawn2dSystem({
          spawner: vi.fn(),
        });

        const context: Context = {
          // @ts-expect-error - we only need the wasTriggered method for this test
          actions: {
            wasTriggered: vi.fn(),
          },
          // @ts-expect-error - we only need the getPosition method for this test
          mouseInput: {
            getPosition: vi.fn(),
          },
        };

        expect(() => system.update([], context)).not.toThrow();
      });
    });
  });
});
