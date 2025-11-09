import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Actions, Events } from '#/core';
import type { ControlScheme } from '#/types';

describe('Actions', () => {
  let actionManager: Actions;
  let controlScheme: ControlScheme;
  let events: Events;

  let eventsOnSpy: MockInstance<typeof events.on>;

  beforeEach(() => {
    controlScheme = [
      { key: 'x', action: 'testStateAction', actionType: 'state' },
      { key: 'y', action: 'testTriggerAction', actionType: 'trigger' },
    ];
    events = new Events();
    eventsOnSpy = vi.spyOn(events, 'on');
    actionManager = new Actions({
      controlScheme,
      events,
    });
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(actionManager).toBeInstanceOf(Actions);
    });

    it('Should register actions on state events', () => {
      for (const { action, actionType } of controlScheme) {
        if (actionType === 'state') {
          expect(eventsOnSpy).toHaveBeenCalledWith(
            `${action}:start`,
            expect.any(Function),
          );
          expect(eventsOnSpy).toHaveBeenCalledWith(
            `${action}:stop`,
            expect.any(Function),
          );
        }
      }
    });

    it('Should not register actions on trigger events', () => {
      for (const { action, actionType } of controlScheme) {
        if (actionType === 'trigger') {
          expect(eventsOnSpy).not.toHaveBeenCalledWith(
            `${action}:start`,
            expect.any(Function),
          );
          expect(eventsOnSpy).not.toHaveBeenCalledWith(
            `${action}:stop`,
            expect.any(Function),
          );
        }
      }
    });
  });

  describe('has()', () => {
    it('Should return true for active actions', () => {
      events.emit('testStateAction:start');
      expect(actionManager.has('testStateAction')).toBe(true);
    });

    it('Should return false for inactive actions', () => {
      expect(actionManager.has('testStateAction')).toBe(false);
    });
  });
});
