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
export default class Actions extends Set<string> {
  /**
   * Creates an instance of Actions.
   * @param controlScheme - The control scheme defining actions and their types.
   * @param events - The events emitter to listen for action events.
   */
  constructor({ controlScheme, events }: ConstructorParams) {
    super();
    for (const { action, actionType } of controlScheme) {
      if (actionType !== 'state') {
        continue;
      }
      events.on(`${action}:start`, () => this.add(action));
      events.on(`${action}:stop`, () => this.delete(action));
    }
  }
}
