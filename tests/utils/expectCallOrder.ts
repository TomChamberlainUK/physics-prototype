import { expect, type Mock } from 'vitest';

export default function expectCallOrder(mocks: Mock[]) {
  for (let i = 1; i < mocks.length; i++) {
    expect(mocks[i].mock.invocationCallOrder[0])
      .toBeGreaterThan(mocks[i - 1].mock.invocationCallOrder[0]);
  }
}
