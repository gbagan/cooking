<script lang="ts">
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import type { Cake } from "../lib/types";
  import { draggable, droppable, type DragDropState } from "@thisux/sveltednd";

  type Props = {
    cakes: Cake[];
  }

  let { cakes = $bindable() }: Props = $props();

  function handleDrop(state: DragDropState<Cake>) {
    if (!state.targetContainer) return;
    
    const draggedCake = state.draggedItem;
    const targetIndex = parseInt(state.targetContainer);

    // if (!draggedCake || Number.isNaN(targetIndex)) return;

    const sourceIndex = cakes.findIndex(cake => cake.id === draggedCake.id);
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

<div class="cake-list">
  {#each cakes as cake, index (cake.id)}
    <div
      class="cake-card"
      animate:flip={{
        duration: 300,
        easing: cubicOut
      }}
      use:draggable={{
        container: ""+index,
        dragData: cake,
      }}
      use:droppable={{
        container: ""+index,
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

<style>
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
</style>