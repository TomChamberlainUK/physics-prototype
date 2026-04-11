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

    return () => {
      game.stop();
    };
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
  :global(html),
  :global(body),
  :global(#app),
  main {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  canvas {
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>
