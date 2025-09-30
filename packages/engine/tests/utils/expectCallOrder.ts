import { expect } from 'vitest';
import type { MockInstance } from 'vitest';

export default function expectCallOrder(mocks: MockInstance[]) {
  for (let i = 1; i < mocks.length; i++) {
    const currentMock = mocks[i];
    const previousMock = mocks[i - 1];
    if (!currentMock || !previousMock) {
      throw new Error('Mock is undefined');
    }
    if (!currentMock.mock.invocationCallOrder[0] || !previousMock.mock.invocationCallOrder[0]) {
      throw new Error('Mock functions were not called');
    }
    expect(currentMock.mock.invocationCallOrder[0])
      .toBeGreaterThan(previousMock.mock.invocationCallOrder[0]);
  }
}
