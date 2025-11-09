import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Actions, EventEmitter } from '#/core';
import type { ControlScheme } from '#/types';

describe('Actions', () => {
  let actionManager: Actions;
  let controlScheme: ControlScheme;
  let eventEmitter: EventEmitter;

  let eventEmitterOnSpy: MockInstance<typeof eventEmitter.on>;

  beforeEach(() => {
    controlScheme = [
      { key: 'x', action: 'testStateAction', actionType: 'state' },
      { key: 'y', action: 'testTriggerAction', actionType: 'trigger' },
    ];
    eventEmitter = new EventEmitter();
    eventEmitterOnSpy = vi.spyOn(eventEmitter, 'on');
    actionManager = new Actions({
      controlScheme,
      eventEmitter,
    });
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(actionManager).toBeInstanceOf(Actions);
    });

    it('Should register actions on state events', () => {
      for (const { action, actionType } of controlScheme) {
        if (actionType === 'state') {
          expect(eventEmitterOnSpy).toHaveBeenCalledWith(
            `${action}:start`,
            expect.any(Function),
          );
          expect(eventEmitterOnSpy).toHaveBeenCalledWith(
            `${action}:stop`,
            expect.any(Function),
          );
        }
      }
    });

    it('Should not register actions on trigger events', () => {
      for (const { action, actionType } of controlScheme) {
        if (actionType === 'trigger') {
          expect(eventEmitterOnSpy).not.toHaveBeenCalledWith(
            `${action}:start`,
            expect.any(Function),
          );
          expect(eventEmitterOnSpy).not.toHaveBeenCalledWith(
            `${action}:stop`,
            expect.any(Function),
          );
        }
      }
    });
  });

  describe('has()', () => {
    it('Should return true for active actions', () => {
      eventEmitter.emit('testStateAction:start');
      expect(actionManager.has('testStateAction')).toBe(true);
    });

    it('Should return false for inactive actions', () => {
      expect(actionManager.has('testStateAction')).toBe(false);
    });
  });
});
