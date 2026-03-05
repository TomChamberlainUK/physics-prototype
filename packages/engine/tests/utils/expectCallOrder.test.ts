import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import expectCallOrder from './expectCallOrder.js';

describe('expectCallOrder', () => {
  const mock1 = vi.fn();
  const mock2 = vi.fn();
  const mock3 = vi.fn();

  afterEach(() => {
    mock1.mockClear();
    mock2.mockClear();
    mock3.mockClear();
  });

  afterAll(() => {
    mock1.mockReset();
    mock2.mockReset();
    mock3.mockReset();
  });

  it('Should verify the call order of mocked functions', () => {
    mock1();
    mock2();
    mock3();

    expect(() => {
      expectCallOrder([
        mock1,
        mock2,
        mock3,
      ]);
    }).not.toThrowError();
  });

  it('Should verify the call order of mocked functions when called multiple times', () => {
    mock1();
    mock1();
    mock2();
    mock2();
    mock3();
    mock3();

    expect(() => {
      expectCallOrder([
        mock1,
        mock2,
        mock3,
      ]);
    }).not.toThrowError();
  });

  it('Should verify the call order of mocked functions when called multiple times in an interleaved manner', () => {
    mock1();
    mock2();
    mock1();
    mock3();
    mock2();
    mock3();

    expect(() => {
      expectCallOrder([
        mock1,
        mock2,
        mock1,
        mock3,
        mock2,
        mock3,
      ]);
    }).not.toThrowError();
  });

  it('Should throw an error if a mock is called fewer times than expected', () => {
    mock1();
    mock2();

    expect(() => {
      expectCallOrder([
        mock1,
        mock2,
        mock3,
      ]);
    }).toThrowError();
  });

  it('Should throw an error if a mock is called out of order', () => {
    mock2();
    mock1();

    expect(() => {
      expectCallOrder([
        mock1,
        mock2,
      ]);
    }).toThrowError();
  });
});
