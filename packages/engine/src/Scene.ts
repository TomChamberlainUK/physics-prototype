import type Entity from './Entity';
import type Renderer from './Renderer';
import type System from './systems/System';
import type { Context, SceneCommand } from './types';

/**
 * The Scene class manages entities and systems within the game.
 */
export default class Scene {
  /** The list of commands in the scene. */
  commands: SceneCommand[] = [];
  /** The list of entities in the scene. */
  entities: Entity[] = [];
  /** The list of systems in the scene. */
  systems: System[] = [];
  /** The context shared across systems. */
  context: Context = {};

  /**
   * Sets the context for the scene.
   * @param context - The context to set.
   */
  setContext(context: Context) {
    this.context = context;
  }

  /**
   * Adds an entity to the scene.
   * @param entity - The entity to add.
   */
  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  /**
   * Removes an entity from the scene.
   * @param entityId - The ID of the entity to remove.
   */
  removeEntity(entityId: string) {
    this.entities = this.entities.filter(
      entity => entity.id !== entityId,
    );
  }

  /**
   * Adds a system to the scene.
   * @param system - The system to add.
   */
  addSystem(system: System) {
    this.systems.push(system);
  }

  /**
   * Executes all scene commands and clears the command list.
   */
  executeCommands() {
    for (const command of this.commands) {
      switch (command.type) {
        case 'spawnEntity':
          this.addEntity(command.entity);
          break;
        case 'despawnEntity':
          this.removeEntity(command.entityId);
          break;
      }
    }
    this.commands = [];
  }

  /**
   * Gets a system by name.
   * @param name - The name of the system to get.
   * @returns The system with the specified name.
   * @throws Error if the system does not exist.
   */
  getSystem<T extends System>(name: string): T {
    const system = this.systems.find(system => system.name === name);
    if (!system) {
      throw new Error(`Could not find system "${name}" in scene`);
    }
    return system as T;
  }

  /**
   * Updates all sync systems in the scene.
   */
  updateSync() {
    for (const system of this.systems) {
      if (system.type !== 'sync') continue;
      system.update(this.entities, {
        ...this.context,
        sceneCommands: this.commands,
      });
    }
  }

  /**
   * Updates all physics systems in the scene.
   * @param deltaTime - The time elapsed since the last update.
   */
  updatePhysics(deltaTime: number) {
    this.context.deltaTime = deltaTime;
    for (const system of this.systems) {
      if (system.type !== 'physics') continue;
      system.update(this.entities, this.context);
    }
  }

  /**
   * Updates all render systems in the scene.
   * @param alpha - The interpolation factor for rendering.
   * @param renderer - The renderer used for rendering.
   */
  updateRender({
    alpha,
    renderer,
  }: {
    /** The interpolation factor for rendering. */
    alpha: number;
    /** The renderer used for rendering. */
    renderer: Renderer;
  }) {
    this.context.alpha = alpha;
    this.context.renderer = renderer;
    for (const system of this.systems) {
      if (system.type !== 'render') continue;
      system.update(this.entities, this.context);
    }
  }
}
