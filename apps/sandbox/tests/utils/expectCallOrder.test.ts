import { describe, expect, it, vi } from 'vitest';
import expectCallOrder from './expectCallOrder';

describe('expectCallOrder', () => {
  it('Should verify the call order of mocked functions', () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const mock3 = vi.fn();

    mock1();
    mock2();
    mock3();

    expectCallOrder([
      mock1,
      mock2,
      mock3,
    ]);

    expect(mock1.mock.invocationCallOrder[0]).toBeLessThan(mock2.mock.invocationCallOrder[0]);
    expect(mock2.mock.invocationCallOrder[0]).toBeLessThan(mock3.mock.invocationCallOrder[0]);
  });
});
