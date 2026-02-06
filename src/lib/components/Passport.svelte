<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { fade, fly } from "svelte/transition";

  $: stamps = $gameStore.stamps;
  $: planets = $gameStore.planets;
  $: isComplete = stamps.length === 8;

  let showResetConfirm = false;

  function handleClose() {
    gameStore.togglePassport();
  }

  function handleReset() {
    showResetConfirm = true;
  }

  function confirmReset() {
    gameStore.resetProgress();
    showResetConfirm = false;
  }

  function cancelReset() {
    showResetConfirm = false;
  }
</script>

<div class="passport-overlay" transition:fade={{ duration: 200 }}>
  <button
    class="passport-backdrop"
    type="button"
    aria-label="Închide pașaportul"
    on:click={handleClose}
  ></button>
  <div
    class="passport"
    transition:fly={{ y: 50, duration: 300 }}
    role="dialog"
    aria-modal="true"
  >
    <div class="passport-header">
      <div class="passport-emblem">🌟</div>
      <h2>Pașaportul Cosmonautului</h2>
      <p class="passport-subtitle">Enciclopedia Galactică</p>
    </div>

    <div class="stamps-grid">
      {#each planets as planet}
        <div class="stamp-slot" class:collected={stamps.includes(planet.id)}>
          {#if stamps.includes(planet.id)}
            <div class="stamp" style="background: {planet.color}">
              <span class="stamp-icon">✓</span>
            </div>
            <span class="stamp-name">{planet.name}</span>
          {:else}
            <div class="stamp-empty">
              <span class="stamp-question">?</span>
            </div>
            <span class="stamp-name locked">{planet.name}</span>
          {/if}
        </div>
      {/each}
    </div>

    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {(stamps.length / 8) * 100}%"
      ></div>
      <span class="progress-text">{stamps.length} / 8 planete</span>
    </div>

    {#if isComplete}
      <div class="diploma-banner">
        🎉 Felicitări! Ești Explorator de Onoare! 🎉
      </div>
    {/if}

    <div class="button-group">
      <button class="btn btn-primary close-btn" on:click={handleClose}>
        Închide
      </button>

      {#if stamps.length > 0}
        <button class="btn reset-btn" on:click={handleReset}>
          🔄 Resetează
        </button>
      {/if}
    </div>

    {#if showResetConfirm}
      <div class="reset-confirm">
        <p>Ești sigur că vrei să resetezi tot progresul?</p>
        <div class="confirm-buttons">
          <button class="btn btn-danger" on:click={confirmReset}
            >Da, resetează</button
          >
          <button class="btn btn-secondary" on:click={cancelReset}
            >Anulează</button
          >
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .passport-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .passport-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .passport {
    background: linear-gradient(135deg, #1a2a4a 0%, #0d1f3c 100%);
    border: 3px solid var(--color-star-gold);
    border-radius: 20px;
    padding: 2rem;
    max-width: 450px;
    width: 90%;
    box-shadow:
      0 0 40px rgba(255, 215, 0, 0.3),
      inset 0 0 30px rgba(255, 215, 0, 0.05);
  }

  .passport-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .passport-emblem {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .passport-header h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--color-star-gold);
    margin-bottom: 0.3rem;
  }

  .passport-subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
  }

  .stamps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stamp-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }

  .stamp,
  .stamp-empty {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }

  .stamp {
    box-shadow: 0 0 15px currentColor;
    animation: stampAppear 0.5s ease-out;
  }

  .stamp-icon {
    color: white;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .stamp-empty {
    background: rgba(255, 255, 255, 0.1);
    border: 2px dashed rgba(255, 255, 255, 0.3);
  }

  .stamp-question {
    color: rgba(255, 255, 255, 0.3);
  }

  .stamp-name {
    font-size: 0.7rem;
    color: var(--color-cosmic-white);
    text-align: center;
  }

  .stamp-name.locked {
    color: rgba(255, 255, 255, 0.4);
  }

  .progress-bar {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    height: 30px;
    position: relative;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: var(--gradient-gold);
    border-radius: 10px;
    transition: width 0.5s ease;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: white;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  .diploma-banner {
    background: var(--gradient-gold);
    color: var(--color-space-black);
    padding: 1rem;
    border-radius: 10px;
    text-align: center;
    font-family: var(--font-display);
    font-weight: bold;
    margin-bottom: 1rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
  }

  .close-btn {
    flex: 1;
  }

  .reset-btn {
    background: rgba(231, 76, 60, 0.3);
    border: 1px solid rgba(231, 76, 60, 0.6);
    color: #e74c3c;
    padding: 0.8rem 1rem;
    border-radius: 50px;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .reset-btn:hover {
    background: rgba(231, 76, 60, 0.5);
  }

  .reset-confirm {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid rgba(231, 76, 60, 0.8);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    z-index: 100;
  }

  .reset-confirm p {
    color: white;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .confirm-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-danger {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-family: var(--font-display);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-family: var(--font-display);
  }

  @keyframes stampAppear {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
</style>
