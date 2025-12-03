import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Events } from '#/core';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import Renderer from '#/Renderer';
import { RenderDebug2dSystem } from '#/systems';
import * as getBroadPhaseCollisionPairsSetModule from '#/systems/RenderDebug2dSystem/logic/getBroadPhaseCollisionPairsSet';
import * as getNarrowPhaseCollisionPairsMapModule from '#/systems/RenderDebug2dSystem/logic/getNarrowPhaseCollisionPairsMap';
import * as renderAABBModule from '#/systems/RenderDebug2dSystem/logic/renderAABB';
import * as renderColliderModule from '#/systems/RenderDebug2dSystem/logic/renderCollider';
import * as renderContactPointsModule from '#/systems/RenderDebug2dSystem/logic/renderContactPoints';
import * as renderPotentialCollisionLineModule from '#/systems/RenderDebug2dSystem/logic/renderPotentialCollisionLine';
import type { BroadPhaseCollisionPair, NarrowPhaseCollisionPair } from '#/types';

describe('RenderDebug2dSystem', () => {
  let system: RenderDebug2dSystem;
  let events: Events;
  let eventsOnSpy: MockInstance<typeof events.on>;

  beforeEach(() => {
    events = new Events();
    eventsOnSpy = vi.spyOn(events, 'on');
    system = new RenderDebug2dSystem({ events });
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(system).toBeInstanceOf(RenderDebug2dSystem);
      expect(system.name).toBe('RenderDebug2dSystem');
      expect(system.type).toBe('render');
      expect(system.enabled).toBe(true);
    });

    it('Should subscribe to the toggleDebug event', () => {
      expect(eventsOnSpy).toHaveBeenCalledWith('toggleDebug', expect.any(Function));
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

    describe('When the system is disabled', () => {
      it('Should do nothing', () => {
        const renderer = new Renderer(document.createElement('canvas'));
        system.enabled = false;
        const renderAABBSpy = vi.spyOn(renderAABBModule, 'default');
        system.update([], { renderer });
        expect(renderAABBSpy).not.toHaveBeenCalled();
      });
    });

    describe('When passed a renderer in the context', () => {
      let renderer: Renderer;

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
        system.update([], { renderer, broadPhaseCollisionPairs });
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
        system.update([], { renderer, narrowPhaseCollisionPairs });
        expect(getNarrowPhaseCollisionPairsMapSpy).toHaveBeenCalledWith(narrowPhaseCollisionPairs);
      });

      it('Should render a collider for each entity', () => {
        const entities = [
          new Entity(),
          new Entity(),
        ];
        const alpha = 0.5;
        system.update(entities, { alpha, renderer, broadPhaseCollisionPairs: [] });
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
        system.update(entities, { alpha, renderer, broadPhaseCollisionPairs: [] });
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
        system.update([], { alpha, renderer, broadPhaseCollisionPairs });
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
        system.update([], { renderer, narrowPhaseCollisionPairs: [narrowPhaseCollisionPair] });
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

  describe('When the toggleDebug event is emitted', () => {
    it('Should toggle the enabled state', () => {
      events.emit('toggleDebug');
      expect(system.enabled).toBe(false);
      events.emit('toggleDebug');
      expect(system.enabled).toBe(true);
    });
  });
});
