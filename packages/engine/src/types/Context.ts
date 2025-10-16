import type { KeyboardInput } from '#/input';
import type Renderer from '#/Renderer';
import type { CollisionPair } from './CollisionPair';

export type Context = {
  alpha?: number;
  collisionPairs?: CollisionPair[];
  deltaTime?: number;
  input?: KeyboardInput;
  renderer?: Renderer;
};
