export default class KeyboardInput {
  #keys: Set<string>;
  #keydownHandler: (event: KeyboardEvent) => void;
  #keyupHandler: (event: KeyboardEvent) => void;

  constructor() {
    this.#keys = new Set<string>();
    this.#keydownHandler = (event) => {
      this.pressKey(event.key);
    };
    this.#keyupHandler = (event) => {
      this.releaseKey(event.key);
    };
  }

  enable() {
    window.addEventListener('keydown', this.#keydownHandler);
    window.addEventListener('keyup', this.#keyupHandler);
  }

  disable() {
    window.removeEventListener('keydown', this.#keydownHandler);
    window.removeEventListener('keyup', this.#keyupHandler);
  }

  isPressed(key: string): boolean {
    return this.#keys.has(key);
  }

  pressKey(key: string) {
    this.#keys.add(key);
  }

  releaseKey(key: string) {
    this.#keys.delete(key);
  }
}
