import type { ControlScheme } from '#src/types/index.js';
import type Events from './Events.js';

/**
 * Parameters for constructing an Actions.
 */
type ConstructorParams = {
  controlScheme: ControlScheme;
  events: Events;
};

/**
 * A class that manages the state of actions based on a control scheme and events.
 * It tracks both state and trigger actions.
 */
export default class Actions {
  #state: Set<string> = new Set();
  #trigger: Set<string> = new Set();

  /**
   * Creates an instance of Actions.
   * @param controlScheme - The control scheme defining actions and their types.
   * @param events - The events emitter to listen for action events.
   */
  constructor({ controlScheme, events }: ConstructorParams) {
    for (const { action, actionType } of controlScheme) {
      switch (actionType) {
        case 'state':
          events.on(`${action}:start`, () => this.#state.add(action));
          events.on(`${action}:stop`, () => this.#state.delete(action));
          break;
        case 'trigger':
          events.on(`${action}`, () => this.#trigger.add(action));
          break;
      }
    }
  }

  /**
   * Checks if a state action is currently active.
   * @param action - The name of the action to check.
   * @returns True if the action is active, false otherwise.
   */
  isActive(action: string): boolean {
    return this.#state.has(action);
  }

  /**
   * Checks if a trigger action has been triggered since the last check.
   * @param action - The name of the action to check.
   * @returns True if the action has been triggered, false otherwise.
   */
  wasTriggered(action: string): boolean {
    return this.#trigger.has(action);
  }

  /**
   * Clears all triggered actions. Should be called at the end of each update cycle.
   */
  clearTriggers() {
    this.#trigger.clear();
  }
}
