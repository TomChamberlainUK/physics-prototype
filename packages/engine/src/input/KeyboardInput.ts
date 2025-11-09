import type { Events } from '#/core';
import type { ControlScheme } from '#/types';

type ConstructorParams = {
  /** The control scheme for mapping keys to events. */
  controlScheme?: ControlScheme;
  /** The event emitter for emitting input events. */
  events?: Events | null;
};

/**
 * Keyboard input handler.
 */
export default class KeyboardInput {
  /** The control scheme for the keyboard input. */
  #controlScheme: ControlScheme;
  /** The event emitter for emitting input events. */
  #events: Events | null;
  /** The set of currently pressed keys. */
  #keys: Set<string>;
  /** The keydown event handler. */
  #keydownHandler: (event: KeyboardEvent) => void;
  /** The keyup event handler. */
  #keyupHandler: (event: KeyboardEvent) => void;

  /**
   * Creates an instance of the KeyboardInput class.
   */
  constructor({
    controlScheme = [],
    events = null,
  }: ConstructorParams = {}) {
    this.#controlScheme = controlScheme;
    this.#events = events;
    this.#keys = new Set<string>();
    this.#keydownHandler = (event) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      this.pressKey(key);
    };
    this.#keyupHandler = (event) => {
      const key = event.key.toLowerCase();
      this.releaseKey(key);
    };
  }

  /**
   * Enables the keyboard input handler.
   */
  enable() {
    window.addEventListener('keydown', this.#keydownHandler);
    window.addEventListener('keyup', this.#keyupHandler);
  }

  /**
   * Disables the keyboard input handler.
   */
  disable() {
    window.removeEventListener('keydown', this.#keydownHandler);
    window.removeEventListener('keyup', this.#keyupHandler);
  }

  /**
   * Checks if a key is currently pressed.
   * @param key - The key to check
   * @returns True if the key is pressed, false otherwise.
   */
  isPressed(key: string): boolean {
    return this.#keys.has(key);
  }

  /**
   * Presses a key.
   * @param key - The key to press.
   */
  pressKey(key: string) {
    this.#keys.add(key);
    if (this.#events) {
      for (const { key: controlKey, action, actionType } of this.#controlScheme) {
        if (key === controlKey) {
          switch (actionType) {
            case 'trigger':
              this.#events.emit(action);
              break;
            case 'state': {
              this.#events.emit(`${action}:start`);
              break;
            }
          }
        }
      }
    }
  }

  /**
   * Releases a key.
   * @param key - The key to release.
   */
  releaseKey(key: string) {
    this.#keys.delete(key);
    if (this.#events) {
      for (const { key: controlKey, action, actionType } of this.#controlScheme) {
        if (key === controlKey) {
          switch (actionType) {
            case 'state':
              this.#events.emit(`${action}:stop`);
              break;
          }
        }
      }
    }
  }
}
