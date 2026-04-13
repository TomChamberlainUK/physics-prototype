import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import {
  Actions,
  ColliderUpdate2dSystem,
  CollisionDetection2dSystem,
  CollisionImpulseResolution2dSystem,
  CollisionPositionCorrection2dSystem,
  EditorSpawn2dSystem,
  Gravity2dSystem,
  Kinetic2dSystem,
  MouseInput,
  Render2dSystem,
  RenderClear2dSystem,
  RenderDebug2dSystem,
  RigidBodyUpdate2dSystem,
  ToggleDebugSystem,
  TransformSnapshot2dSystem,
} from 'engine';
import { EditorScene } from '#/scenes';

const PhysicsEntityMock = vi.hoisted(vi.fn);

vi.mock('#/entities/PhysicsEntity', () => ({
  default: PhysicsEntityMock,
}));

describe('EditorScene', () => {
  const height = 600;
  const width = 800;

  let scene: EditorScene;
  let sceneAddEntitySpy: MockInstance<typeof EditorScene.prototype.addEntity>;
  let sceneAddSystemSpy: MockInstance<typeof EditorScene.prototype.addSystem>;
  let sceneSetContextSpy: MockInstance<typeof EditorScene.prototype.setContext>;

  beforeAll(() => {
    PhysicsEntityMock.mockImplementation(({ name }) => (
      { name }
    ));
    sceneAddEntitySpy = vi.spyOn(EditorScene.prototype, 'addEntity');
    sceneAddSystemSpy = vi.spyOn(EditorScene.prototype, 'addSystem');
    sceneSetContextSpy = vi.spyOn(EditorScene.prototype, 'setContext');
  });

  beforeEach(() => {
    scene = new EditorScene({
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
    expect(scene).toBeInstanceOf(EditorScene);
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
      System: EditorSpawn2dSystem,
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
      System: ToggleDebugSystem,
    },
    {
      System: TransformSnapshot2dSystem,
    },
  ])('Should add $System.name to the scene', ({ System }) => {
    expect(sceneAddSystemSpy).toHaveBeenCalledWith(expect.any(System));
  });

  it('Should set mouseInput in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      mouseInput: expect.any(MouseInput),
    }));
  });

  it('Should set the actions in the scene context', () => {
    expect(sceneSetContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      actions: expect.any(Actions),
    }));
  });
});
