import System from './System.js';
import type { Context } from '#src/types/index.js';
import Entity from '#src/Entity.js';
import type Vector2d from '#src/maths/Vector2d.js';

type ConstuctorProps = {
  /** A function that spawns a new entity. */
  spawner: (position: Vector2d) => Entity;
};

/**
 * A system that handles spawning entities in the editor.
 */
export default class EditorSpawn2dSystem extends System {
  name = 'EditorSpawn2dSystem';
  type = 'input';
  spawner: (position: Vector2d) => Entity;

  constructor({ spawner }: ConstuctorProps) {
    super();
    this.spawner = spawner;
  }

  update(_entities: Entity[], { actions, mouseInput, sceneCommands }: Context) {
    if (!actions || !mouseInput || !sceneCommands) {
      return;
    }

    if (actions.wasTriggered('spawn')) {
      const position = mouseInput.getPosition();
      sceneCommands.push({
        type: 'spawnEntity',
        entity: this.spawner(position),
      });
    }
  }
}
