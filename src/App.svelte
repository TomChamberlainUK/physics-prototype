<script lang="ts">
  import { onMount } from 'svelte';
  import Renderer from './Renderer';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const renderer = new Renderer(canvas);

    renderer.ctx.fillStyle = 'white';
    renderer.ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      64,
      0,
      2 * Math.PI,
    );
    renderer.ctx.fill();
  });
</script>

<main>
  <canvas
    id="canvas"
    data-testid="canvas"
    bind:this={canvas}
  >
  </canvas>
</main>

<style>
  canvas {
    width: 100vw;
    height: 100vh;
    background-color: black;
  }
</style>
