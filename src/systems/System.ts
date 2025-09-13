import type Entity from '#/Entity';
import type { Context } from '#/types';

export default abstract class System {
  abstract type: string;
  abstract update(entities: Entity[], context: Context): void;
}