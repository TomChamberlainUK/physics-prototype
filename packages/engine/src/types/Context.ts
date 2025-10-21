import type { KeyboardInput } from '#/input';
import type Renderer from '#/Renderer';
import type { BroadPhaseCollisionPair } from './BroadPhaseCollisionPair';
import type { CollisionPair } from './CollisionPair';

export type Context = {
  alpha?: number;
  broadPhaseCollisionPairs?: BroadPhaseCollisionPair[];
  collisionPairs?: CollisionPair[];
  deltaTime?: number;
  input?: KeyboardInput;
  renderer?: Renderer;
};
