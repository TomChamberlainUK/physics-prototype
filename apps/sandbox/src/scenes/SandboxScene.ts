import { AABBUpdate2dSystem, CollisionDetection2dSystem, CollisionImpulseResolution2dSystem, CollisionPositionCorrection2dSystem, InputImpulseSystem, InterpolationSync2dSystem, KeyboardInput, Kinetic2dSystem, Scene, Vector2d } from 'engine';
import { BoxEntity, CircleEntity, PlayerEntity } from '#/entities';

type Props = {
  input: KeyboardInput;
  height: number;
  width: number;
};

export default class SandboxScene extends Scene {
  constructor({
    input,
    height,
    width,
  }: Props) {
    super();
    const playerEntity = new PlayerEntity();
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
      const wallEntity = new BoxEntity({
        width: wallWidth,
        height: wallHeight,
        mass: 0,
        position: new Vector2d({ x, y }),
        color: 'grey',
        name,
      });
      this.addEntity(wallEntity);
    }

    for (let i = 0; i < 500; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const size = Math.random() * 16;
      const circleEntity = new CircleEntity({
        position: new Vector2d({
          x: (Math.random() * width) - (width / 2),
          y: (Math.random() * height) - (height / 2),
        }),
        radius: size,
        color,
        name: `circle-${i}`,
      });
      this.addEntity(circleEntity);
    }

    this.addSystem(new InterpolationSync2dSystem());
    this.addSystem(new InputImpulseSystem());
    this.addSystem(new AABBUpdate2dSystem());
    this.addSystem(new CollisionDetection2dSystem());
    this.addSystem(new CollisionImpulseResolution2dSystem());
    this.addSystem(new CollisionPositionCorrection2dSystem());
    this.addSystem(new Kinetic2dSystem());

    this.setContext({
      input,
    });
  }
}
