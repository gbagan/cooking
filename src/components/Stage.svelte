<script lang="ts">
  import type { Cake } from "../lib/types";
  import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
  import { computeSchedule } from "../lib/utils";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import Timeline from "./Timeline.svelte";

  type Props = {
    cakes: Cake[];
  }

  let { cakes: initialCakes }: Props = $props();

  let cakes = $derived(initialCakes);
  let schedule = $derived(computeSchedule(cakes));
  let totalTime = $derived(schedule.at(-1)?.bakeEnd ?? 0);

  function handleDrop(state: DragDropState<Cake>) {
    const draggedCake = state.draggedItem;
    const targetIndex = Number(state.targetContainer);

    if (!draggedCake || Number.isNaN(targetIndex)) return;

    const sourceIndex = cakes.findIndex((cake) => cake.id === draggedCake.id);
    if (sourceIndex === -1) return;

    let insertIndex = targetIndex;

    //if (state.dropPosition === 'after') {
    //  insertIndex += 1;
    //}

    const newCakes = [...cakes];
    const [moved] = newCakes.splice(sourceIndex, 1);

    //if (sourceIndex < insertIndex) {
    //  insertIndex -= 1;
    //}

    newCakes.splice(insertIndex, 0, moved);
    cakes = newCakes;
  }
</script>

<div class="screen">
  <main class="app">
    <header class="hero">
      <div></div>
      <div>
        <p class="eyebrow">Ordonnancement</p>
        <h1>Le pâtissier pressé</h1>
        <p>
          Réordonne les gâteaux pour utiliser au mieux le plan de préparation et le four.
          Chaque gâteau doit être préparé avant d’être cuit.
        </p>
      </div>

      <div class="score-card">
        <span>Fin totale</span>
        <strong>{totalTime} min</strong>
      </div>
    </header>

    <section class="layout">
      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Gâteaux à ordonnancer</h2>
            <p>Glisse les cartes pour changer l’ordre.</p>
          </div>
        </div>

        <div class="cake-list">
          {#each cakes as cake, index (cake.id)}
            <div
              class="cake-card"
              animate:flip={{
                duration: 300,
                easing: cubicOut
              }}
              use:draggable={{
                container: index.toString(),
                dragData: cake,
              }}
              use:droppable={{
                container: index.toString(),
                direction: 'vertical',
                callbacks: { onDrop: handleDrop }
              }}
            >
              <div class="cake-dot" style:background={cake.color}></div>

              <div class="cake-info">
                <strong>{cake.name}</strong>
                <span>Préparation : {cake.prep} min <br/> Cuisson : {cake.bake} min</span>
              </div>
            </div>
          {/each}
        </div>
      </aside>
      <section class="panel timeline-panel">
        <div class="panel-header">
          <div>
            <h2>Chronologie</h2>
            <p>Une seule préparation et un seul four sont disponibles.</p>
          </div>
        </div>
        <Timeline {schedule} {totalTime} />
      </section>
    </section>
  </main>
</div>

<style>
  .screen {
    position: fixed;
    inset: 0;
    color: #172033;
    background:
      radial-gradient(circle at top left, rgb(254 243 199 / 0.9), transparent 34rem),
      linear-gradient(135deg, #fff7ed, #eff6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;    
  }

  .app {
    aspect-ratio: 16 / 9;
    width: min(100vw, calc(100vh * 16 / 9));
    height: min(100vh, calc(100vw * 9 / 16));
  }

.hero {
  display: flex;
  justify-content: space-between;
  gap: 1.35rem;
  align-items: end;
  margin-bottom: 1.35rem;
}


.hero .eyebrow {
  text-align: center;
  margin: 0 0 6px;
  font-weight: 800;
  color: var(--orange-600);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 1rem;
}

.hero h1 {
  text-align: center;
  font-size: 3rem;
  line-height: 0.95;
  margin-bottom: 12px;
  color: var(--slate-900);
}

.hero p {
  width: 40rem;
  color: var(--slate-600);
  font-size: 1.05rem;
}

.score-card {
  min-width: 8.5rem;
  border-radius: 1.35rem;
  padding: 18px 22px;
  background: white;
  box-shadow: 0 18px 45px rgb(15 23 42 / 0.12);
  border: 1px solid rgb(15 23 42 / 0.08);
}

.score-card span {
  display: block;
  color: #64748b;
  font-weight: 700;
}

.score-card strong {
  display: block;
  font-size: 2rem;
  color: #0f172a;
}

.layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.panel {
  border-radius: 1.5rem;
  background: rgb(255 255 255 / 0.82);
  border: 1px solid rgb(15 23 42 / 0.08);
  box-shadow: 0 20px 60px rgb(15 23 42 / 0.12);
  backdrop-filter: blur(18px);
  padding: 1.25rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.panel-header h2 {
  margin-bottom: 0.25rem;
  color: var(--gray-900);
}

.panel-header p {
  color: var(--slate-500);
  margin-bottom: 0;
}

.cake-list {
  height: 30rem;
  display: grid;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: none;
}

.cake-card {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgb(15 23 42 / 0.08);
  box-shadow:
    inset 0 -2px 0 rgb(15 23 42 / 0.04),
    0 8px 20px rgb(15 23 42 / 0.06);
  position: relative;
}

.cake-card:global(.dragging) {
  opacity: 0.5;
}

.cake-card:global(.drag-over) {
  outline: 3px dashed var(--sky-400);
}

.cake-dot {
  width: 2rem;
  height: 2rem;
  border-radius: 0.65rem;
  border: 2px solid rgb(15 23 42 / 0.1);
}

.cake-info {
  display: grid;
  gap: 3px;
}

.cake-info strong {
  color: var(--slate-900);
  font-weight: 800;
}

.cake-info span {
  color: var(--slate-400);
  font-size: 0.92rem;
}

.timeline-panel {
  min-width: 0;
  width: 60rem;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.primary,
.secondary {
  border: 0;
  border-radius: 14px;
  padding: 11px 14px;
  font-weight: 800;
  cursor: pointer;
}

.primary {
  color: white;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 10px 20px rgb(37 99 235 / 0.22);
}

.secondary {
  color: var(--slate-900);
  background: var(--slate-200);
}

.hint {
  margin: 16px 0 0;
  color: var(--slate-500);
  font-size: 0.94rem;
  line-height: 1.45;
}
</style>