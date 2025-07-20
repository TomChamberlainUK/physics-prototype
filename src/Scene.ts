import type Entity from './Entity';

type System = (entities: Entity[]) => void;

export default class Scene {
  entities: Entity[];
  systems: System[] = [];

  constructor() {
    this.entities = [];
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  update() {
    for (const system of this.systems) {
      system(this.entities);
    }
  }
}
