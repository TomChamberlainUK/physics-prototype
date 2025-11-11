import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Geometry2dComponent, Transform2dComponent } from '#/components';
import Entity from '#/Entity';
import { Vector2d } from '#/maths';
import Renderer from '#/Renderer';
import Render2dSystem from '#/systems/Render2dSystem';
import * as lerpModule from '#/utils/lerp';

describe('Render2dSystem', () => {
  let canvas: HTMLCanvasElement;
  let renderer: Renderer;

  beforeAll(() => {
    canvas = document.createElement('canvas');
  });

  beforeEach(() => {
    renderer = new Renderer(canvas);
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new Render2dSystem();
      expect(system).toBeInstanceOf(Render2dSystem);
      expect(system.name).toBe('Render2dSystem');
      expect(system.type).toBe('render');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let system: Render2dSystem;

    let drawBoxSpy: MockInstance<typeof renderer.drawBox>;
    let drawCircleSpy: MockInstance<typeof renderer.drawCircle>;
    let saveSpy: MockInstance<typeof renderer.save>;
    let translateSpy: MockInstance<typeof renderer.translate>;
    let rotateSpy: MockInstance<typeof renderer.rotate>;
    let restoreSpy: MockInstance<typeof renderer.restore>;
    let lerpSpy: MockInstance<typeof lerpModule.default>;

    beforeAll(() => {
      lerpSpy = vi.spyOn(lerpModule, 'default');
    });

    beforeEach(() => {
      entity = new Entity();
      system = new Render2dSystem();
      drawBoxSpy = vi.spyOn(renderer, 'drawBox');
      drawCircleSpy = vi.spyOn(renderer, 'drawCircle');
      saveSpy = vi.spyOn(renderer, 'save');
      translateSpy = vi.spyOn(renderer, 'translate');
      rotateSpy = vi.spyOn(renderer, 'rotate');
      restoreSpy = vi.spyOn(renderer, 'restore');
    });

    afterEach(() => {
      drawBoxSpy.mockClear();
      drawCircleSpy.mockClear();
      lerpSpy.mockClear();
      saveSpy.mockClear();
      translateSpy.mockClear();
      rotateSpy.mockClear();
      restoreSpy.mockClear();
    });

    afterAll(() => {
      drawBoxSpy.mockRestore();
      drawCircleSpy.mockRestore();
      lerpSpy.mockRestore();
      saveSpy.mockRestore();
      translateSpy.mockRestore();
      rotateSpy.mockRestore();
      restoreSpy.mockRestore();
    });

    describe('When passed a renderer and entities with the required components', () => {
      const fillColor = 'black';
      const strokeColor = 'white';

      let transform2dComponent: Transform2dComponent;
      let geometry2dComponent: Geometry2dComponent;

      beforeEach(() => {
        transform2dComponent = new Transform2dComponent();
        geometry2dComponent = new Geometry2dComponent({
          fillColor,
          strokeColor,
          shape: {
            type: 'circle',
            radius: 16,
          },
        });
        entity.addComponent(transform2dComponent);
        entity.addComponent(geometry2dComponent);
      });

      it('Should save the renderer state', () => {
        system.update([entity], { alpha: 1, renderer });
        expect(saveSpy).toHaveBeenCalled();
      });

      it('Should translate the renderer to the entity position', () => {
        const position = new Vector2d({ x: 100, y: 150 });
        transform2dComponent.position = position;
        system.update([entity], { alpha: 1, renderer });
        expect(translateSpy).toHaveBeenCalledWith({ x: position.x, y: position.y });
      });

      it('Should interpolate the entity position based on the alpha value', () => {
        const alpha = 0.5;
        const previousPosition = new Vector2d({ x: 0, y: 0 });
        const currentPosition = new Vector2d({ x: 100, y: 100 });
        const expectedX = 50;
        const expectedY = 50;
        lerpSpy.mockImplementationOnce(() => expectedX);
        lerpSpy.mockImplementationOnce(() => expectedY);
        transform2dComponent.previousPosition = previousPosition;
        transform2dComponent.position = currentPosition;
        system.update([entity], { alpha, renderer });
        expect(lerpSpy).toHaveBeenNthCalledWith(1, previousPosition.x, currentPosition.x, alpha);
        expect(lerpSpy).toHaveBeenNthCalledWith(2, previousPosition.y, currentPosition.y, alpha);
        expect(translateSpy).toHaveBeenCalledWith({
          x: expectedX,
          y: expectedY,
        });
      });

      it('Should rotate the renderer to the entity rotation', () => {
        const rotation = 45;
        transform2dComponent.rotation = rotation;
        system.update([entity], { alpha: 1, renderer });
        expect(rotateSpy).toHaveBeenCalledWith(rotation);
      });

      it('Should interpolate the entity rotation based on the alpha value', () => {
        const alpha = 0.5;
        const previousRotation = 0;
        const currentRotation = 90;
        const expectedRotation = 45;
        lerpSpy.mockImplementation(() => expectedRotation);
        transform2dComponent.previousRotation = previousRotation;
        transform2dComponent.rotation = currentRotation;
        system.update([entity], { alpha, renderer });
        expect(lerpSpy).toHaveBeenCalledWith(previousRotation, currentRotation, alpha);
        expect(rotateSpy).toHaveBeenCalledWith(expectedRotation);
      });

      describe('When passed an entity with circular geometry', () => {
        const radius = 32;

        beforeEach(() => {
          geometry2dComponent.shape = {
            type: 'circle',
            radius,
          };
        });

        it('Should draw a circle for any entity with circular geometry', () => {
          system.update([entity], { alpha: 1, renderer });
          expect(drawCircleSpy).toHaveBeenCalledWith({
            radius,
            fillColor,
            strokeColor,
          });
        });
      });

      describe('When passed an entity with box geometry', () => {
        const width = 64;
        const height = 48;

        beforeEach(() => {
          geometry2dComponent.shape = {
            type: 'box',
            width,
            height,
          };
        });

        it('Should draw a box for any entity with box geometry', () => {
          system.update([entity], { alpha: 1, renderer });
          expect(drawBoxSpy).toHaveBeenCalledWith({
            width,
            height,
            fillColor,
            strokeColor,
          });
        });
      });

      it('Should restore the renderer state', () => {
        system.update([entity], { alpha: 1, renderer });
        expect(restoreSpy).toHaveBeenCalled();
      });
    });

    describe('When passed entities without the required components', () => {
      it('Should not render anything', () => {
        system.update([entity], { alpha: 1, renderer });
        expect(saveSpy).not.toHaveBeenCalled();
        expect(translateSpy).not.toHaveBeenCalled();
        expect(rotateSpy).not.toHaveBeenCalled();
        expect(drawBoxSpy).not.toHaveBeenCalled();
        expect(drawCircleSpy).not.toHaveBeenCalled();
        expect(restoreSpy).not.toHaveBeenCalled();
      });
    });

    describe('When no renderer is provided', () => {
      it('Should not render anything', () => {
        entity.addComponent(new Transform2dComponent());
        entity.addComponent(new Geometry2dComponent({
          shape: {
            type: 'circle',
            radius: 16,
          },
        }));
        system.update([entity], { alpha: 1 });
        expect(saveSpy).not.toHaveBeenCalled();
        expect(translateSpy).not.toHaveBeenCalled();
        expect(rotateSpy).not.toHaveBeenCalled();
        expect(drawBoxSpy).not.toHaveBeenCalled();
        expect(drawCircleSpy).not.toHaveBeenCalled();
        expect(restoreSpy).not.toHaveBeenCalled();
      });
    });
  });
});
