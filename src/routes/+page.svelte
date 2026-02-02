<script>
  import "../app.css";
  import { gameStore } from "$lib/stores/gameStore.js";

  // Componente
  import MainMenu from "$lib/components/MainMenu.svelte";
  import SolarMap from "$lib/components/SolarMap.svelte";
  import TravelScene from "$lib/components/TravelScene.svelte";
  import OrbitView from "$lib/components/OrbitView.svelte";
  import MiniGame from "$lib/components/MiniGame.svelte";
  import VictoryScreen from "$lib/components/VictoryScreen.svelte";

  // UI Overlays
  import ProfessorDialog from "$lib/components/ProfessorDialog.svelte";
  import Passport from "$lib/components/Passport.svelte";
  import Scanner from "$lib/components/Scanner.svelte";

  $: currentScene = $gameStore.currentScene;
  $: showDialog = $gameStore.showDialog;
  $: dialogContent = $gameStore.dialogContent;
  $: showPassport = $gameStore.showPassport;
  $: showScanner = $gameStore.showScanner;
</script>

<svelte:head>
  <title>Odiseea Cosmică — Explorează Sistemul Solar!</title>
  <meta
    name="description"
    content="Joc educativ despre Sistemul Solar pentru elevii clasei a 4-a. Explorează toate cele 8 planete și obține Diploma de Cosmonaut!"
  />
</svelte:head>

<div id="game-container">
  <!-- Scene principale -->
  {#if currentScene === "menu"}
    <MainMenu />
  {:else if currentScene === "map"}
    <SolarMap />
  {:else if currentScene === "travel"}
    <TravelScene />
  {:else if currentScene === "orbit"}
    <OrbitView />
  {:else if currentScene === "minigame"}
    <MiniGame />
  {:else if currentScene === "victory"}
    <VictoryScreen />
  {/if}

  <!-- UI Overlays -->
  <div class="ui-overlay">
    {#if showDialog}
      <ProfessorDialog content={dialogContent} />
    {/if}

    {#if showPassport}
      <Passport />
    {/if}

    {#if showScanner}
      <Scanner />
    {/if}
  </div>
</div>

<style>
  #game-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
</style>
