<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { fade, scale } from "svelte/transition";

  $: planet = $gameStore.currentPlanet;

  function handleClose() {
    gameStore.closeScanner();
  }
</script>

{#if planet}
  <div class="scanner-overlay" transition:fade={{ duration: 200 }}>
    <div class="scanner-box" transition:scale={{ duration: 300, start: 0.8 }}>
      <div class="scanner-header">
        <div class="scanner-icon">📡</div>
        <h2>Date de la scaner</h2>
        <div class="planet-badge" style="background: {planet.color}">
          {planet.name}
        </div>
      </div>

      <div class="professor-section">
        <div class="professor-mini">🤖</div>
        <p class="professor-intro">Profesorul Lentilă analizează datele...</p>
      </div>

      <div class="facts-container">
        {#each planet.facts as fact, i}
          <div class="fact-item" style="animation-delay: {i * 0.2}s">
            <span class="fact-bullet">🔹</span>
            <span class="fact-text">{fact}</span>
          </div>
        {/each}
      </div>

      <button class="btn btn-gold close-btn" on:click={handleClose}>
        ✓ Date primite!
      </button>
    </div>
  </div>
{/if}

<style>
  .scanner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }

  .scanner-box {
    background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
    border: 2px solid rgba(52, 152, 219, 0.6);
    border-radius: 20px;
    padding: 2rem;
    max-width: 550px;
    width: 90%;
    box-shadow:
      0 0 50px rgba(52, 152, 219, 0.3),
      inset 0 0 30px rgba(52, 152, 219, 0.1);
  }

  .scanner-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .scanner-icon {
    font-size: 3rem;
    animation: scan 2s ease-in-out infinite;
  }

  .scanner-header h2 {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--color-earth-blue);
    margin: 0.5rem 0;
    letter-spacing: 3px;
  }

  .planet-badge {
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-family: var(--font-display);
    font-weight: bold;
    color: white;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 15px currentColor;
  }

  .professor-section {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.8rem;
    background: rgba(107, 92, 231, 0.2);
    border-radius: 10px;
    border-left: 3px solid var(--color-nebula-purple);
  }

  .professor-mini {
    font-size: 1.5rem;
  }

  .professor-intro {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
  }

  .facts-container {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .fact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    margin-bottom: 1rem;
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
  }

  .fact-item:last-child {
    margin-bottom: 0;
  }

  .fact-bullet {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .fact-text {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-cosmic-white);
  }

  .close-btn {
    width: 100%;
    font-size: 1.1rem;
  }

  @keyframes scan {
    0%,
    100% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
