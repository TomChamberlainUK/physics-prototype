import { describe, expect, it } from 'vitest';
import { Component } from '#/components';

describe('Component', () => {
  describe('constructor', () => {
    it('Should instantiate', () => {
      const name = 'TestComponent';
      const component = new Component(name);
      expect(component).toBeInstanceOf(Component);
      expect(component.name).toBe(name);
    });
  });
});
