import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import Renderer from '#src/Renderer.js';
import { RenderDebug2dSystem } from '#src/systems/index.js';
import * as getBroadPhaseCollisionPairsSetModule from '#src/systems/RenderDebug2dSystem/logic/getBroadPhaseCollisionPairsSet.js';
import * as getNarrowPhaseCollisionPairsMapModule from '#src/systems/RenderDebug2dSystem/logic/getNarrowPhaseCollisionPairsMap.js';
import * as renderAABBModule from '#src/systems/RenderDebug2dSystem/logic/renderAABB.js';
import * as renderColliderModule from '#src/systems/RenderDebug2dSystem/logic/renderCollider.js';
import * as renderContactPointsModule from '#src/systems/RenderDebug2dSystem/logic/renderContactPoints.js';
import * as renderPotentialCollisionLineModule from '#src/systems/RenderDebug2dSystem/logic/renderPotentialCollisionLine.js';
import type { BroadPhaseCollisionPair, Context, NarrowPhaseCollisionPair } from '#src/types/index.js';

describe('RenderDebug2dSystem', () => {
  let system: RenderDebug2dSystem;

  beforeEach(() => {
    system = new RenderDebug2dSystem();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(system).toBeInstanceOf(RenderDebug2dSystem);
      expect(system.name).toBe('RenderDebug2dSystem');
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

    describe('When debug is disabled', () => {
      it('Should do nothing', () => {
        const renderer = new Renderer(document.createElement('canvas'));
        const renderAABBSpy = vi.spyOn(renderAABBModule, 'default');
        system.update([], {
          renderer,
          showDebug: false,
        });
        expect(renderAABBSpy).not.toHaveBeenCalled();
      });
    });

    describe('When passed a renderer and debug is enabled', () => {
      let renderer: Renderer;
      let context: Context;

      let getBroadPhaseCollisionPairsSetSpy: MockInstance<typeof getBroadPhaseCollisionPairsSetModule.default>;
      let getNarrowPhaseCollisionPairsMapSpy: MockInstance<typeof getNarrowPhaseCollisionPairsMapModule.default>;
      let renderAABBSpy: MockInstance<typeof renderAABBModule.default>;
      let renderColliderSpy: MockInstance<typeof renderColliderModule.default>;
      let renderContactPointsSpy: MockInstance<typeof renderContactPointsModule.default>;
      let renderPotentialCollisionLineSpy: MockInstance<typeof renderPotentialCollisionLineModule.default>;

      beforeAll(() => {
        getBroadPhaseCollisionPairsSetSpy = vi.spyOn(getBroadPhaseCollisionPairsSetModule, 'default');
        getNarrowPhaseCollisionPairsMapSpy = vi.spyOn(getNarrowPhaseCollisionPairsMapModule, 'default');
        renderAABBSpy = vi.spyOn(renderAABBModule, 'default');
        renderColliderSpy = vi.spyOn(renderColliderModule, 'default');
        renderContactPointsSpy = vi.spyOn(renderContactPointsModule, 'default');
        renderPotentialCollisionLineSpy = vi.spyOn(renderPotentialCollisionLineModule, 'default');
      });

      beforeEach(() => {
        renderer = new Renderer(document.createElement('canvas'));
        context = {
          renderer,
          showDebug: true,
        };
      });

      afterEach(() => {
        getBroadPhaseCollisionPairsSetSpy.mockClear();
        getNarrowPhaseCollisionPairsMapSpy.mockClear();
        renderAABBSpy.mockClear();
        renderColliderSpy.mockClear();
        renderContactPointsSpy.mockClear();
        renderPotentialCollisionLineSpy.mockClear();
      });

      afterAll(() => {
        getBroadPhaseCollisionPairsSetSpy.mockRestore();
        getNarrowPhaseCollisionPairsMapSpy.mockRestore();
        renderAABBSpy.mockRestore();
        renderColliderSpy.mockRestore();
        renderContactPointsSpy.mockRestore();
        renderPotentialCollisionLineSpy.mockRestore();
      });

      it('Should get a set of broad phase collision pairs from the context', () => {
        const broadPhaseCollisionPairs: BroadPhaseCollisionPair[] = [
          [new Entity(), new Entity()],
        ];
        system.update([], {
          ...context,
          broadPhaseCollisionPairs,
        });
        expect(getBroadPhaseCollisionPairsSetSpy).toHaveBeenCalledWith(broadPhaseCollisionPairs);
      });

      it('Should get a map of narrow phase collision pairs from the context', () => {
        const narrowPhaseCollisionPairs: NarrowPhaseCollisionPair[] = [
          {
            entityA: new Entity(),
            entityB: new Entity(),
            contactManifold: {
              normal: new Vector2d(),
              overlap: 0,
              contactPoints: [],
            },
          },
        ];
        system.update([], {
          ...context,
          narrowPhaseCollisionPairs,
        });
        expect(getNarrowPhaseCollisionPairsMapSpy).toHaveBeenCalledWith(narrowPhaseCollisionPairs);
      });

      it('Should render a collider for each entity', () => {
        const entities = [
          new Entity(),
          new Entity(),
        ];
        const alpha = 0.5;
        system.update(entities, {
          ...context,
          alpha,
          broadPhaseCollisionPairs: [],
        });
        for (const entity of entities) {
          expect(renderColliderSpy).toHaveBeenCalledWith(entity, {
            alpha,
            renderer,
          });
        }
      });

      it('Should render an AABB for each entity', () => {
        const entities = [
          new Entity(),
          new Entity(),
        ];
        const alpha = 0.5;
        const broadPhaseCollisionPairsSet = new Set<string>();
        getBroadPhaseCollisionPairsSetSpy.mockReturnValue(broadPhaseCollisionPairsSet);
        system.update(entities, {
          ...context,
          alpha,
          broadPhaseCollisionPairs: [],
        });
        for (const entity of entities) {
          expect(renderAABBSpy).toHaveBeenCalledWith(entity, {
            alpha,
            broadPhaseCollisionPairsSet,
            renderer,
          });
        }
      });

      it('Should render potential collision lines for each broad phase collision pair', () => {
        const broadPhaseCollisionPairs: BroadPhaseCollisionPair[] = [
          [new Entity(), new Entity()],
          [new Entity(), new Entity()],
        ];
        const alpha = 0.5;
        const narrowPhaseCollisionPairsMap = new Map<string, Set<string>>();
        getNarrowPhaseCollisionPairsMapSpy.mockReturnValue(narrowPhaseCollisionPairsMap);
        system.update([], {
          ...context,
          alpha,
          broadPhaseCollisionPairs,
        });
        for (const [entityA, entityB] of broadPhaseCollisionPairs) {
          expect(renderPotentialCollisionLineSpy).toHaveBeenCalledWith(entityA, entityB, {
            alpha,
            narrowPhaseCollisionPairsMap,
            renderer,
          });
        }
      });

      it('Should render contact points for each narrow phase collision pair', () => {
        const alpha = 1;
        const narrowPhaseCollisionPair: NarrowPhaseCollisionPair = {
          entityA: new Entity(),
          entityB: new Entity(),
          contactManifold: {
            normal: new Vector2d(),
            overlap: 0,
            contactPoints: [new Vector2d(), new Vector2d()],
          },
        };
        system.update([], {
          ...context,
          narrowPhaseCollisionPairs: [narrowPhaseCollisionPair],
        });
        expect(renderContactPointsSpy).toHaveBeenCalledWith(
          narrowPhaseCollisionPair.contactManifold.contactPoints,
          {
            alpha,
            renderer,
          },
        );
      });
    });
  });
});
