import Component from '#/Component';
import { describe, expect, it } from 'vitest';

describe('Component', () => {
  describe('constructor', () => {
    it('Should instantiate', () => {
      const name = 'TestComponent';
      const data = { key: 'value' };
      const component = new Component(name, data);
      expect(component).toBeInstanceOf(Component);
      expect(component.name).toBe(name);
      expect(component.data).toEqual(data);
    });
  });
});
