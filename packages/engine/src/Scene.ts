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

  getSystem<T extends System>(name: string): T {
    const system = this.systems.find(system => system.name === name);
    if (!system) {
      throw new Error(`Could not find system "${name}" in scene`);
    }
    return system as T;
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

  updateRender({ alpha, renderer }: { alpha: number; renderer: Renderer }) {
    this.context.alpha = alpha;
    this.context.renderer = renderer;
    for (const system of this.systems) {
      if (system.type !== 'render') continue;
      system.update(this.entities, this.context);
    }
  }
}
