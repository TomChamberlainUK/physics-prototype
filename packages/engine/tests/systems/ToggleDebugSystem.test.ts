import { ToggleDebugSystem, type Context } from '#src/index.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ToggleDebugSystem', () => {
  let system: ToggleDebugSystem;

  describe('constructor', () => {
    beforeEach(() => {
      system = new ToggleDebugSystem();
    });

    it('Should instanciate', () => {
      expect(system).toBeInstanceOf(ToggleDebugSystem);
      expect(system.name).toBe('ToggleDebugSystem');
      expect(system.type).toBe('input');
    });
  });

  describe('update', () => {
    let context: Context;

    beforeEach(() => {
      system = new ToggleDebugSystem();
      context = {};
    });

    describe('When the toggleDebug action is triggered', () => {
      beforeEach(() => {
        // @ts-expect-error - we only need the wasTriggered method for this test
        context.actions = {
          wasTriggered: () => true,
        };
        context.showDebug = false;
      });

      it('Should toggle showDebug in the context', () => {
        system.update([], context);
        expect(context.showDebug).toBe(true);
      });
    });

    describe('When the toggleDebug action is not triggered', () => {
      beforeEach(() => {
        // @ts-expect-error - we only need the wasTriggered method for this test
        context.actions = {
          wasTriggered: () => false,
        };
        context.showDebug = false;
      });

      it('Should not toggle showDebug in the context', () => {
        system.update([], context);
        expect(context.showDebug).toBe(false);
      });
    });

    describe('When there are no actions in the context', () => {
      beforeEach(() => {
        context.showDebug = false;
      });

      it('Should not throw an error', () => {
        expect(() => system.update([], context)).not.toThrow();
      });

      it('Should not toggle showDebug in the context', () => {
        system.update([], context);
        expect(context.showDebug).toBe(false);
      });
    });
  });
});
