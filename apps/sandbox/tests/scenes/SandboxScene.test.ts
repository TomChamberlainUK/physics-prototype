import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AABBUpdate2dSystem,
  Actions,
  CollisionDetection2dSystem,
  CollisionImpulseResolution2dSystem,
  CollisionPositionCorrection2dSystem,
  InputImpulseSystem,
  InterpolationSync2dSystem,
  KeyboardInput,
  Kinetic2dSystem,
  Render2dSystem,
  RenderClear2dSystem,
  RenderDebug2dSystem,
} from 'engine';
import SandboxScene from '#/scenes/SandboxScene';

describe('SandboxScene', () => {
  const height = 600;
  const width = 800;

  let scene: SandboxScene;

  const sceneAddEntitySpy = vi.spyOn(SandboxScene.prototype, 'addEntity');
  const sceneAddSystemSpy = vi.spyOn(SandboxScene.prototype, 'addSystem');
  const sceneSetContextSpy = vi.spyOn(SandboxScene.prototype, 'setContext');

  const BoxEntityConstructorMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(({ name }) => ({ name }))
  ));
  const PlayerEntityConstructorMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(() => ({ name: 'player-entity' }))
  ));
  const CircleEntityConstructorMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(({ name }) => ({ name }))
  ));

  beforeAll(() => {
    vi.mock('#/entities/BoxEntity', () => ({
      default: BoxEntityConstructorMock,
    }));
    vi.mock('#/entities/PlayerEntity', () => ({
      default: PlayerEntityConstructorMock,
    }));
    vi.mock('#/entities/CircleEntity', () => ({
      default: CircleEntityConstructorMock,
    }));
  });

  beforeEach(() => {
    scene = new SandboxScene({
      width,
      height,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Should instantiate', () => {
    expect(scene).toBeInstanceOf(SandboxScene);
  });

  it('Should add a player entity', () => {
    expect(PlayerEntityConstructorMock).toHaveBeenCalled();
    expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name: 'player-entity' });
  });

  it.each([
    {
      name: 'top-wall',
      x: 0,
      y: -(height / 2),
      width: width,
      height: 10,
    },
    {
      name: 'bottom-wall',
      x: 0,
      y: height / 2,
      width: width,
      height: 10,
    },
    {
      name: 'left-wall',
      x: -(width / 2),
      y: 0,
      width: 10,
      height: height,
    },
    {
      name: 'right-wall',
      x: width / 2,
      y: 0,
      width: 10,
      height: height,
    },
  ])('Should add a $name wall entity to the edge of the scene', ({
    x,
    y,
    width: wallWidth,
    height: wallHeight,
    name,
  }) => {
    expect(BoxEntityConstructorMock).toHaveBeenCalledWith({
      width: wallWidth,
      height: wallHeight,
      mass: 0,
      position: {
        x,
        y,
      },
      fillColor: 'grey',
      name,
    });
    expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name });
  });

  it('Should add 500 circle entities to the scene', () => {
    for (let i = 0; i < 500; i++) {
      const name = `circle-${i}`;
      expect(CircleEntityConstructorMock).toHaveBeenCalledWith(expect.objectContaining({
        position: {
          x: expect.any(Number),
          y: expect.any(Number),
        },
        radius: expect.any(Number),
        fillColor: expect.any(String),
        name,
      }));
      expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name });
    }
  });

  it.each([
    {
      name: 'interpolationSync2d',
      System: InterpolationSync2dSystem,
    },
    {
      name: 'inputImpulse',
      System: InputImpulseSystem,
    },
    {
      name: 'aabbUpdate2d',
      System: AABBUpdate2dSystem,
    },
    {
      name: 'collisionDetection2d',
      System: CollisionDetection2dSystem,
    },
    {
      name: 'collisionImpulseResolution2d',
      System: CollisionImpulseResolution2dSystem,
    },
    {
      name: 'collisionPositionCorrection2d',
      System: CollisionPositionCorrection2dSystem,
    },
    {
      name: 'kinetic2d',
      System: Kinetic2dSystem,
    },
    {
      name: 'renderClear2dSystem',
      System: RenderClear2dSystem,
    },
    {
      name: 'render2d',
      System: Render2dSystem,
    },
    {
      name: 'renderDebug2d',
      System: RenderDebug2dSystem,
    },
  ])('Should add a $name system to the scene', ({ System }) => {
    expect(sceneAddSystemSpy).toHaveBeenCalledWith(expect.any(System));
  });

  it('Should disable the RenderDebug2dSystem by default', () => {
    const renderDebug2dSystem = scene.getSystem<RenderDebug2dSystem>('RenderDebug2dSystem');
    expect(renderDebug2dSystem.enabled).toBe(false);
  });

  it('Should set the input in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      input: expect.any(KeyboardInput),
    }));
  });

  it('Should set the actions in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      actions: expect.any(Actions),
    }));
  });
});
