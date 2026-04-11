import { beforeEach, describe, expect, it, vi } from 'vitest';
import Entity from '#src/Entity.js';
import { KeyboardInput } from '#src/input/index.js';
import Scene from '#src/Scene.js';
import Renderer from '#src/Renderer.js';

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

  describe('removeEntity()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should remove an entity from the scene', () => {
      const entityA = new Entity();
      const entityB = new Entity();
      scene.addEntity(entityA);
      scene.addEntity(entityB);
      scene.removeEntity(entityA.id);
      expect(scene.entities).not.toContain(entityA);
      expect(scene.entities).toContain(entityB);
    });
  });

  describe('addSystem()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should add a system to the scene', () => {
      const system = { update: vi.fn(), type: 'physics', name: 'System' };
      scene.addSystem(system);
      expect(scene.systems).toContain(system);
    });
  });

  describe('executeCommands()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should execute spawnEntity commands and add the entity to the scene', () => {
      const entity = new Entity();
      scene.addEntity = vi.fn();
      scene.commands.push({
        type: 'spawnEntity',
        entity,
      });
      scene.executeCommands();
      expect(scene.addEntity).toHaveBeenCalledWith(entity);
    });

    it('Should execute despawnEntity commands and remove the entity from the scene', () => {
      const entityId = 'test-entity';
      scene.removeEntity = vi.fn();
      scene.commands.push({
        type: 'despawnEntity',
        entityId,
      });
      scene.executeCommands();
      expect(scene.removeEntity).toHaveBeenCalledWith(entityId);
    });

    it('Should clear the commands after executing', () => {
      scene.commands.push({ type: 'spawnEntity', entity: new Entity() });
      scene.executeCommands();
      expect(scene.commands).toEqual([]);
    });
  });

  describe('getSystem()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    describe('When passed the name of an added system', () => {
      beforeEach(() => {
        const system = { update: vi.fn(), type: 'physics', name: 'System' };
        scene.addSystem(system);
      });

      it('Should return the system', () => {
        const system = scene.getSystem('System');
        expect(system).toBeDefined();
        expect(system.name).toBe('System');
      });
    });

    describe('When passed the name of a non-added system', () => {
      it('Should throw an error', () => {
        expect(
          () => scene.getSystem('NonExistentSystem'),
        ).toThrowError('Could not find system "NonExistentSystem" in scene');
      });
    });
  });

  describe('updateInput()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all input systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { keyboardInput: new KeyboardInput() };
      const system1 = { update: vi.fn(), type: 'input', name: 'System1' };
      const system2 = { update: vi.fn(), type: 'input', name: 'System2' };
      const system3 = { update: vi.fn(), type: 'input', name: 'System3' };
      scene.setContext(context);
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.updateInput();
      expect(system1.update).toHaveBeenCalledWith([entity], {
        ...context,
        sceneCommands: scene.commands,
      });
      expect(system2.update).toHaveBeenCalledWith([entity], {
        ...context,
        sceneCommands: scene.commands,
      });
      expect(system3.update).toHaveBeenCalledWith([entity], {
        ...context,
        sceneCommands: scene.commands,
      });
    });
  });

  describe('updateHistory()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all history systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { keyboardInput: new KeyboardInput() };
      const system1 = { update: vi.fn(), type: 'history', name: 'System1' };
      const system2 = { update: vi.fn(), type: 'history', name: 'System2' };
      const system3 = { update: vi.fn(), type: 'history', name: 'System3' };
      scene.setContext(context);
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.updateHistory();
      expect(system1.update).toHaveBeenCalledWith([entity], context);
      expect(system2.update).toHaveBeenCalledWith([entity], context);
      expect(system3.update).toHaveBeenCalledWith([entity], context);
    });
  });

  describe('updatePhysics()', () => {
    beforeEach(() => {
      scene = new Scene();
    });

    it('Should call all systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { keyboardInput: new KeyboardInput() };
      const deltaTime = 1 / 60;
      const system1 = { update: vi.fn(), type: 'physics', name: 'System1' };
      const system2 = { update: vi.fn(), type: 'physics', name: 'System2' };
      const system3 = { update: vi.fn(), type: 'physics', name: 'System3' };
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
    let renderer: Renderer;

    beforeEach(() => {
      const canvas = document.createElement('canvas');
      renderer = new Renderer(canvas);
      scene = new Scene();
    });

    it('Should call all render systems with the current entities and context', () => {
      const entity = new Entity();
      const context = { keyboardInput: new KeyboardInput() };
      const system1 = { update: vi.fn(), type: 'render', name: 'System1' };
      const system2 = { update: vi.fn(), type: 'render', name: 'System2' };
      const system3 = { update: vi.fn(), type: 'render', name: 'System3' };
      scene.setContext(context);
      scene.addEntity(entity);
      scene.addSystem(system1);
      scene.addSystem(system2);
      scene.addSystem(system3);
      scene.updateRender({ alpha: 1, renderer });
      expect(system1.update).toHaveBeenCalledWith([entity], { ...context, alpha: 1, renderer });
      expect(system2.update).toHaveBeenCalledWith([entity], { ...context, alpha: 1, renderer });
      expect(system3.update).toHaveBeenCalledWith([entity], { ...context, alpha: 1, renderer });
    });
  });
});
