import type Entity from '#/Entity';
import type { Context } from '#/types';

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
