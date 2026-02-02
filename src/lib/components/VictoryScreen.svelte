<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { scale, fade } from "svelte/transition";
  import { onMount } from "svelte";

  $: planet = $gameStore.currentPlanet;
  $: stamps = $gameStore.stamps;
  $: isGameComplete = stamps.length === 8;

  let showConfetti = false;

  onMount(() => {
    setTimeout(() => {
      showConfetti = true;
    }, 500);
  });

  function goToMap() {
    gameStore.goToMap();
  }

  function viewPassport() {
    gameStore.togglePassport();
  }
</script>

{#if planet}
  <div class="victory-screen">
    {#if showConfetti}
      <div class="confetti-container">
        {#each Array(50) as _, i}
          <div
            class="confetti"
            style="
            left: {Math.random() * 100}%;
            animation-delay: {Math.random() * 2}s;
            background: hsl({Math.random() * 360}, 70%, 60%);
          "
          ></div>
        {/each}
      </div>
    {/if}

    <div
      class="victory-content"
      transition:scale={{ duration: 500, start: 0.5 }}
    >
      <div class="trophy">🏆</div>

      <h1 class="victory-title">Misiune îndeplinită!</h1>

      <div class="stamp-earned">
        <div class="stamp-preview" style="background: {planet.color}">
          <span class="stamp-check">✓</span>
        </div>
        <p class="stamp-text">
          Ștampila <strong>{planet.name}</strong> a fost adăugată în pașaport!
        </p>
      </div>

      <div class="sparky-celebrate">
        <span>✨</span>
        <span class="sparky-text">Scânteică este în extaz!</span>
      </div>

      {#if isGameComplete}
        <div
          class="diploma-section"
          transition:fade={{ delay: 1000, duration: 500 }}
        >
          <div class="diploma">
            <h2>🎓 Felicitări!</h2>
            <p>Ai explorat toate cele 8 planete!</p>
            <div class="diploma-badge">
              <span>Explorator de Onoare</span>
              <span>al Sistemului Solar</span>
            </div>
          </div>
        </div>
      {:else}
        <p class="progress-hint">
          Explorat {stamps.length} din 8 planete
        </p>
      {/if}

      <div class="action-buttons">
        <button class="btn btn-primary" on:click={goToMap}>
          🗺️ Înapoi la hartă
        </button>
        <button class="btn btn-gold" on:click={viewPassport}>
          📔 Deschide pașaportul
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .victory-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-space);
    position: relative;
    overflow: hidden;
  }

  .confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    top: -20px;
    animation: confettiFall 4s linear infinite;
  }

  .victory-content {
    text-align: center;
    z-index: 10;
    padding: 2rem;
  }

  .trophy {
    font-size: 6rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease-in-out infinite;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
  }

  .victory-title {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--color-star-gold);
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    margin-bottom: 2rem;
  }

  .stamp-earned {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.4);
    padding: 1.5rem 2rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
  }

  .stamp-preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px currentColor;
    animation: stampIn 0.5s ease-out;
  }

  .stamp-check {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .stamp-text {
    font-size: 1.2rem;
    color: var(--color-cosmic-white);
  }

  .sparky-celebrate {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    animation: sparkleFloat 1s ease-in-out infinite;
  }

  .sparky-celebrate span:first-child {
    font-size: 2rem;
  }

  .sparky-text {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
  }

  .progress-hint {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 2rem;
  }

  .diploma-section {
    margin: 2rem 0;
  }

  .diploma {
    background: linear-gradient(135deg, #1a2a4a 0%, #0d1f3c 100%);
    border: 3px solid var(--color-star-gold);
    border-radius: 20px;
    padding: 2rem 3rem;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
  }

  .diploma h2 {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--color-star-gold);
    margin-bottom: 0.5rem;
  }

  .diploma p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1rem;
  }

  .diploma-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: var(--gradient-gold);
    border-radius: 10px;
    color: var(--color-space-black);
    font-family: var(--font-display);
    font-weight: bold;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes stampIn {
    0% {
      transform: scale(0) rotate(-180deg);
    }
    100% {
      transform: scale(1) rotate(0);
    }
  }

  @keyframes sparkleFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
</style>
