import type Events from '#src/core/Events.js';
import Vector2d from '#src/maths/Vector2d.js';
import type { ControlScheme } from '#src/types/ControlScheme.js';

type ConstructorParams = {
  /** A control scheme for mapping keys to events. */
  controlScheme?: ControlScheme;
  /** An event emitter for emitting input events. */
  events?: Events | null;
};

/**
 * Mouse input handler.
 */
export default class MouseInput {
  /** A set of currently pressed mouse buttons */
  #buttons: Set<string>;
  /** A control scheme for mapping keys to events. */
  #controlScheme: ControlScheme;
  /** An event emitter for emitting input events. */
  #events: Events | null;
  /** A handler for mousedown events */
  #mousedownHandler: (event: MouseEvent) => void;
  /** A handler for mouseup events */
  #mouseupHandler: (event: MouseEvent) => void;
  /** A handler for mousemove events */
  #mousemoveHandler: (event: MouseEvent) => void;
  /** The current position of the mouse */
  #position: Vector2d;
  /** The change in position of the mouse since the last update */
  #deltaPosition: Vector2d;

  constructor({
    controlScheme = [],
    events = null,
  }: ConstructorParams = {}) {
    this.#buttons = new Set<string>();
    this.#controlScheme = controlScheme;
    this.#events = events;
    this.#position = new Vector2d();
    this.#deltaPosition = new Vector2d();
    this.#mousedownHandler = (event) => {
      event.preventDefault();
      switch (event.button) {
        case 0:
          this.pressButton('leftclick');
          break;
        case 1:
          this.pressButton('middleclick');
          break;
        case 2:
          this.pressButton('rightclick');
          break;
        default:
      }
    };
    this.#mouseupHandler = (event) => {
      switch (event.button) {
        case 0:
          this.releaseButton('leftclick');
          break;
        case 1:
          this.releaseButton('middleclick');
          break;
        case 2:
          this.releaseButton('rightclick');
          break;
        default:
      }
    };
    this.#mousemoveHandler = (event) => {
      const x = event.clientX - (window.innerWidth / 2);
      const y = event.clientY - (window.innerHeight / 2);
      this.updatePosition({ x, y });
    };
  }

  /**
   * Enables the mouse input handler.
   */
  enable() {
    window.addEventListener('mousedown', this.#mousedownHandler);
    window.addEventListener('mouseup', this.#mouseupHandler);
    window.addEventListener('mousemove', this.#mousemoveHandler);
  }

  /**
   * Disables the mouse input handler.
   */
  disable() {
    window.removeEventListener('mousedown', this.#mousedownHandler);
    window.removeEventListener('mouseup', this.#mouseupHandler);
    window.removeEventListener('mousemove', this.#mousemoveHandler);
  }

  /**
   * Checks if a button is currently pressed
   * @param button - The button to check
   * @returns Whether the button is currently pressed
   */
  isPressed(button: string): boolean {
    return this.#buttons.has(button);
  }

  /**
   * Presses a button
   * @param button - The button to press
   */
  pressButton(button: string) {
    this.#buttons.add(button);
    if (!this.#events) {
      return;
    }
    for (const { action, actionType, key } of this.#controlScheme) {
      if (key === button) {
        switch (actionType) {
          case 'trigger':
            this.#events.emit(action);
            break;
          case 'state':
            this.#events.emit(`${action}:start`);
            break;
        }
      }
    }
  }

  /**
   * Releases a button
   * @param button - The button to release
   */
  releaseButton(button: string) {
    this.#buttons.delete(button);
    if (!this.#events) {
      return;
    }
    for (const { action, actionType, key } of this.#controlScheme) {
      if (key === button) {
        switch (actionType) {
          case 'state':
            this.#events.emit(`${action}:stop`);
            break;
        }
      }
    }
  }

  /**
   * Updates the current position of the mouse
   * @param x - The x coordinate of the mouse
   * @param y - The y coordinate of the mouse
   */
  updatePosition({ x, y }: { x: number; y: number }) {
    const deltaX = x - this.#position.x;
    const deltaY = y - this.#position.y;
    this.#deltaPosition.x = deltaX;
    this.#deltaPosition.y = deltaY;
    this.#position.x = x;
    this.#position.y = y;
    if (!this.#events) {
      return;
    }
    for (const { action, actionType, key } of this.#controlScheme) {
      if (key === 'mousemove') {
        switch (actionType) {
          case 'trigger':
            this.#events?.emit(action, { x, y, deltaX, deltaY });
            break;
        }
      }
    }
  }

  /**
   * Gets the current position of the mouse
   * @returns A Vector2d representing the current position of the mouse
   */
  getPosition(): Vector2d {
    return new Vector2d(this.#position);
  }

  /**
   * Gets the change in position of the mouse since the last update
   * @returns A Vector2d representing the change in position of the mouse since the last update
   */
  getDeltaPosition(): Vector2d {
    return new Vector2d(this.#deltaPosition);
  }
}
