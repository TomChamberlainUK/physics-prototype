/**
 * A simple event emitter class that allows registering event listeners.
 */
export default class EventEmitter {
  #listeners: Map<string, Array<(...args: unknown[]) => void>> = new Map();

  /**
   * Gets the registered event listeners.
   */
  get listeners() {
    return this.#listeners;
  }

  /**
   * Registers an event listener for the specified event.
   * @param event - The name of the event to listen for.
   * @param callback - The callback function to invoke when the event is emitted.
   */
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event)?.push(callback);
  }

  /**
   * Removes a registered event listener for the specified event.
   * @param event - The name of the event.
   * @param callback - The callback function to remove.
   */
  off(event: string, callback: (...args: unknown[]) => void) {
    const listeners = this.#listeners.get(event);
    if (!listeners) return;
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emits an event, invoking all registered listeners with the provided arguments.
   * @param event - The name of the event to emit.
   * @param args - The arguments to pass to the event listeners.
   */
  emit(event: string, ...args: unknown[]) {
    const listeners = this.#listeners.get(event);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(...args);
    }
  }
}
