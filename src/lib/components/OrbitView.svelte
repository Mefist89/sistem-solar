<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { onMount } from "svelte";

  $: planet = $gameStore.currentPlanet;
  $: missionUnlocked = $gameStore.missionUnlocked;

  function openScanner() {
    gameStore.openScanner();
  }

  function startMission() {
    if (missionUnlocked) {
      gameStore.startMission();
    }
  }

  function goBack() {
    gameStore.goToMap();
  }
</script>

{#if planet}
  <div class="orbit-view">
    <div class="stars-bg"></div>

    <!-- Planeta pe fundal -->
    <div class="planet-display" style="--planet-color: {planet.color}">
      <div class="planet-sphere"></div>
      <div class="planet-glow"></div>
    </div>

    <!-- Navă spațială -->
    <div class="spaceship">
      <span>🚀</span>
      <div class="sparky-companion">✨</div>
    </div>

    <!-- Panou UI -->
    <div class="ui-panel">
      <h1 class="planet-name">{planet.name}</h1>
      <p class="planet-order">Planeta #{planet.order}</p>

      {#if !missionUnlocked}
        <!-- Buton scaner pulsează -->
        <button class="scanner-btn pulse" on:click={openScanner}>
          <span class="scanner-icon">❗</span>
          <span class="scanner-text">Date de la scaner</span>
        </button>

        <button class="mission-btn locked" disabled>
          🔒 Misiune blocată
        </button>

        <p class="hint-text">Mai întâi studiază datele scanerului!</p>
      {:else}
        <div class="unlocked-msg">✓ Date primite!</div>

        <button class="mission-btn unlocked" on:click={startMission}>
          🎮 {planet.missionName}
        </button>

        <p class="mission-desc">{planet.missionDescription}</p>
      {/if}
    </div>

    <!-- Buton înapoi -->
    <button class="back-btn" on:click={goBack}> ← Hartă </button>
  </div>
{/if}

<style>
  .orbit-view {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 100%);
  }

  .stars-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(1px 1px at 10% 15%, white, transparent),
      radial-gradient(2px 2px at 30% 40%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1px 1px at 50% 25%, white, transparent),
      radial-gradient(1px 1px at 70% 60%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(2px 2px at 85% 30%, white, transparent);
    background-size: 200px 200px;
  }

  .planet-display {
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    width: 400px;
    height: 400px;
  }

  .planet-sphere {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--planet-color);
    box-shadow:
      inset -40px -40px 80px rgba(0, 0, 0, 0.6),
      inset 20px 20px 40px rgba(255, 255, 255, 0.1);
  }

  .planet-glow {
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      var(--planet-color) 0%,
      transparent 60%
    );
    opacity: 0.3;
    animation: planetPulse 4s ease-in-out infinite;
  }

  .spaceship {
    position: absolute;
    left: 15%;
    top: 40%;
    font-size: 4rem;
    animation: hover 3s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  }

  .sparky-companion {
    position: absolute;
    left: -40px;
    top: 20px;
    font-size: 1.5rem;
    animation: sparkFloat 2s ease-in-out infinite;
  }

  .ui-panel {
    position: absolute;
    left: 5%;
    bottom: 10%;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
    max-width: 350px;
    backdrop-filter: blur(10px);
  }

  .planet-name {
    font-family: var(--font-display);
    font-size: 2.5rem;
    color: var(--color-cosmic-white);
    margin-bottom: 0.3rem;
    text-shadow: 0 0 20px currentColor;
  }

  .planet-order {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1.5rem;
  }

  .scanner-btn {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }

  .scanner-btn.pulse {
    animation: scannerPulse 1.5s ease-in-out infinite;
  }

  .scanner-btn:hover {
    transform: scale(1.02);
  }

  .scanner-icon {
    font-size: 1.5rem;
    animation: shake 0.5s ease-in-out infinite;
  }

  .scanner-text {
    font-family: var(--font-display);
    font-size: 1rem;
    color: white;
    letter-spacing: 1px;
  }

  .mission-btn {
    width: 100%;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 12px;
    font-family: var(--font-display);
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
  }

  .mission-btn.locked {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }

  .mission-btn.unlocked {
    background: var(--gradient-gold);
    color: var(--color-space-black);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  .mission-btn.unlocked:hover {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.7);
  }

  .hint-text {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  .unlocked-msg {
    background: rgba(46, 204, 113, 0.2);
    border: 1px solid rgba(46, 204, 113, 0.5);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    color: #2ecc71;
    text-align: center;
    margin-bottom: 1rem;
    font-family: var(--font-display);
  }

  .mission-desc {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    line-height: 1.4;
  }

  .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    padding: 0.8rem 1.5rem;
    color: white;
    font-family: var(--font-display);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }

  @keyframes hover {
    0%,
    100% {
      transform: translateY(0) rotate(-15deg);
    }
    50% {
      transform: translateY(-20px) rotate(-15deg);
    }
  }

  @keyframes sparkFloat {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-5px, -10px);
    }
  }

  @keyframes planetPulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes scannerPulse {
    0%,
    100% {
      box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
    }
    50% {
      box-shadow: 0 0 30px rgba(231, 76, 60, 0.8);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(10deg);
    }
  }
</style>
