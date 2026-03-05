import { describe, expect, it } from 'vitest';
import { lerp } from '#src/utils/index.js';

describe('lerp', () => {
  it('Should linearly interpolate between two values', () => {
    const a = 0;
    const b = 10;
    const t = 0.5;
    const expectedOutput = a + (b - a) * t;
    const output = lerp(a, b, t);
    expect(output).toBe(expectedOutput);
  });
});
