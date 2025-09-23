<script lang="ts">
  import { onMount } from 'svelte';
  import { Renderer } from 'engine';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const renderer = new Renderer(canvas);

    renderer.drawCircle({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 64,
      color: 'white',
    });
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
