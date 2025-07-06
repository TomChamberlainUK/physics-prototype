import Component from '#/Component';
import Entity from '#/Entity';
import { describe, expect, it } from 'vitest';

describe('Entity', () => {
  describe('constructor', () => {
    it('Should instantiate', () => {
      const entity = new Entity();
      expect(entity).toBeInstanceOf(Entity);
      expect(entity.id).toBeTypeOf('string');
      expect(entity.components).toBeInstanceOf(Map);
    });
  });

  describe('addComponent', () => {
    it('Should add a component to the entity', () => {
      const entity = new Entity();
      const component = new Component('TestComponent', {});
      entity.addComponent(component);
      const addedComponent = entity.components.get('TestComponent');
      expect(addedComponent).toBe(component);
    });
  });

  describe('getComponent', () => {
    it('Should return the component if it exists', () => {
      const entity = new Entity();
      const component = new Component('TestComponent', {});
      entity.addComponent(component);
      const retrievedComponent = entity.getComponent('TestComponent');
      expect(retrievedComponent).toBe(component);
    });

    it('Should throw an error if the component does not exist', () => {
      const entity = new Entity();
      const componentName = 'TestComponent';
      expect(() => entity.getComponent(componentName))
        .toThrowError(`Could not find component "${componentName}" on entity "${entity.id}"`);
    });
  });

  describe('hasComponent', () => {
    it('Should return true if the component exists', () => {
      const entity = new Entity();
      const component = new Component('TestComponent', {});
      entity.addComponent(component);
      expect(entity.hasComponent('TestComponent')).toBe(true);
    });

    it('Should return false if the component does not exist', () => {
      const entity = new Entity();
      expect(entity.hasComponent('TestComponent')).toBe(false);
    });
  });

  describe('removeComponent', () => {
    it('Should remove a component from the entity', () => {
      const entity = new Entity();
      const component = new Component('TestComponent', {});
      entity.addComponent(component);
      entity.removeComponent('TestComponent');
      expect(entity.hasComponent('TestComponent')).toBe(false);
    });

    it('Should throw an error if trying to remove a non-existent component', () => {
      const entity = new Entity();
      const componentName = 'TestComponent';
      expect(() => entity.removeComponent(componentName))
        .toThrowError(`Could not remove component "${componentName}" from entity "${entity.id}" because it does not exist`);
    });
  });
});
