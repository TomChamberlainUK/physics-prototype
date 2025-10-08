<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Renderer,
    Game,
    KeyboardInput,
  } from 'engine';
  import { SandboxScene } from './scenes';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const renderer = new Renderer(canvas);

    const input = new KeyboardInput();
    input.enable();

    const scene = new SandboxScene({
      input,
      height: canvas.height,
      width: canvas.width,
    });

    const game = new Game({
      renderer,
      scene,
      physicsHz: 120,
    });

    game.start();
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
