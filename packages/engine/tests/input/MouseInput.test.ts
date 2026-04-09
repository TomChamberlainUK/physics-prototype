import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events, MouseInput, Vector2d, type ControlScheme } from '#src/index.js';

describe('MouseInput', () => {
  let input: MouseInput;
  let events: Events;

  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const consoleLogSpy = vi.spyOn(console, 'log');

  beforeEach(() => {
    const controlScheme = [
      { key: 'leftclick', action: 'shoot', actionType: 'trigger' },
      { key: 'leftclick', action: 'shooting', actionType: 'state' },
      { key: 'mousemove', action: 'shoot', actionType: 'trigger' },
    ] as ControlScheme;
    events = {
      emit: vi.fn(),
    } as unknown as Events;
    input = new MouseInput({
      controlScheme,
      events,
    });
  });

  afterEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
    consoleLogSpy.mockClear();
  });

  afterAll(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('constructor()', () => {
    it('Should instantiate', () => {
      expect(input).toBeInstanceOf(MouseInput);
    });

    it('Should set a default position to (0, 0)', () => {
      const position = input.getPosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });
  });

  describe('enable()', () => {
    beforeEach(() => {
      input.enable();
    });

    afterEach(() => {
      input.disable();
    });

    it('Should add an event listener to capture mousedown events', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('Should add an event listener to capture mouseup events', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('Should add an event listener to capture mousemove events', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });

  describe('disable()', () => {
    beforeEach(() => {
      input.enable();
      input.disable();
    });

    it('Should remove the mousedown event listener', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('Should remove the mouseup event listener', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('Should remove the mousemove event listener', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });

  describe('isPressed()', () => {
    it('Should return true if a button is pressed', () => {
      input.pressButton('leftclick');
      const isPressed = input.isPressed('leftclick');
      expect(isPressed).toBe(true);
    });

    it('Should return false if a button is not pressed', () => {
      const isPressed = input.isPressed('leftclick');
      expect(isPressed).toBe(false);
    });
  });

  describe('pressButton()', () => {
    beforeEach(() => {
      input.pressButton('leftclick');
    });

    it('Should mark a button as pressed', () => {
      const isPressed = input.isPressed('leftclick');
      expect(isPressed).toBe(true);
    });

    it('Should emit a corresponding control scheme trigger event', () => {
      expect(events.emit).toHaveBeenCalledWith('shoot');
    });

    it('Should emit a corresponding control scheme state:start event', () => {
      expect(events.emit).toHaveBeenCalledWith('shooting:start');
    });
  });

  describe('releaseButton()', () => {
    beforeEach(() => {
      input.pressButton('leftclick');
      input.releaseButton('leftclick');
    });

    it('Should mark a button as not pressed', () => {
      const isPressed = input.isPressed('leftclick');
      expect(isPressed).toBe(false);
    });

    it('Should emit a corresponding control scheme state:stop event', () => {
      expect(events.emit).toHaveBeenCalledWith('shooting:stop');
    });
  });

  describe('updatePosition()', () => {
    const x = 100;
    const y = 200;

    beforeEach(() => {
      input.updatePosition({ x, y });
    });

    it('Should update the current position of the mouse', () => {
      const position = input.getPosition();
      expect(position.x).toBe(x);
      expect(position.y).toBe(y);
    });

    it('Should update the delta position of the mouse', () => {
      const deltaPosition = input.getDeltaPosition();
      expect(deltaPosition.x).toBe(x);
      expect(deltaPosition.y).toBe(y);
    });

    it('Should emit a corresponding control scheme mousemove event', () => {
      expect(events.emit).toHaveBeenCalledWith('shoot', {
        x,
        y,
        deltaX: x,
        deltaY: y,
      });
    });
  });

  describe('getPosition()', () => {
    const x = 150;
    const y = 250;

    beforeEach(() => {
      input.updatePosition({ x, y });
    });

    it('Should return an immutable copy of the internal Vector2d instance', () => {
      const position = input.getPosition();
      expect(position).toBeInstanceOf(Vector2d);
      expect(position.x).toBe(x);
      expect(position.y).toBe(y);
      position.x = 999;
      position.y = 999;
      const newPosition = input.getPosition();
      expect(newPosition.x).toBe(x);
      expect(newPosition.y).toBe(y);
    });
  });

  describe('getDeltaPosition()', () => {
    const x = 50;
    const y = 75;

    beforeEach(() => {
      input.updatePosition({ x, y });
    });

    it('Should return an immutable copy of the internal delta position Vector2d instance', () => {
      const deltaPosition = input.getDeltaPosition();
      expect(deltaPosition).toBeInstanceOf(Vector2d);
      expect(deltaPosition.x).toBe(x);
      expect(deltaPosition.y).toBe(y);
      deltaPosition.x = 999;
      deltaPosition.y = 999;
      const newDeltaPosition = input.getDeltaPosition();
      expect(newDeltaPosition.x).toBe(x);
      expect(newDeltaPosition.y).toBe(y);
    });
  });

  describe('mousedown integration', () => {
    beforeEach(() => {
      input.enable();
    });

    afterEach(() => {
      input.disable();
    });

    it.each([
      {
        button: 0,
        buttonName: 'leftclick',
      },
      {
        button: 1,
        buttonName: 'middleclick',
      },
      {
        button: 2,
        buttonName: 'rightclick',
      },
    ])('Should mark $buttonName as pressed when its mouse button is pressed', ({ button, buttonName }) => {
      const mouseEvent = new MouseEvent('mousedown', { button });
      window.dispatchEvent(mouseEvent);
      const isPressed = input.isPressed(buttonName);
      expect(isPressed).toBe(true);
    });
  });

  describe('mouseup integration', () => {
    beforeEach(() => {
      input.enable();
    });

    afterEach(() => {
      input.disable();
    });

    it.each([
      {
        button: 0,
        buttonName: 'leftclick',
      },
      {
        button: 1,
        buttonName: 'middleclick',
      },
      {
        button: 2,
        buttonName: 'rightclick',
      },
    ])('Should mark $buttonName as not pressed when its mouse button is released', ({ button, buttonName }) => {
      const mouseDownEvent = new MouseEvent('mousedown', { button });
      window.dispatchEvent(mouseDownEvent);
      const mouseUpEvent = new MouseEvent('mouseup', { button });
      window.dispatchEvent(mouseUpEvent);
      const isPressed = input.isPressed(buttonName);
      expect(isPressed).toBe(false);
    });
  });

  describe('mousemove integration', () => {
    beforeEach(() => {
      input.enable();
    });

    afterEach(() => {
      input.disable();
    });

    it('Should update the position when the mouse is moved', () => {
      const x = 300;
      const y = 400;
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: x, clientY: y });
      window.dispatchEvent(mouseMoveEvent);
      const position = input.getPosition();
      expect(position.x).toBe(x - (window.innerWidth / 2));
      expect(position.y).toBe(y - (window.innerHeight / 2));
    });
  });
});
