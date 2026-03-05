import type { Actions } from '#src/core/index.js';
import type { KeyboardInput } from '#src/input/index.js';
import type Renderer from '#src/Renderer.js';
import type { BroadPhaseCollisionPair } from './BroadPhaseCollisionPair.js';
import type { NarrowPhaseCollisionPair } from './NarrowPhaseCollisionPair.js';
import type { SceneCommand } from './SceneCommand.js';

/**
 * The context object passed to systems during updates.
 */
export type Context = {
  /** The set of current actions being performed. */
  actions?: Actions;
  /** The interpolation factor for rendering. */
  alpha?: number;
  /** Pairs of entities that are potentially colliding. */
  broadPhaseCollisionPairs?: BroadPhaseCollisionPair[];
  /** The time elapsed since the last update. */
  deltaTime?: number;
  /** The current input. */
  input?: KeyboardInput;
  /** Pairs of entities that are confirmed to be colliding. */
  narrowPhaseCollisionPairs?: NarrowPhaseCollisionPair[];
  /** The renderer used for rendering. */
  renderer?: Renderer;
  /** Scene commands to be processed. */
  sceneCommands?: SceneCommand[];
};
