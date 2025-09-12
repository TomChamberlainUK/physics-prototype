import type { RigidBody2dComponent } from '#/components';
import type Entity from '#/Entity';
import Vector2d from '#/maths/Vector2d';
import type { Context } from '#/types';

export default function inputImpulseSystem(entities: Entity[], { input, deltaTime }: Context) {
  if (!input || !deltaTime) return;
  for (const entity of entities) {
    if (!entity.hasComponents(['RigidBody2d', 'InputImpulse'])) {
      continue;
    }
    const rigidBody = entity.getComponent<RigidBody2dComponent>('RigidBody2d');
    const force = 3600; // Assuming 60Hz physics update rate
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
    const impulse = normalizedDirection.multiply(force * rigidBody.inverseMass * deltaTime);
    rigidBody.impulse = rigidBody.impulse.add(impulse);
  }
}
