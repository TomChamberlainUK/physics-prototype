import type { KeyboardInput } from '#/input';
import type { CollisionPair } from './CollisionPair';

export type Context = {
  collisionPairs?: CollisionPair[];
  deltaTime?: number;
  input?: KeyboardInput;
};
