<script lang="ts">
  import { range } from "@gbagan/utils";
  import type { ScheduledCake } from "../lib/types";

  type Props = {
    schedule: ScheduledCake[];
    totalTime: number;
  }

  const UNIT_WIDTH = "2rem"

  let { schedule, totalTime }: Props = $props();
</script>

<div class="timeline-wrapper">
  <div
    class="timeline"
    style:width="calc({totalTime} * {UNIT_WIDTH})"
  >
    <div class="time-axis">
      {#each range(0, totalTime + 1) as time}
        <div
          class="tick"
          style:left="calc({time} * {UNIT_WIDTH})"
        >
          <span>{time}</span>
        </div>
      {/each}
    </div>

    <div class="machine-row">
      <div class="machine-label">Préparation</div>
      <div
        class="track"
        style:width="calc({totalTime} * {UNIT_WIDTH})"
      >
        {#each schedule as cake (cake.id)}
          <div
            class="block prep"
            style:left="calc({cake.prepStart} * {UNIT_WIDTH})"
            style:width="calc({cake.prep} * {UNIT_WIDTH})"
            style:background={cake.color}
            title="{cake.name} : préparation de {cake.prepStart} à {cake.prepEnd}"
          >
            <strong>{cake.name}</strong>
            <span>{cake.prep} min</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="machine-row">
      <div class="machine-label">Four</div>

      <div
        class="track"
        style:width="calc({totalTime} * {UNIT_WIDTH})"
      >
        {#each schedule as cake (cake.id)}
          <div
            class="block bake"
            style:left="calc({cake.bakeStart} * {UNIT_WIDTH})"
            style:width="calc({cake.bake} * {UNIT_WIDTH})"
            style:background="color-mix(in srgb, {cake.color} 78%, var(--slate-900))"
            title="{cake.name} : cuisson de {cake.bakeStart} à {cake.bakeEnd}"
          >
            <strong>{cake.name}</strong>
            <span>{cake.bake} min</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<div class="explanation">
  {#each schedule as cake (cake.id)}
    <article>
      <strong>{cake.name}</strong>
        <span>
          préparation {cake.prepStart}→{cake.prepEnd}<br/>
          cuisson {cake.bakeStart}→{cake.bakeEnd}
        </span>
      </article>
    {/each}
  </div>
<style>

.timeline-wrapper {
  overflow-x: auto;
  padding-bottom: 0.75rem;
}

.timeline {
  position: relative;
  padding-top: 2rem;
}

.time-axis {
  position: absolute;
  inset: 0 0 auto 7rem;
  height: 1.5rem;
}

.tick {
  position: absolute;
  top: 0;
  height: 10rem;
  border-left: 1px solid rgb(15 23 42 / 0.10);
}

.tick span {
  position: absolute;
  top: 0;
  left: 4px;
  font-size: 0.75rem;
  color: var(--slate-400);
}

.machine-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
  width: 60rem;
}

.machine-label {
  font-weight: 900;
  color: var(--slate-700);
}

.track {
  position: relative;
  height: 4.5rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, rgb(15 23 42 / 0.04) 1px, transparent 1px), var(--slate-50);
  background-size: 2.25rem 100%;
  border: 1px solid rgb(15 23 42 / 0.08);
  overflow: hidden;
}

.block {
  position: absolute;
  top: 0.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  box-sizing: border-box;
  padding: 0.45rem 0.55rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--gray-900);
  border: 2px solid rgb(255 255 255 / 0.7);
  box-shadow: 0 8px 16px rgb(15 23 42 / 0.12);
  overflow: hidden;
  white-space: nowrap;
  /* transition: left ease-in 200ms; */
}

.block strong {
  font-size: 0.82rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.block span {
  font-size: 0.75rem;
  opacity: 0.75;
}

.bake {
  color: white;
}

.explanation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.625rem;
  margin-top: 0.875rem;
}

.explanation article {
  border-radius: 0.9rem;
  background: var(--slate-50);
  border: 1px solid rgb(15 23 42 / 0.08);
  padding: 0.65rem;
  display: grid;
  gap: 0.25rem;
}

.explanation strong {
  color: var(--slate-900);
}

.explanation span {
  color: var(--slate-500);
  font-size: 0.9rem;
}
</style>