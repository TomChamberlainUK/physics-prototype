import { describe, expect, it, vi } from 'vitest';
import { Events } from '#/core';

describe('Events', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const events = new Events();
      expect(events).toBeInstanceOf(Events);
    });
  });

  describe('on()', () => {
    it('Should register an event listener', () => {
      const events = new Events();
      const event = 'testEvent';
      const handler = vi.fn();
      events.on(event, handler);
      const listeners = events.listeners.get(event);
      expect(listeners).toBeDefined();
      expect(listeners).toContain(handler);
    });
  });

  describe('off()', () => {
    it('Should remove a registered event listener', () => {
      const events = new Events();
      const event = 'testEvent';
      const handler = vi.fn();
      events.on(event, handler);
      events.off(event, handler);
      const listeners = events.listeners.get(event);
      expect(listeners).toBeDefined();
      expect(listeners).not.toContain(handler);
    });
  });

  describe('emit()', () => {
    it('Should invoke registered event listeners with provided arguments', () => {
      const events = new Events();
      const event = 'testEvent';
      const handler = vi.fn();
      const args = ['hello', 'world'];
      events.on(event, handler);
      events.emit(event, ...args);
      expect(handler).toHaveBeenCalledWith(...args);
    });
  });
});
