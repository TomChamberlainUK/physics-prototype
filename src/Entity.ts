import { v4 as uuidv4 } from 'uuid';
import type Component from './Component';

export default class Entity {
  id: string;
  components: Map<string, Component>;

  constructor() {
    this.id = uuidv4();
    this.components = new Map();
  }

  addComponent(component: Component) {
    if (!this.components.has(component.name)) {
      this.components.set(component.name, component);
    }
  }

  getComponent(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Could not find component "${name}" on entity "${this.id}"`);
    }
    return this.components.get(name);
  }

  hasComponent(name: string) {
    return this.components.has(name);
  }

  removeComponent(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Could not remove component "${name}" from entity "${this.id}" because it does not exist`);
    }
    this.components.delete(name);
  }
}
