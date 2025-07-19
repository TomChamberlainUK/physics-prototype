import type { Geometry2dComponent, Transform2dComponent } from '#/components';
import type Entity from '#/Entity';
import type Renderer from '#/Renderer';

export default function render2dGeometrySystem(entities: Entity[], renderer: Renderer) {
  for (const entity of entities) {
    if (!entity.hasComponent('Transform2d') || !entity.hasComponent('Geometry2d')) {
      continue;
    }
    const transform = entity.getComponent<Transform2dComponent>('Transform2d');
    const geometry = entity.getComponent<Geometry2dComponent>('Geometry2d');
    renderer.drawCircle({
      radius: geometry.radius,
      color: geometry.color,
      x: transform.position.x,
      y: transform.position.y,
    });
  }
}
