import { describe, expect, it } from 'vitest';
import { InputImpulseComponent } from '#/components/index.js';

describe('InputImpulseComponent', () => {
  it('Should instantiate', () => {
    const component = new InputImpulseComponent();
    expect(component).toBeInstanceOf(InputImpulseComponent);
    expect(component.name).toBe('InputImpulse');
  });
});
