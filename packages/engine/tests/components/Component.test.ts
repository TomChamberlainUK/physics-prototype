import { describe, expect, it } from 'vitest';
import { Component } from '#/components';

describe('Component', () => {
  class TestComponent extends Component {
    constructor(name: string) {
      super(name);
    }
  }

  describe('constructor()', () => {
    it('Should instantiate', () => {
      const name = 'TestComponent';
      const component = new TestComponent(name);
      expect(component).toBeInstanceOf(Component);
      expect(component.name).toBe(name);
    });
  });
});
