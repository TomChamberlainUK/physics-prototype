import type { ControlScheme } from '#/types';
import type Events from './Events';

/**
 * Parameters for constructing an Actions.
 */
type ConstructorParams = {
  controlScheme: ControlScheme;
  events: Events;
};

/**
 * Manages actions based on a control scheme and events emitted by an event emitter.
 */
export default class Actions {
  /** Set of active actions */
  #actions: Set<string> = new Set();

  /**
   * Creates an instance of Actions.
   * @param controlScheme - The control scheme defining actions and their types.
   * @param events - The events emitter to listen for action events.
   */
  constructor({ controlScheme, events }: ConstructorParams) {
    for (const { action, actionType } of controlScheme) {
      if (actionType !== 'state') {
        continue;
      }
      events.on(`${action}:start`, () => this.#actions.add(action));
      events.on(`${action}:stop`, () => this.#actions.delete(action));
    }
  }

  /**
   * Checks if the specified action is currently active.
   * @param action - The action to check.
   * @returns True if the action is active, false otherwise.
   */
  has(action: string) {
    return this.#actions.has(action);
  }
}
