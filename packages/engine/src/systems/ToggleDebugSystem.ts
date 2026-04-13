import type Entity from '#src/Entity.js';
import type { Context } from '#src/types/Context.js';
import System from './System.js';

/**
 * An input system that toggles debug mode.
 */
export default class ToggleDebugSystem extends System {
  name = 'ToggleDebugSystem';
  type = 'input';

  update(_entities: Entity[], context: Context) {
    if (!context.actions) {
      return;
    }

    if (context.actions.wasTriggered('toggleDebug')) {
      context.showDebug = !context.showDebug;
    }
  }
}
