import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from '#/core';

describe('EventEmitter', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const eventEmitter = new EventEmitter();
      expect(eventEmitter).toBeInstanceOf(EventEmitter);
    });
  });

  describe('on()', () => {
    it('Should register an event listener', () => {
      const eventEmitter = new EventEmitter();
      const event = 'testEvent';
      const handler = vi.fn();
      eventEmitter.on(event, handler);
      const listeners = eventEmitter.listeners.get(event);
      expect(listeners).toBeDefined();
      expect(listeners).toContain(handler);
    });
  });

  describe('off()', () => {
    it('Should remove a registered event listener', () => {
      const eventEmitter = new EventEmitter();
      const event = 'testEvent';
      const handler = vi.fn();
      eventEmitter.on(event, handler);
      eventEmitter.off(event, handler);
      const listeners = eventEmitter.listeners.get(event);
      expect(listeners).toBeDefined();
      expect(listeners).not.toContain(handler);
    });
  });

  describe('emit()', () => {
    it('Should invoke registered event listeners with provided arguments', () => {
      const eventEmitter = new EventEmitter();
      const event = 'testEvent';
      const handler = vi.fn();
      const args = ['hello', 'world'];
      eventEmitter.on(event, handler);
      eventEmitter.emit(event, ...args);
      expect(handler).toHaveBeenCalledWith(...args);
    });
  });
});
