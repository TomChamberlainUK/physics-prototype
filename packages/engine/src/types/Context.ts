import type { KeyboardInput } from '#/input';
import type Renderer from '#/Renderer';
import type { BroadPhaseCollisionPair } from './BroadPhaseCollisionPair';
import type { NarrowPhaseCollisionPair } from './NarrowPhaseCollisionPair';

/**
 * The context object passed to systems during updates.
 */
export type Context = {
  /** The set of current actions being performed. */
  actions?: Set<string>;
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
};
