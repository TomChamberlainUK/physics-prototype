import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';

/**
 * Base class for all systems.
 */
export default abstract class System {
  /** The name of the system. */
  abstract name: string;
  /** The type of the system. */
  abstract type: string;
  /**
   * Updates the system with the given entities and context.
   * @param entities - The entities to update.
   * @param context - The context for the update.
   */
  abstract update(entities: Entity[], context: Context): void;
}
