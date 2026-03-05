import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#src/components/index.js';
import Entity from '#src/Entity.js';
import { Vector2d } from '#src/maths/index.js';
import Renderer from '#src/Renderer.js';
import { renderAABB } from '#src/systems/RenderDebug2dSystem/logic/index.js';
import * as lerpModule from '#src/utils/lerp.js';

describe('renderAABB', () => {
  let broadPhaseCollisionPairsSet: Set<string>;
  let entity: Entity;
  let renderer: Renderer;

  beforeAll(() => {
    renderer = new Renderer(document.createElement('canvas'));
  });

  beforeEach(() => {
    entity = new Entity();
    broadPhaseCollisionPairsSet = new Set<string>();
  });

  it('Should check that an entity has the required components', () => {
    const hasComponentsSpy = vi.spyOn(entity, 'hasComponents');
    renderAABB(entity, { broadPhaseCollisionPairsSet, renderer });
    expect(hasComponentsSpy).toHaveBeenCalledWith(['Transform2d', 'Collider2d']);
  });

  describe('When the entity does not have the required components', () => {
    it('Should not attempt to get the required components', () => {
      const getComponentSpy = vi.spyOn(entity, 'getComponent');
      renderAABB(entity, { broadPhaseCollisionPairsSet, renderer });
      expect(getComponentSpy).not.toHaveBeenCalled();
    });
  });

  describe('When the entity has the required components', () => {
    let transform: Transform2dComponent;
    let collider: Collider2dComponent;

    beforeEach(() => {
      transform = new Transform2dComponent();
      collider = new Collider2dComponent({
        shape: {
          type: 'circle',
          radius: 16,
        },
      });
      entity.addComponents([
        transform,
        collider,
      ]);
    });

    it('Should get the required components', () => {
      const getComponentSpy = vi.spyOn(entity, 'getComponent');
      renderAABB(entity, { broadPhaseCollisionPairsSet, renderer });
      expect(getComponentSpy).toHaveBeenCalledWith('Transform2d');
      expect(getComponentSpy).toHaveBeenCalledWith('Collider2d');
    });

    describe('When the collider does not have an AABB', () => {
      it.todo('Should not attempt to render the AABB', () => {

      });
    });

    describe('When the collider has an AABB', () => {
      beforeEach(() => {
        collider.aabb = {
          min: { x: -16, y: -16 },
          max: { x: 16, y: 16 },
        };
      });

      it('Should interpolate the transform position based on the alpha', () => {
        const alpha = 0.5;
        const previousPosition = new Vector2d({ x: 0, y: 0 });
        const currentPosition = new Vector2d({ x: 100, y: 100 });
        transform.previousPosition = previousPosition;
        transform.position = currentPosition;
        const lerpSpy = vi.spyOn(lerpModule, 'default');
        renderAABB(entity, { broadPhaseCollisionPairsSet, alpha, renderer });
        expect(lerpSpy).toHaveBeenCalledWith(previousPosition.x, currentPosition.x, alpha);
        expect(lerpSpy).toHaveBeenCalledWith(previousPosition.y, currentPosition.y, alpha);
      });

      it('Should render the AABB', () => {
        const lerpX = 50;
        const lerpY = 50;
        const lerpSpy = vi.spyOn(lerpModule, 'default');
        lerpSpy.mockImplementationOnce(() => lerpX);
        lerpSpy.mockImplementationOnce(() => lerpY);
        const drawBoxSpy = vi.spyOn(renderer, 'drawBox');
        renderAABB(entity, { broadPhaseCollisionPairsSet, renderer });
        expect(drawBoxSpy).toHaveBeenCalledWith({
          x: 50,
          y: 50,
          width: collider.aabb!.max.x - collider.aabb!.min.x,
          height: collider.aabb!.max.y - collider.aabb!.min.y,
          strokeColor: 'rgb(0, 255, 0)',
        });
      });

      describe('When the entity is in the broad phase collision pairs set', () => {
        beforeEach(() => {
          broadPhaseCollisionPairsSet.add(entity.id);
        });

        it('Should render the AABB with a red stroke color', () => {
          const drawBoxSpy = vi.spyOn(renderer, 'drawBox');
          renderAABB(entity, { broadPhaseCollisionPairsSet, renderer });
          expect(drawBoxSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              strokeColor: 'rgb(255, 0, 0)',
            }),
          );
        });
      });
    });
  });
});
