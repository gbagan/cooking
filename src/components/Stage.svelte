<script lang="ts">
  import type { Cake } from "../lib/types";
  import { computeSchedule } from "../lib/utils";
  import Timeline from "./Timeline.svelte";
  import CakeList from "./CakeList.svelte";
    import Background from "./Background.svelte";

  type Props = {
    cakes: Cake[];
  }

  let { cakes: initialCakes }: Props = $props();

  let cakes = $derived(initialCakes);
  let schedule = $derived(computeSchedule(cakes));
  let totalTime = $derived(schedule.at(-1)?.bakeEnd ?? 0);
</script>

<div class="screen">
  <Background />
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
        <CakeList bind:cakes={cakes} />
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
    /*
    background:
      radial-gradient(circle at top left, rgb(254 243 199 / 0.9), transparent 34rem),
      linear-gradient(135deg, var(--orange-50), var(--blue-50));
    */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;    
  }

  .app {
    position: fixed;
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