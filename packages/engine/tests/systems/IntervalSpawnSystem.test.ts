import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntervalSpawnSystem } from '#/systems';
import type { Context } from 'engine';

describe('IntervalSpawnSystem', () => {
  const spawner = vi.fn();

  afterEach(() => {
    spawner.mockClear();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      const interval = 1;
      const minEntities = 5;
      const maxEntities = 10;

      const system = new IntervalSpawnSystem({
        interval,
        minEntities,
        maxEntities,
        spawner,
      });

      expect(system).toBeInstanceOf(IntervalSpawnSystem);
      expect(system.name).toBe('IntervalSpawnSystem');
      expect(system.type).toBe('sync');
      expect(system.interval).toBe(interval);
      expect(system.minEntities).toBe(minEntities);
      expect(system.maxEntities).toBe(maxEntities);
      expect(system.spawner).toBe(spawner);
    });
  });

  describe('update()', () => {
    describe('When deltaTime is greater than or equal to interval', () => {
      const deltaTime = 0.2;
      const interval = 0.2;

      let context: Context;

      beforeEach(() => {
        context = {
          deltaTime,
          sceneCommands: [],
        };
      });

      describe('And minEntities has not been reached', () => {
        it('Should spawn entities until minEntities is reached', () => {
          const system = new IntervalSpawnSystem({
            interval,
            minEntities: 3,
            maxEntities: 10,
            spawner,
          });

          spawner.mockImplementation(() => {
            const callCount = spawner.mock.calls.length;
            return { id: `test-entity-${callCount}` };
          });

          system.update([], context);

          expect(spawner).toHaveBeenCalledTimes(3);
          expect(context.sceneCommands).toEqual([
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-1' },
            },
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-2' },
            },
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-3' },
            },
          ]);
        });
      });

      describe('And minEntities has been reached', () => {
        it('Should spawn an entity', () => {
          const system = new IntervalSpawnSystem({
            interval,
            minEntities: 1,
            maxEntities: 10,
            spawner,
          });

          spawner.mockReturnValue({ id: 'test-entity' });

          system.update([], context);

          expect(spawner).toHaveBeenCalled();
          expect(context.sceneCommands).toEqual([
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity' },
            },
          ]);
        });
      });

      describe('And maxEntities has been exceeded', () => {
        it('Should despawn the oldest spawned entity', () => {
          const system = new IntervalSpawnSystem({
            interval,
            minEntities: 0,
            maxEntities: 2,
            spawner,
          });

          spawner.mockImplementation(() => {
            const callCount = spawner.mock.calls.length;
            return { id: `test-entity-${callCount}` };
          });

          // Spawn first entity
          system.update([], context);
          // Spawn second entity
          system.update([], context);
          // Spawn third entity, which should trigger despawn of first entity
          system.update([], context);

          expect(spawner).toHaveBeenCalledTimes(3);
          expect(context.sceneCommands).toEqual([
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-1' },
            },
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-2' },
            },
            {
              type: 'spawnEntity',
              entity: { id: 'test-entity-3' },
            },
            {
              type: 'despawnEntity',
              entityId: 'test-entity-1',
            },
          ]);
        });
      });
    });

    describe('When deltaTime is less than interval', () => {
      const deltaTime = 0.1;
      const interval = 0.2;

      it('Should not spawn an entity', () => {
        const context = {
          deltaTime,
          sceneCommands: [],
        };
        const system = new IntervalSpawnSystem({
          interval,
          minEntities: 1,
          maxEntities: 10,
          spawner,
        });

        system.update([], context);

        expect(spawner).not.toHaveBeenCalled();
        expect(context.sceneCommands).toEqual([]);
      });
    });
  });
});
