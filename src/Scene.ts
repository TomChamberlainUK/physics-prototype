import type Entity from './Entity';
import type { Context } from './types';

type System = (entities: Entity[], context: Context) => void;

export default class Scene {
  entities: Entity[];
  systems: System[] = [];
  context: Context = {};

  constructor() {
    this.entities = [];
  }

  setContext(context: Context) {
    this.context = context;
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  update(deltaTime: number) {
    for (const system of this.systems) {
      system(this.entities, {
        ...this.context,
        deltaTime,
      });
    }
  }
}
