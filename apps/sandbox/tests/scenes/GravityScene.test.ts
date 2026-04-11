import { GravityScene } from '#/scenes';
import {
  Actions,
  ColliderUpdate2dSystem,
  CollisionDetection2dSystem,
  CollisionImpulseResolution2dSystem,
  CollisionPositionCorrection2dSystem,
  Gravity2dSystem,
  InputImpulseSystem,
  IntervalSpawnSystem,
  KeyboardInput,
  Kinetic2dSystem,
  Render2dSystem,
  RenderClear2dSystem,
  RenderDebug2dSystem,
  RigidBodyUpdate2dSystem,
  TransformSnapshot2dSystem,
} from 'engine';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

const PlayerEntityMock = vi.hoisted(vi.fn);
const PhysicsEntityMock = vi.hoisted(vi.fn);

vi.mock('#/entities/PlayerEntity', () => ({
  default: PlayerEntityMock,
}));

vi.mock('#/entities/PhysicsEntity', () => ({
  default: PhysicsEntityMock,
}));

describe('GravityScene', () => {
  const height = 600;
  const width = 800;

  let scene: GravityScene;
  let sceneAddEntitySpy: MockInstance<typeof GravityScene.prototype.addEntity>;
  let sceneAddSystemSpy: MockInstance<typeof GravityScene.prototype.addSystem>;
  let sceneSetContextSpy: MockInstance<typeof GravityScene.prototype.setContext>;

  beforeAll(() => {
    PlayerEntityMock.mockImplementation(() => (
      { name: 'player-entity' }
    ));
    PhysicsEntityMock.mockImplementation(({ name }) => (
      { name }
    ));
    sceneAddEntitySpy = vi.spyOn(GravityScene.prototype, 'addEntity');
    sceneAddSystemSpy = vi.spyOn(GravityScene.prototype, 'addSystem');
    sceneSetContextSpy = vi.spyOn(GravityScene.prototype, 'setContext');
  });

  beforeEach(() => {
    scene = new GravityScene({
      height,
      width,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Should instantiate', () => {
    expect(scene).toBeInstanceOf(GravityScene);
  });

  it('Should add a player entity', () => {
    expect(PlayerEntityMock).toHaveBeenCalledWith({
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
    expect(PhysicsEntityMock).toHaveBeenCalledWith({
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
      System: IntervalSpawnSystem,
    },
    {
      System: Gravity2dSystem,
    },
    {
      System: Kinetic2dSystem,
    },
    {
      System: RenderClear2dSystem,
    },
    {
      System: Render2dSystem,
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

  it('Should set the input in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      keyboardInput: expect.any(KeyboardInput),
    }));
  });

  it('Should set the actions in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      actions: expect.any(Actions),
    }));
  });
});
