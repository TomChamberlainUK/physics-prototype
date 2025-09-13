import { beforeEach, describe, expect, it, vi } from 'vitest';
import Entity from '#/Entity';
import { KeyboardInput } from '#/input';
import Scene from '#/Scene';

describe('Scene', () => {
  let scene: Scene;

  describe('constructor()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should instantiate', () => {
      expect(scene).toBeInstanceOf(Scene);
      expect(scene.entities).toEqual([]);
      expect(scene.systems).toEqual([]);
    });
  });

  describe('setContext()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should set the context', () => {
      const context = {
        deltaTime: 1 / 60,
        input: new KeyboardInput(),
      };
      scene.setContext(context);
      expect(scene.context).toEqual(context);
    });
  });

  describe('addEntity()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should add an entity to the scene', () => {
      const entity = new Entity();
      scene.addEntity(entity);
      expect(scene.entities).toContain(entity);
    });
  });

  describe('addSystem()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should add a system to the scene', () => {
      const system = { update: vi.fn(), type: 'physics' };
      scene.addSystem(system);
      expect(scene.systems).toContain(system);
    });
  });

  describe('updatePhysics()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { input: new KeyboardInput() };
      const deltaTime = 1 / 60;
      const system1 = { update: vi.fn(), type: 'physics' };
      const system2 = { update: vi.fn(), type: 'physics' };
      const system3 = { update: vi.fn(), type: 'physics' };
      scene.setContext(context);
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.updatePhysics(deltaTime);
      expect(system1.update).toHaveBeenCalledWith([entity], { ...context, deltaTime });
      expect(system2.update).toHaveBeenCalledWith([entity], { ...context, deltaTime });
      expect(system3.update).toHaveBeenCalledWith([entity], { ...context, deltaTime });
    });
  });

  describe('updateRender()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all render systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { input: new KeyboardInput() };
      const system1 = { update: vi.fn(), type: 'render' };
      const system2 = { update: vi.fn(), type: 'render' };
      const system3 = { update: vi.fn(), type: 'render' };
      scene.setContext(context);
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.updateRender();
      expect(system1.update).toHaveBeenCalledWith([entity], context);
      expect(system2.update).toHaveBeenCalledWith([entity], context);
      expect(system3.update).toHaveBeenCalledWith([entity], context);
    });
  });
});
