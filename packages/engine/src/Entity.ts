import { v4 as uuidv4 } from 'uuid';
import type { Component } from '#/components';

type Params = {
  name?: string;
};

export default class Entity {
  id: string;
  components: Map<string, Component>;
  name?: string;

  constructor({ name }: Params = {}) {
    this.id = uuidv4();
    this.components = new Map();
    this.name = name;
  }

  addComponent(component: Component) {
    if (!this.components.has(component.name)) {
      this.components.set(component.name, component);
    }
  }

  addComponents(components: Component[]) {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  getComponent<T extends Component>(name: string): T {
    if (!this.components.has(name)) {
      throw new Error(`Could not find component "${name}" on entity "${this.id}"`);
    }
    return this.components.get(name) as T;
  }

  hasComponent(name: string) {
    return this.components.has(name);
  }

  hasComponents(names: string[]) {
    return names.every(name => this.hasComponent(name));
  }

  removeComponent(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Could not remove component "${name}" from entity "${this.id}" because it does not exist`);
    }
    this.components.delete(name);
  }
}
