import type Entity from '#/Entity';
import type { Context } from '#/types';
import System from './System';

export default class RenderClear2dSystem extends System {
  type = 'render';

  update(_entities: Entity[], { renderer }: Context) {
    if (!renderer) return;

    renderer.clear();
    renderer.resetOrigin();
  }
}
