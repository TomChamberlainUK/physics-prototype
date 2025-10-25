import type { KeyboardInput } from '#/input';
import type Renderer from '#/Renderer';
import type { BroadPhaseCollisionPair } from './BroadPhaseCollisionPair';
import type { NarrowPhaseCollisionPair } from './NarrowPhaseCollisionPair';

export type Context = {
  alpha?: number;
  broadPhaseCollisionPairs?: BroadPhaseCollisionPair[];
  deltaTime?: number;
  input?: KeyboardInput;
  narrowPhaseCollisionPairs?: NarrowPhaseCollisionPair[];
  renderer?: Renderer;
};
