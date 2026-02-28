import type { Vector2d } from '#src/maths/index.js';
import type Renderer from '#src/Renderer.js';

/**
 * Parameters for the renderContactPoints function.
 */
type Parameters = {
  /** The interpolation alpha value for rendering. */
  alpha?: number;
  /** The renderer used to draw the contact points. */
  renderer: Renderer;
};

/**
 * Renders contact points for debugging purposes.
 * @param contactPoints - An array of contact points to render.
 * @param params - Additional parameters including the renderer.
 */
export default function renderContactPoints(contactPoints: Vector2d[], {
  renderer,
}: Parameters) {
  for (const contactPoint of contactPoints) {
    renderer.save();
    renderer.translate({
      x: contactPoint.x,
      y: contactPoint.y,
    });
    renderer.drawCircle({
      radius: 2,
      fillColor: 'red',
    });
    renderer.restore();
  }
}
