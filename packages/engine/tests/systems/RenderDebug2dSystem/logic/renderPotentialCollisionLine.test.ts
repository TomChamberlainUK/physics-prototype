import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { renderPotentialCollisionLine } from '#/systems/RenderDebug2dSystem/logic';
import Entity from '#/Entity';
import { Transform2dComponent } from '#/components';
import Renderer from '#/Renderer';
import * as lerpModule from '#/utils/lerp';
import { Vector2d } from '#/maths';

describe('renderPotentialCollisionLine', () => {
  let entityA: Entity;
  let entityB: Entity;
  let narrowPhaseCollisionPairsMap: Map<string, Set<string>>;
  let renderer: Renderer;

  let hasComponentASpy: MockInstance<typeof entityA.hasComponent>;
  let hasComponentBSpy: MockInstance<typeof entityB.hasComponent>;
  let getComponentASpy: MockInstance<typeof entityA.getComponent>;
  let getComponentBSpy: MockInstance<typeof entityB.getComponent>;

  beforeAll(() => {
    renderer = new Renderer(document.createElement('canvas'));
  });

  beforeEach(() => {
    entityA = new Entity();
    entityB = new Entity();
    narrowPhaseCollisionPairsMap = new Map();
    hasComponentASpy = vi.spyOn(entityA, 'hasComponent');
    hasComponentBSpy = vi.spyOn(entityB, 'hasComponent');
    getComponentASpy = vi.spyOn(entityA, 'getComponent');
    getComponentBSpy = vi.spyOn(entityB, 'getComponent');
  });

  it('Should check if each entity has the required components', () => {
    entityA.addComponent(new Transform2dComponent());
    entityB.addComponent(new Transform2dComponent());
    renderPotentialCollisionLine(entityA, entityB, { narrowPhaseCollisionPairsMap, renderer });
    expect(hasComponentASpy).toHaveBeenCalledWith('Transform2d');
    expect(hasComponentBSpy).toHaveBeenCalledWith('Transform2d');
  });

  describe('When the entities do not have the required components', () => {
    it('Should not attempt to get the required components', () => {
      renderPotentialCollisionLine(entityA, entityB, { narrowPhaseCollisionPairsMap, renderer });
      expect(getComponentASpy).not.toHaveBeenCalled();
      expect(getComponentBSpy).not.toHaveBeenCalled();
    });
  });

  describe('When both entities have the required components', () => {
    let transformA: Transform2dComponent;
    let transformB: Transform2dComponent;

    let drawLineSpy: MockInstance<typeof renderer.drawLine>;
    let lerpSpy: MockInstance<typeof lerpModule.default>;

    beforeAll(() => {
      drawLineSpy = vi.spyOn(renderer, 'drawLine');
      lerpSpy = vi.spyOn(lerpModule, 'default');
    });

    beforeEach(() => {
      transformA = new Transform2dComponent();
      transformB = new Transform2dComponent();
      entityA.addComponent(transformA);
      entityB.addComponent(transformB);
    });

    afterEach(() => {
      drawLineSpy.mockClear();
      lerpSpy.mockClear();
    });

    afterAll(() => {
      drawLineSpy.mockRestore();
      lerpSpy.mockRestore();
    });

    it('Should get the required components', () => {
      renderPotentialCollisionLine(entityA, entityB, { narrowPhaseCollisionPairsMap, renderer });
      expect(getComponentASpy).toHaveBeenCalledWith('Transform2d');
      expect(getComponentBSpy).toHaveBeenCalledWith('Transform2d');
    });

    it('Should interpolate the positions of both entities', () => {
      const alpha = 0.5;
      renderPotentialCollisionLine(entityA, entityB, { alpha, narrowPhaseCollisionPairsMap, renderer });
      expect(lerpSpy).toHaveBeenCalledWith(transformA.previousPosition.x, transformA.position.x, alpha);
      expect(lerpSpy).toHaveBeenCalledWith(transformA.previousPosition.y, transformA.position.y, alpha);
      expect(lerpSpy).toHaveBeenCalledWith(transformB.previousPosition.x, transformB.position.x, alpha);
      expect(lerpSpy).toHaveBeenCalledWith(transformB.previousPosition.y, transformB.position.y, alpha);
    });

    it('Should render the potential collision line', () => {
      transformA.position = new Vector2d({
        x: 0,
        y: 0,
      });
      transformB.position = new Vector2d({
        x: 100,
        y: 100,
      });
      renderPotentialCollisionLine(entityA, entityB, { narrowPhaseCollisionPairsMap, renderer });
      expect(drawLineSpy).toHaveBeenCalledWith({
        start: transformA.position,
        end: transformB.position,
        strokeColor: 'rgb(255, 255, 0)',
      });
    });

    describe('When entities map to each other in the narrow phase collision pairs map', () => {
      it('Should render the line in red', () => {
        narrowPhaseCollisionPairsMap.set(entityA.id, new Set([entityB.id]));
        renderPotentialCollisionLine(entityA, entityB, { narrowPhaseCollisionPairsMap, renderer });
        expect(drawLineSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            strokeColor: 'rgb(255, 0, 0)',
          }),
        );
      });
    });
  });
});
