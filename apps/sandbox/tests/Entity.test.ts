import { Component } from '#/components';
import Entity from '#/Entity';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Entity', () => {
  let entity: Entity;
  let component: Component;

  const componentName = 'TestComponent';

  beforeEach(() => {
    entity = new Entity();
    component = new Component(componentName);
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(entity).toBeInstanceOf(Entity);
      expect(entity.id).toBeTypeOf('string');
      expect(entity.components).toBeInstanceOf(Map);
    });
  });

  describe('addComponent()', () => {
    it('Should add a component to the entity', () => {
      entity.addComponent(component);
      const addedComponent = entity.components.get(componentName);
      expect(addedComponent).toBe(component);
    });
  });

  describe('addComponents()', () => {
    it('Should add multiple components to the entity', () => {
      const components = [
        new Component('Component1'),
        new Component('Component2'),
        new Component('Component3'),
      ];
      entity.addComponents(components);
      for (const { name: componentName } of components) {
        expect(entity.hasComponent(componentName)).toBe(true);
      }
    });
  });

  describe('getComponent()', () => {
    it('Should return the component if it exists', () => {
      entity.addComponent(component);
      const retrievedComponent = entity.getComponent(componentName);
      expect(retrievedComponent).toBe(component);
    });

    it('Should throw an error if the component does not exist', () => {
      expect(() => entity.getComponent(componentName))
        .toThrowError(`Could not find component "${componentName}" on entity "${entity.id}"`);
    });
  });

  describe('hasComponent()', () => {
    it('Should return true if the component exists', () => {
      entity.addComponent(component);
      expect(entity.hasComponent(componentName)).toBe(true);
    });

    it('Should return false if the component does not exist', () => {
      expect(entity.hasComponent(componentName)).toBe(false);
    });
  });

  describe('hasComponents()', () => {
    it('Should return true if all components exist', () => {
      const componentNames = [
        'Component1',
        'Component2',
        'Component3'
      ];
      entity.addComponents(componentNames.map(name => new Component(name)));
      expect(entity.hasComponents(componentNames)).toBe(true);
    });

    it('Should return false if not all components exist', () => {
      const componentNames = [
        'Component1',
        'Component2',
        'Component3'
      ];
      entity.addComponents(componentNames.map(name => new Component(name)));
      expect(entity.hasComponents([...componentNames, 'Component4'])).toBe(false);
    });
  });

  describe('removeComponent()', () => {
    it('Should remove a component from the entity', () => {
      entity.addComponent(component);
      entity.removeComponent(componentName);
      expect(entity.hasComponent(componentName)).toBe(false);
    });

    it('Should throw an error if trying to remove a non-existent component', () => {
      expect(() => entity.removeComponent(componentName))
        .toThrowError(`Could not remove component "${componentName}" from entity "${entity.id}" because it does not exist`);
    });
  });
});
