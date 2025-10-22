import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import Renderer from '#/Renderer';
import renderCollider from '#/systems/RenderDebug2dSystem/logic/renderCollider';
import * as lerpModule from '#/utils/lerp';
import type { BoxShape, CircleShape } from '#/types';

describe('renderCollider', () => {
  let entity: Entity;
  let renderer: Renderer;

  let hasComponentsSpy: MockInstance<typeof entity.hasComponents>;
  let getComponentSpy: MockInstance<typeof entity.getComponent>;
  let lerpSpy: MockInstance<typeof lerpModule.default>;
  let drawBoxSpy: MockInstance<typeof renderer.drawBox>;
  let drawCircleSpy: MockInstance<typeof renderer.drawCircle>;

  beforeAll(() => {
    renderer = new Renderer(document.createElement('canvas'));
    lerpSpy = vi.spyOn(lerpModule, 'default');
    drawBoxSpy = vi.spyOn(renderer, 'drawBox');
    drawCircleSpy = vi.spyOn(renderer, 'drawCircle');
  });

  beforeEach(() => {
    entity = new Entity();
    hasComponentsSpy = vi.spyOn(entity, 'hasComponents');
    getComponentSpy = vi.spyOn(entity, 'getComponent');
  });

  afterEach(() => {
    lerpSpy.mockClear();
    drawBoxSpy.mockClear();
    drawCircleSpy.mockClear();
  });

  afterAll(() => {
    lerpSpy.mockRestore();
    drawBoxSpy.mockRestore();
    drawCircleSpy.mockRestore();
  });

  it('Should check that the entity has the required components', () => {
    renderCollider(entity, { renderer });
    expect(hasComponentsSpy).toHaveBeenCalledWith(['Collider2d', 'Transform2d']);
  });

  describe('When the entity does not have the required components', () => {
    it('Should not attempt to get the components', () => {
      renderCollider(entity, { renderer });
      expect(getComponentSpy).not.toHaveBeenCalled();
    });

    it('Should not attempt to interpolate the position', () => {
      renderCollider(entity, { renderer });
      expect(lerpSpy).not.toHaveBeenCalled();
    });

    it('Should not attempt to render anything', () => {
      renderCollider(entity, { renderer });
      expect(drawBoxSpy).not.toHaveBeenCalled();
      expect(drawCircleSpy).not.toHaveBeenCalled();
    });
  });

  describe('When the entity has the required components', () => {
    const strokeColor = 'rgb(255, 255, 0)';

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
      renderCollider(entity, { renderer });
      expect(getComponentSpy).toHaveBeenCalledWith('Transform2d');
      expect(getComponentSpy).toHaveBeenCalledWith('Collider2d');
    });

    it('Should interpolate the transform position based on the alpha', () => {
      const alpha = 0.5;
      const previousPosition = new Vector2d({ x: 0, y: 0 });
      const currentPosition = new Vector2d({ x: 100, y: 100 });
      transform.previousPosition = previousPosition;
      transform.position = currentPosition;
      renderCollider(entity, { alpha, renderer });
      expect(lerpSpy).toHaveBeenCalledWith(previousPosition.x, currentPosition.x, alpha);
      expect(lerpSpy).toHaveBeenCalledWith(previousPosition.y, currentPosition.y, alpha);
    });

    describe('When passed an entity with a box collider', () => {
      beforeEach(() => {
        collider.shape = {
          type: 'box',
          width: 32,
          height: 32,
        };
      });

      it('Should render a box', () => {
        const shape = collider.shape as BoxShape;
        renderCollider(entity, { renderer });
        expect(drawBoxSpy).toHaveBeenCalledWith({
          x: transform.position.x,
          y: transform.position.y,
          width: shape.width,
          height: shape.height,
          strokeColor,
        });
      });
    });

    describe('When passed an entity with a circle collider', () => {
      beforeEach(() => {
        collider.shape = {
          type: 'circle',
          radius: 16,
        };
      });

      it('Should render a circle', () => {
        const shape = collider.shape as CircleShape;
        renderCollider(entity, { renderer });
        expect(drawCircleSpy).toHaveBeenCalledWith({
          x: transform.position.x,
          y: transform.position.y,
          radius: shape.radius,
          strokeColor,
        });
      });
    });
  });
});
