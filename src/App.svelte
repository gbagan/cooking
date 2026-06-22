<script lang="ts">
  import Stage from "./components/Stage.svelte";
  import type { Cake } from "./lib/types";

  let cakes = $state<Cake[]>([
    { id: 'vanille', name: 'Moelleux vanille', prep: 4, bake: 3, color: '#fef3c7' },
    { id: 'chocolat', name: 'Fondant chocolat', prep: 6, bake: 4, color: '#92400e' },
    { id: 'fraise', name: 'Gâteau fraise', prep: 2, bake: 5, color: '#fb7185' },
    { id: 'pomme', name: 'Tarte pomme', prep: 5, bake: 8, color: '#84cc16' },
    { id: 'citron', name: 'Cake citron', prep: 3, bake: 7, color: '#facc15' },
  ]);
</script>

<Stage {cakes} />