import { v4 as uuidv4 } from 'uuid';
import type { Component } from '#/components';

/**
 * Parameters for creating an Entity.
 */
type Params = {
  /** Optional name for the entity. */
  name?: string;
};

/**
 * An Entity is a container for components that define its behavior and data.
 */
export default class Entity {
  /** Unique identifier for the entity. */
  id: string;
  /** Map of components associated with the entity. */
  components: Map<string, Component>;
  /** Optional name for the entity. */
  name?: string;

  /**
   * Creates an instance of the Entity class.
   * @param name - Optional name for the entity.
   */
  constructor({ name }: Params = {}) {
    this.id = uuidv4();
    this.components = new Map();
    this.name = name;
  }

  /**
   * Adds a component to the entity.
   * @param component - The component to add.
   */
  addComponent(component: Component) {
    if (!this.components.has(component.name)) {
      this.components.set(component.name, component);
    }
  }

  /**
   * Adds multiple components to the entity.
   * @param components - The components to add.
   */
  addComponents(components: Component[]) {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  /**
   * Gets a component from the entity.
   * @param name - The name of the component.
   * @returns The component if found, otherwise throws an error.
   * @throws Error if the component does not exist.
   */
  getComponent<T extends Component>(name: string): T {
    if (!this.components.has(name)) {
      throw new Error(`Could not find component "${name}" on entity "${this.id}"`);
    }
    return this.components.get(name) as T;
  }

  /**
   * Checks if the entity has a specific component.
   * @param name - The name of the component.
   * @returns True if the component exists, otherwise false.
   */
  hasComponent(name: string) {
    return this.components.has(name);
  }

  /**
   * Checks if the entity has all specified components.
   * @param names - The names of the components.
   * @returns True if all components exist, otherwise false.
   */
  hasComponents(names: string[]) {
    return names.every(name => this.hasComponent(name));
  }

  /**
   * Removes a component from the entity.
   * @param name - The name of the component to remove.
   * @throws Error if the component does not exist.
   */
  removeComponent(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Could not remove component "${name}" from entity "${this.id}" because it does not exist`);
    }
    this.components.delete(name);
  }
}
