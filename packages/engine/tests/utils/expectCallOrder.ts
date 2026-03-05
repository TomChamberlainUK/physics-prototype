import { expect, type MockInstance } from 'vitest';

export default function expectCallOrder(mocks: MockInstance[]) {
  const callsCount = new Map<MockInstance, number>();

  for (let i = 0; i < mocks.length; i++) {
    const currentMock = mocks[i];
    const previousMock = mocks[i - 1];

    if (!currentMock) {
      throw new Error('Mock is undefined');
    }

    const currentMockCalls = (callsCount.get(currentMock) ?? 0) + 1;
    callsCount.set(currentMock, currentMockCalls);

    if (!previousMock) {
      continue;
    }

    const previousMockCalls = callsCount.get(previousMock) ?? 0;

    const currentCallOrder = currentMock.mock.invocationCallOrder[currentMockCalls - 1];
    const previousCallOrder = previousMock.mock.invocationCallOrder[previousMockCalls - 1];

    if (currentCallOrder === undefined) {
      throw new Error(`Expected mock function "${currentMock.getMockName()}" to be called at least ${currentMockCalls} times`);
    }

    if (previousCallOrder === undefined) {
      throw new Error(`Expected mock function "${previousMock.getMockName()}" to be called at least ${previousMockCalls} times`);
    }

    expect(currentCallOrder).toBeGreaterThan(previousCallOrder);
  }
}
