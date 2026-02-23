import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Actions,
  ColliderUpdate2dSystem,
  CollisionDetection2dSystem,
  CollisionImpulseResolution2dSystem,
  CollisionPositionCorrection2dSystem,
  InputImpulseSystem,
  KeyboardInput,
  Kinetic2dSystem,
  Render2dSystem,
  RenderClear2dSystem,
  RenderDebug2dSystem,
  RigidBodyUpdate2dSystem,
  TransformSnapshot2dSystem,
} from 'engine';
import SandboxScene from '#/scenes/SandboxScene';

describe('SandboxScene', () => {
  const height = 600;
  const width = 800;

  let scene: SandboxScene;

  const sceneAddEntitySpy = vi.spyOn(SandboxScene.prototype, 'addEntity');
  const sceneAddSystemSpy = vi.spyOn(SandboxScene.prototype, 'addSystem');
  const sceneSetContextSpy = vi.spyOn(SandboxScene.prototype, 'setContext');

  const PhysicsEntityConstructorMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(({ name }) => ({ name }))
  ));
  const PlayerEntityConstructorMock = vi.hoisted(() => (
    vi.fn()
      .mockImplementation(() => ({ name: 'player-entity' }))
  ));

  beforeAll(() => {
    vi.mock('#/entities/PhysicsEntity', () => ({
      default: PhysicsEntityConstructorMock,
    }));
    vi.mock('#/entities/PlayerEntity', () => ({
      default: PlayerEntityConstructorMock,
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
    expect(PlayerEntityConstructorMock).toHaveBeenCalledWith({
      shape: {
        type: 'box',
        width: 32,
        height: 32,
      },
    });
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
    expect(PhysicsEntityConstructorMock).toHaveBeenCalledWith({
      shape: {
        type: 'box',
        width: wallWidth,
        height: wallHeight,
      },
      mass: 0,
      position: {
        x,
        y,
      },
      fillColor: 'grey',
      name,
      restitution: 0.1,
    });
    expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name });
  });

  it('Should add 250 circle entities to the scene', () => {
    for (let i = 0; i < 250; i++) {
      const name = `circle-${i}`;
      expect(PhysicsEntityConstructorMock).toHaveBeenCalledWith(expect.objectContaining({
        position: {
          x: expect.any(Number),
          y: expect.any(Number),
        },
        shape: {
          type: 'circle',
          radius: expect.any(Number),
        },
        fillColor: expect.any(String),
        name,
      }));
      expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name });
    }
  });

  it('Should add 250 box entities to the scene', () => {
    for (let i = 0; i < 250; i++) {
      const name = `box-${i}`;
      expect(PhysicsEntityConstructorMock).toHaveBeenCalledWith(expect.objectContaining({
        position: {
          x: expect.any(Number),
          y: expect.any(Number),
        },
        shape: {
          type: 'box',
          width: expect.any(Number),
          height: expect.any(Number),
        },
        fillColor: expect.any(String),
        name,
      }));
      expect(sceneAddEntitySpy).toHaveBeenCalledWith({ name });
    }
  });

  it.each([
    {
      System: ColliderUpdate2dSystem,
    },
    {
      System: CollisionDetection2dSystem,
    },
    {
      System: CollisionImpulseResolution2dSystem,
    },
    {
      System: CollisionPositionCorrection2dSystem,
    },
    {
      System: InputImpulseSystem,
    },
    {
      System: Kinetic2dSystem,
    },
    {
      System: Render2dSystem,
    },
    {
      System: RenderClear2dSystem,
    },
    {
      System: RenderDebug2dSystem,
    },
    {
      System: RigidBodyUpdate2dSystem,
    },
    {
      System: TransformSnapshot2dSystem,
    },
  ])('Should add $System.name to the scene', ({ System }) => {
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
