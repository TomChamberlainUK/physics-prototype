import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '#/core';
import { KeyboardInput } from '#/input';
import type { ControlScheme } from '#/types/ControlScheme';

describe('KeyboardInput', () => {
  let keyboardInput: KeyboardInput;
  let controlScheme: ControlScheme;
  let events: Events;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  beforeEach(() => {
    controlScheme = [];
    events = new Events();
    keyboardInput = new KeyboardInput({
      controlScheme,
      events,
    });
  });

  afterEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  afterAll(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(keyboardInput).toBeInstanceOf(KeyboardInput);
    });
  });

  describe('enable()', () => {
    it('Should add an event listener to capture keydown events', () => {
      keyboardInput.enable();
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(keyboardEvent);
      const isPressed = keyboardInput.isPressed('a');
      expect(isPressed).toBe(true);
    });

    it('Should add an event listener to capture keyup events', () => {
      keyboardInput.enable();
      expect(addEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      const keyboardEvent = new KeyboardEvent('keyup', { key: 'a' });
      window.dispatchEvent(keyboardEvent);
      const isPressed = keyboardInput.isPressed('a');
      expect(isPressed).toBe(false);
    });
  });

  describe('disable()', () => {
    it('Should remove the keydown event listener', () => {
      keyboardInput.enable();
      keyboardInput.disable();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      const addHandlerCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'keydown');
      const removeHandlerCall = removeEventListenerSpy.mock.calls.find(call => call[0] === 'keydown');
      expect(addHandlerCall).toBeDefined();
      expect(removeHandlerCall).toBeDefined();
      const addHandler = addHandlerCall![1];
      const removeHandler = removeHandlerCall![1];
      expect(removeHandler).toBe(addHandler);
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(keyboardEvent);
      const isPressed = keyboardInput.isPressed('a');
      expect(isPressed).toBe(false);
    });

    it('Should remove the keyup event listener', () => {
      keyboardInput.enable();
      keyboardInput.disable();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      const addHandlerCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'keyup');
      const removeHandlerCall = removeEventListenerSpy.mock.calls.find(call => call[0] === 'keyup');
      expect(addHandlerCall).toBeDefined();
      expect(removeHandlerCall).toBeDefined();
      const addHandler = addHandlerCall![1];
      const removeHandler = removeHandlerCall![1];
      expect(removeHandler).toBe(addHandler);
      const keyboardEvent = new KeyboardEvent('keyup', { key: 'a' });
      window.dispatchEvent(keyboardEvent);
      const isPressed = keyboardInput.isPressed('a');
      expect(isPressed).toBe(false);
    });
  });

  describe('isPressed()', () => {
    it('Should return true if a key is pressed', () => {
      const key = 'a';
      keyboardInput.pressKey(key);
      const isPressed = keyboardInput.isPressed(key);
      expect(isPressed).toBe(true);
    });

    it('Should return false if a key is not pressed', () => {
      const key = 'b';
      const isPressed = keyboardInput.isPressed(key);
      expect(isPressed).toBe(false);
    });
  });

  describe('pressKey()', () => {
    it('Should set a key to a pressed state', () => {
      const key = 'a';
      keyboardInput.pressKey(key);
      const isPressed = keyboardInput.isPressed(key);
      expect(isPressed).toBe(true);
    });

    describe('When an event emitter is provided', () => {
      describe('When the key pressed corresponds to a control scheme action with a type of "state"', () => {
        it('Should emit the corresponding start action for the pressed key', () => {
          const key = 'x';
          const action = 'testAction';
          controlScheme.push({ key, action, actionType: 'state' });
          const emitSpy = vi.spyOn(events, 'emit');
          keyboardInput.pressKey(key);
          expect(emitSpy).toHaveBeenCalledWith(`${action}:start`);
        });
      });

      describe('When the key pressed corresponds to a control scheme action with a type of "trigger"', () => {
        it('Should emit the corresponding action for the pressed key', () => {
          const key = 'x';
          const action = 'testAction';
          controlScheme.push({ key, action, actionType: 'trigger' });
          const emitSpy = vi.spyOn(events, 'emit');
          keyboardInput.pressKey(key);
          expect(emitSpy).toHaveBeenCalledWith(action);
        });
      });
    });
  });

  describe('releaseKey()', () => {
    it('Should remove a key from the pressed state', () => {
      const key = 'a';
      keyboardInput.pressKey(key);
      keyboardInput.releaseKey(key);
      const isPressed = keyboardInput.isPressed(key);
      expect(isPressed).toBe(false);
    });

    describe('When an event emitter is provided', () => {
      describe('When the key released corresponds to a control scheme action with a type of "state"', () => {
        it('Should emit the corresponding stop action for the released key', () => {
          const key = 'x';
          const action = 'testAction';
          controlScheme.push({ key, action, actionType: 'state' });
          const emitSpy = vi.spyOn(events, 'emit');
          keyboardInput.releaseKey(key);
          expect(emitSpy).toHaveBeenCalledWith(`${action}:stop`);
        });
      });
    });
  });
});
