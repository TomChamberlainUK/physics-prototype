import type { ControlScheme } from '#/types';
import type EventEmitter from './EventEmitter';

/**
 * Parameters for constructing an Actions.
 */
type ConstructorParams = {
  controlScheme: ControlScheme;
  eventEmitter: EventEmitter;
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
   * @param eventEmitter - The event emitter to listen for action events.
   */
  constructor({ controlScheme, eventEmitter }: ConstructorParams) {
    for (const { action, actionType } of controlScheme) {
      if (actionType !== 'state') {
        continue;
      }
      eventEmitter.on(`${action}:start`, () => this.#actions.add(action));
      eventEmitter.on(`${action}:stop`, () => this.#actions.delete(action));
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
