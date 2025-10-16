import type Entity from './Entity';
import type Renderer from './Renderer';
import type System from './systems/System';
import type { Context } from './types';

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

  updateSync() {
    for (const system of this.systems) {
      if (system.type !== 'sync') continue;
      system.update(this.entities, this.context);
    }
  }

  updatePhysics(deltaTime: number) {
    this.context.deltaTime = deltaTime;
    for (const system of this.systems) {
      if (system.type !== 'physics') continue;
      system.update(this.entities, this.context);
    }
  }

  updateRender() {
    for (const system of this.systems) {
      if (system.type !== 'render') continue;
      system.update(this.entities, this.context);
    }
  }
}
