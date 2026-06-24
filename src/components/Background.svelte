<script lang="ts">
  import { xoroshiro128Plus } from '@gbagan/rng';
  import { times } from '@gbagan/utils';
  import { onMount, onDestroy } from 'svelte';

  interface Shape {
    id: number;
    type: 'croissant' | 'macaron' | 'tart' | 'star' | 'whisk' | 'dot';
    baseX: number;
    baseY: number;
    scale: number;
    opacity: number;
    baseRotation: number;
    floatOffsetX: number;
    floatOffsetY: number;
    floatSpeedX: number;
    floatSpeedY: number;
    floatAmpX: number;
    floatAmpY: number;
    rotAmp: number;
    rotSpeed: number;
    rotOffset: number;
  }

  type Props = {
    count?: number;
    color?: string;
    bgColor?: string;
  };

  let { count = 25, color = '#b5895a', bgColor = '#fdf8f3' }: Props = $props();

  let shapes = $state<Shape[]>([]);
  let animFrame = $state.raw(0);
  let rafId: number;

  const types: Shape['type'][] = ['croissant', 'macaron', 'tart', 'star', 'whisk', 'dot'];

  function init() {
    const rng = xoroshiro128Plus(42);
    shapes = times(count, i => ({
      id: i,
      type: rng.pick(types)!,
      baseX: rng.float(0, 1280),
      baseY: rng.float(0, 800),
      scale: rng.float(0.8, 1.5),
      opacity: rng.float(0.08, 0.2),
      baseRotation: rng.float(0, 360),
      floatOffsetX: rng.float(0, 2 * Math.PI),
      floatOffsetY: rng.float(0, 2 * Math.PI),
      floatSpeedX: rng.float(0.2, 0.5),
      floatSpeedY: rng.float(0.3, 0.8),
      floatAmpX: rng.float(8, 22),
      floatAmpY: rng.float(10, 26),
      rotAmp: rng.float(4, 12),
      rotSpeed: rng.float(0.2, 0.6),
      rotOffset: rng.float(0, 2 * Math.PI),
    }));
  }

  function tick() {
    animFrame += 0.008; // trigger reactivity
    rafId = requestAnimationFrame(tick);
  }

  onMount(() => {
    init();
    rafId = requestAnimationFrame(tick);
  });

  onDestroy(() => cancelAnimationFrame(rafId));
</script>

<div class="bg" style="background:{bgColor}">
  <svg
    class="canvas"
    viewBox="0 0 1280 800"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each shapes as s (s.id)}
      {@const cx = s.baseX + Math.sin(animFrame * s.floatSpeedX + s.floatOffsetX) * s.floatAmpX}
      {@const cy = s.baseY + Math.sin(animFrame * s.floatSpeedY + s.floatOffsetY) * s.floatAmpY}
      {@const rotation = s.baseRotation + Math.sin(animFrame * s.rotSpeed + s.rotOffset) * s.rotAmp}
      <g
        style:transform="translate({cx}px,{cy}px) rotate({rotation}deg) scale({s.scale})"
        opacity={s.opacity}
        stroke={color}
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      >
        {#if s.type === 'croissant'}
          <path d="M-14 4 Q-16 -8 -4 -12 Q8 -15 16 -8 Q18 -2 14 4 Q8 10 0 10 Q-8 10 -14 4Z" />
          <path d="M-10 -2 Q-4 -8 4 -6" stroke-width="0.9" opacity="0.6"/>
          <path d="M-11 2 Q-4 -4 4 -1" stroke-width="0.9" opacity="0.6"/>
        {:else if s.type === 'macaron'}
          <ellipse cx="0" cy="-5" rx="11" ry="5" />
          <ellipse cx="0" cy="5" rx="11" ry="5" />
          <line x1="-11" y1="0" x2="11" y2="0" stroke-width="0.7" opacity="0.5"/>
        {:else if s.type === 'tart'}
          <circle cx="0" cy="0" r="11" />
          <circle cx="0" cy="0" r="7" stroke-width="0.8" opacity="0.6"/>
          <circle cx="-3" cy="-3" r="2" />
          <circle cx="3" cy="-2" r="1.5" />
          <circle cx="0" cy="3" r="1.5" />
        {:else if s.type === 'star'}
          {#each Array(5) as _, i}
            <line
              x1="0" y1="0"
              x2={Math.cos((i * 72 - 90) * Math.PI / 180) * 10}
              y2={Math.sin((i * 72 - 90) * Math.PI / 180) * 10}
              stroke-width="1"
            />
          {/each}
          <circle cx="0" cy="0" r="2" />
        {:else if s.type === 'whisk'}
          <line x1="0" y1="-14" x2="0" y2="14" />
          <path d="M0 -2 Q-8 -8 -6 -14" stroke-width="1" />
          <path d="M0 -2 Q8 -8 6 -14" stroke-width="1" />
          <path d="M0 -2 Q-5 -5 -3 -14" stroke-width="0.8" opacity="0.6"/>
          <path d="M0 -2 Q5 -5 3 -14" stroke-width="0.8" opacity="0.6"/>
          <ellipse cx="0" cy="6" rx="4" ry="2" stroke-width="0.9"/>
        {:else}
          <circle cx="0" cy="0" r="3" />
          <circle cx="0" cy="0" r="6" stroke-width="0.6" opacity="0.4"/>
        {/if}
      </g>
    {/each}
  </svg>
</div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
  }
  .canvas {
    width: 100%;
    height: 100%;
  }
</style>