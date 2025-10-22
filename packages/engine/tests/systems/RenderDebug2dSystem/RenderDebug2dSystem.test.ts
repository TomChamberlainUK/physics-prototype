import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Entity from '#/Entity';
import Renderer from '#/Renderer';
import { RenderDebug2dSystem } from '#/systems';
import * as getBroadPhaseCollisionPairsSetModule from '#/systems/RenderDebug2dSystem/logic/getBroadPhaseCollisionPairsSet';
import * as renderAABBModule from '#/systems/RenderDebug2dSystem/logic/renderAABB';
import type { BroadPhaseCollisionPair } from '#/types';

describe('RenderDebug2dSystem', () => {
  let system: RenderDebug2dSystem;

  beforeEach(() => {
    system = new RenderDebug2dSystem();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(system).toBeInstanceOf(RenderDebug2dSystem);
      expect(system.type).toBe('render');
    });
  });

  describe('update()', () => {
    describe('When not passed a renderer in the context', () => {
      it('Should do nothing', () => {
        const renderAABBSpy = vi.spyOn(renderAABBModule, 'default');
        system.update([], {});
        expect(renderAABBSpy).not.toHaveBeenCalled();
      });
    });

    describe('When passed a renderer in the context', () => {
      let renderer: Renderer;

      let getBroadPhaseCollisionPairsSetSpy: MockInstance<typeof getBroadPhaseCollisionPairsSetModule.default>;
      let renderAABBSpy: MockInstance<typeof renderAABBModule.default>;

      beforeAll(() => {
        getBroadPhaseCollisionPairsSetSpy = vi.spyOn(getBroadPhaseCollisionPairsSetModule, 'default');
        renderAABBSpy = vi.spyOn(renderAABBModule, 'default');
      });

      beforeEach(() => {
        renderer = new Renderer(document.createElement('canvas'));
      });

      afterEach(() => {
        getBroadPhaseCollisionPairsSetSpy.mockClear();
        renderAABBSpy.mockClear();
      });

      afterAll(() => {
        getBroadPhaseCollisionPairsSetSpy.mockRestore();
        renderAABBSpy.mockRestore();
      });

      it('Should get a set of broad phase collision pairs from the context', () => {
        const broadPhaseCollisionPairs: BroadPhaseCollisionPair[] = [
          [new Entity(), new Entity()],
        ];
        system.update([], { renderer, broadPhaseCollisionPairs });
        expect(getBroadPhaseCollisionPairsSetSpy).toHaveBeenCalledWith(broadPhaseCollisionPairs);
      });

      it('Should render an AABB for each entity', () => {
        const entities = [
          new Entity(),
          new Entity(),
        ];
        const alpha = 0.5;
        const broadPhaseCollisionPairsSet = new Set<string>();
        getBroadPhaseCollisionPairsSetSpy.mockReturnValue(broadPhaseCollisionPairsSet);
        system.update(entities, { alpha, renderer, broadPhaseCollisionPairs: [] });
        for (const entity of entities) {
          expect(renderAABBSpy).toHaveBeenCalledWith(entity, {
            alpha,
            broadPhaseCollisionPairsSet,
            renderer,
          });
        }
      });
    });
  });
});
