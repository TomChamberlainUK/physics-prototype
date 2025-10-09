<script lang="ts">
  import { onMount } from 'svelte';
  import SandboxGame from './SandboxGame';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const game = new SandboxGame({ canvas });

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
