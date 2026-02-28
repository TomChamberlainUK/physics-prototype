import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/index.js';
import System from './System.js';

/**
 * A system that clears the renderer and resets the origin for 2D rendering.
 */
export default class RenderClear2dSystem extends System {
  name = 'RenderClear2dSystem';
  type = 'render';

  /**
   * Clears the renderer and resets the origin before rendering.
   * @param entities - The entities in the system.
   * @param context - The context containing the renderer.
   */
  update(_entities: Entity[], { renderer }: Context) {
    if (!renderer) return;

    renderer.clear();
    renderer.resetOrigin();
  }
}
