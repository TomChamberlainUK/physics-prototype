import { InputImpulseComponent } from '#/components';
import { describe, expect, it } from 'vitest';

describe('InputImpulseComponent', () => {
  it('Should instantiate', () => {
    const component = new InputImpulseComponent();
    expect(component).toBeInstanceOf(InputImpulseComponent);
    expect(component.name).toBe('InputImpulse');
  });
});
