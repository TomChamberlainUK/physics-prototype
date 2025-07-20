import { beforeEach, describe, expect, it, vi } from 'vitest';
import Scene from '#/Scene';
import Entity from '#/Entity';

describe('Scene', () => {
  let scene: Scene;

  describe('constructor', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should instantiate', () => {
      expect(scene).toBeInstanceOf(Scene);
      expect(scene.entities).toEqual([]);
      expect(scene.systems).toEqual([]);
    });
  });

  describe('addEntity', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should add an entity to the scene', () => {
      const entity = new Entity();
      scene.addEntity(entity);
      expect(scene.entities).toContain(entity);
    });
  });

  describe('addSystem', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should add a system to the scene', () => {
      const system = vi.fn();
      scene.addSystem(system);
      expect(scene.systems).toContain(system);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all systems with the current entities', () => {
      const entity = new Entity();
      const system1 = vi.fn();
      const system2 = vi.fn();
      const system3 = vi.fn();
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.update();
      expect(system1).toHaveBeenCalledWith([entity]);
      expect(system2).toHaveBeenCalledWith([entity]);
      expect(system3).toHaveBeenCalledWith([entity]);
    });
  });
});
