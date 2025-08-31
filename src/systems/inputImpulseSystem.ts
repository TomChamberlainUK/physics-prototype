import type { Kinetic2dComponent } from '#/components';
import type Entity from '#/Entity';
import type { KeyboardInput } from '#/input';
import Vector2d from '#/maths/Vector2d';

export default function inputImpulseSystem(entities: Entity[], input: KeyboardInput) {
  for (const entity of entities) {
    if (!entity.hasComponent('Kinetic2d')) {
      continue;
    }
    const kinetic = entity.getComponent<Kinetic2dComponent>('Kinetic2d');
    const inverseMass = 1 / kinetic.mass;
    const force = 1;
    const direction = new Vector2d({ x: 0, y: 0 });
    if (input.isPressed('w')) {
      direction.y -= 1;
    }
    if (input.isPressed('a')) {
      direction.x -= 1;
    }
    if (input.isPressed('s')) {
      direction.y += 1;
    }
    if (input.isPressed('d')) {
      direction.x += 1;
    }
    const normalizedDirection = direction.getUnit();
    const impulse = normalizedDirection.multiply(force * inverseMass);
    kinetic.impulse = kinetic.impulse.add(impulse);
  }
}
