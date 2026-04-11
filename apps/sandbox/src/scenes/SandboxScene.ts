import {
  Actions,
  ColliderUpdate2dSystem,
  CollisionDetection2dSystem,
  CollisionImpulseResolution2dSystem,
  CollisionPositionCorrection2dSystem,
  Events,
  InputImpulseSystem,
  KeyboardInput,
  Kinetic2dSystem,
  Render2dSystem,
  RenderClear2dSystem,
  RenderDebug2dSystem,
  RigidBodyUpdate2dSystem,
  Scene,
  TransformSnapshot2dSystem,
  Vector2d,
  type ControlScheme,
} from 'engine';
import { PlayerEntity, PhysicsEntity } from '#/entities';

type Props = {
  height: number;
  width: number;
};

export default class SandboxScene extends Scene {
  constructor({
    height,
    width,
  }: Props) {
    super();
    const events = new Events();
    const controlScheme: ControlScheme = [
      { key: 'w', action: 'moveUp', actionType: 'state' },
      { key: 'a', action: 'moveLeft', actionType: 'state' },
      { key: 's', action: 'moveDown', actionType: 'state' },
      { key: 'd', action: 'moveRight', actionType: 'state' },
      { key: 'shift', action: 'boost', actionType: 'state' },
      { key: 'p', action: 'toggleDebug', actionType: 'trigger' },
    ];

    const actions = new Actions({ controlScheme, events });

    const keyboardInput = new KeyboardInput({
      events,
      controlScheme,
    });
    keyboardInput.enable();

    const playerEntity = new PlayerEntity({
      shape: {
        type: 'box',
        width: 32,
        height: 32,
      },
    });
    this.addEntity(playerEntity);

    const wallThickness = 10;
    for (const { x, y, wallWidth, wallHeight, name } of [
      {
        name: 'top-wall',
        x: 0,
        y: -(height / 2),
        wallWidth: width,
        wallHeight: wallThickness,
      },
      {
        name: 'bottom-wall',
        x: 0,
        y: height / 2,
        wallWidth: width,
        wallHeight: wallThickness,
      },
      {
        name: 'left-wall',
        x: -(width / 2),
        y: 0,
        wallWidth: wallThickness,
        wallHeight: height,
      },
      {
        name: 'right-wall',
        x: width / 2,
        y: 0,
        wallWidth: wallThickness,
        wallHeight: height,
      },
    ]) {
      const wallEntity = new PhysicsEntity({
        shape: {
          type: 'box',
          width: wallWidth,
          height: wallHeight,
        },
        mass: 0,
        position: new Vector2d({ x, y }),
        fillColor: 'grey',
        name,
        restitution: 0.1,
      });
      this.addEntity(wallEntity);
    }

    for (let i = 0; i < 250; i++) {
      const fillColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const size = Math.random() * 16;
      const circleEntity = new PhysicsEntity({
        position: new Vector2d({
          x: (Math.random() * width) - (width / 2),
          y: (Math.random() * height) - (height / 2),
        }),
        shape: { type: 'circle', radius: size },
        fillColor,
        name: `circle-${i}`,
      });
      this.addEntity(circleEntity);
    }

    for (let i = 0; i < 250; i++) {
      const fillColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const boxSize = Math.random() * 32;
      const boxEntity = new PhysicsEntity({
        position: new Vector2d({
          x: (Math.random() * width) - (width / 2),
          y: (Math.random() * height) - (height / 2),
        }),
        rotation: Math.random() * 2 * Math.PI,
        shape: { type: 'box', width: boxSize, height: boxSize },
        fillColor,
        name: `box-${i}`,
      });
      this.addEntity(boxEntity);
    }

    const transformSnapshot2dSystem = new TransformSnapshot2dSystem();
    const inputImpulseSystem = new InputImpulseSystem();
    const colliderUpdate2dSystem = new ColliderUpdate2dSystem();
    const rigidBodyUpdate2dSystem = new RigidBodyUpdate2dSystem();
    const collisionDetection2dSystem = new CollisionDetection2dSystem();
    const collisionImpulseResolution2dSystem = new CollisionImpulseResolution2dSystem();
    const collisionPositionCorrection2dSystem = new CollisionPositionCorrection2dSystem();
    const kinetic2dSystem = new Kinetic2dSystem();
    const renderClear2dSystem = new RenderClear2dSystem();
    const render2dSystem = new Render2dSystem();
    const renderDebug2dSystem = new RenderDebug2dSystem();

    this.addSystem(transformSnapshot2dSystem);
    this.addSystem(inputImpulseSystem);
    this.addSystem(colliderUpdate2dSystem);
    this.addSystem(rigidBodyUpdate2dSystem);
    this.addSystem(collisionDetection2dSystem);
    this.addSystem(collisionImpulseResolution2dSystem);
    this.addSystem(collisionPositionCorrection2dSystem);
    this.addSystem(kinetic2dSystem);
    this.addSystem(renderClear2dSystem);
    this.addSystem(render2dSystem);
    this.addSystem(renderDebug2dSystem);

    this.setContext({
      actions,
      keyboardInput,
    });
  }
}
