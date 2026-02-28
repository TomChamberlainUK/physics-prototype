import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';
import System from './System.js';

/** Properties for constructing an IntervalSpawnSystem. */
type ConstructorProps = {
  /** The interval (in seconds) at which to spawn entities. Defaults to 0.2 seconds. */
  interval?: number;
  /** The minimum number of entities to maintain. Defaults to 0. */
  minEntities?: number;
  /** The maximum number of entities to maintain. Defaults to 250. */
  maxEntities?: number;
  /** A function that spawns a new entity. */
  spawner: () => Entity;
};

/**
 * System that spawns entities at a specified interval, ensuring that the total number of spawned entities remains between the defined minimum and maximum limits.
 */
export default class IntervalSpawnSystem extends System {
  name = 'IntervalSpawnSystem';
  type = 'sync';
  /** The interval (in seconds) at which to spawn entities. */
  interval: number;
  /** The minimum number of entities to maintain. */
  minEntities: number;
  /** The maximum number of entities to maintain. */
  maxEntities: number;
  /** A function that spawns a new entity. */
  spawner: () => Entity;
  /** Internal list of spawned entity IDs to track entities spawned by this system. */
  #spawnedEntityIds: string[] = [];
  /** Internal timer to track time elapsed since the last spawn. */
  #timer = 0;

  /**
   * Constructs an IntervalSpawnSystem with the specified properties.
   * @param props - An object containing properties for the system, including interval, minEntities, maxEntities, and spawner function. See {@link ConstructorProps}.
   */
  constructor({
    interval = 0.2,
    minEntities = 0,
    maxEntities = 250,
    spawner,
  }: ConstructorProps) {
    super();
    this.interval = interval;
    this.minEntities = minEntities;
    this.maxEntities = maxEntities;
    this.spawner = spawner;
  }

  /**
   * Updates the system, spawning entities at the defined interval and maintaining the total number of spawned entities within the specified limits.
   * @param _entities - The current entities in the scene (not used in this system).
   * @param context - The scene context, including deltaTime and sceneCommands for spawning and despawning entities, see {@link Context}.
   */
  update(_entities: Entity[], context: Context) {
    if (!context.deltaTime || !context.sceneCommands) {
      return;
    }

    this.#timer += context.deltaTime;
    if (this.#timer < this.interval) {
      return;
    }
    this.#timer = 0;

    do {
      const spawnedEntity = this.spawner();
      context.sceneCommands.push({
        type: 'spawnEntity',
        entity: spawnedEntity,
      });
      this.#spawnedEntityIds.push(spawnedEntity.id);
    } while (this.#spawnedEntityIds.length < this.minEntities);

    if (this.#spawnedEntityIds.length > this.maxEntities) {
      const entityIdToDespawn = this.#spawnedEntityIds.shift();
      if (entityIdToDespawn) {
        context.sceneCommands.push({
          type: 'despawnEntity',
          entityId: entityIdToDespawn,
        });
      }
    }
  }
}
