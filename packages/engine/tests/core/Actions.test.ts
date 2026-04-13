import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Actions, Events } from '#src/core/index.js';
import type { ControlScheme } from '#src/types/index.js';

describe('Actions', () => {
  let actionManager: Actions;
  let controlScheme: ControlScheme;
  let events: Events;

  let eventsOnSpy: MockInstance<typeof events.on>;

  const stateActionControl = { key: 'x', action: 'testStateAction', actionType: 'state' } as const;
  const triggerActionControl = { key: 'y', action: 'testTriggerAction', actionType: 'trigger' } as const;

  beforeEach(() => {
    controlScheme = [
      stateActionControl,
      triggerActionControl,
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

    it('Should subscribe to state start events', () => {
      expect(eventsOnSpy).toHaveBeenCalledWith(
        `${stateActionControl.action}:start`,
        expect.any(Function),
      );
    });

    it('Should subscribe to state stop events', () => {
      expect(eventsOnSpy).toHaveBeenCalledWith(
        `${stateActionControl.action}:stop`,
        expect.any(Function),
      );
    });

    it('Should subscribe to trigger events', () => {
      expect(eventsOnSpy).toHaveBeenCalledWith(
        `${triggerActionControl.action}`,
        expect.any(Function),
      );
    });
  });

  describe('isActive()', () => {
    it('Should return false for inactive state actions', () => {
      expect(actionManager.isActive(stateActionControl.action)).toBe(false);
    });

    it('Should return true for started state actions', () => {
      events.emit(`${stateActionControl.action}:start`);
      expect(actionManager.isActive(stateActionControl.action)).toBe(true);
    });

    it('Should return false for stopped state actions', () => {
      events.emit(`${stateActionControl.action}:start`);
      expect(actionManager.isActive(stateActionControl.action)).toBe(true);
      events.emit(`${stateActionControl.action}:stop`);
      expect(actionManager.isActive(stateActionControl.action)).toBe(false);
    });

    it('Should return false for trigger actions', () => {
      events.emit(triggerActionControl.action);
      expect(actionManager.isActive(triggerActionControl.action)).toBe(false);
    });
  });

  describe('wasTriggered()', () => {
    it('Should return true for triggered actions', () => {
      events.emit(triggerActionControl.action);
      expect(actionManager.wasTriggered(triggerActionControl.action)).toBe(true);
    });

    it('Should return false for state actions', () => {
      events.emit(`${stateActionControl.action}:start`);
      expect(actionManager.wasTriggered(stateActionControl.action)).toBe(false);
    });
  });

  describe('clearTriggers()', () => {
    it('Should clear triggered actions', () => {
      events.emit(triggerActionControl.action);
      expect(actionManager.wasTriggered(triggerActionControl.action)).toBe(true);
      actionManager.clearTriggers();
      expect(actionManager.wasTriggered(triggerActionControl.action)).toBe(false);
    });

    it('Should not affect active state actions', () => {
      events.emit(`${stateActionControl.action}:start`);
      expect(actionManager.isActive(stateActionControl.action)).toBe(true);
      actionManager.clearTriggers();
      expect(actionManager.isActive(stateActionControl.action)).toBe(true);
    });
  });
});
