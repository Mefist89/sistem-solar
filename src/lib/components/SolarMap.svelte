<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { onMount } from "svelte";

  $: planets = $gameStore.planets;

  let hoveredPlanet = null;

  function selectPlanet(planet) {
    if (planet.unlocked) {
      gameStore.selectPlanet(planet.id);
      // Simulare zbor
      setTimeout(() => {
        gameStore.arriveAtPlanet();
      }, 2000);
    }
  }

  function openPassport() {
    gameStore.togglePassport();
  }
</script>

<div class="solar-map">
  <!-- Stele pe fundal -->
  <div class="stars-layer"></div>

  <!-- Soarele în centru -->
  <div class="sun">
    <div class="sun-glow"></div>
    <span class="sun-icon">☀️</span>
  </div>

  <!-- Orbite și planete -->
  {#each planets as planet}
    <div
      class="orbit"
      style="width: {planet.orbitRadius * 2}px; height: {planet.orbitRadius *
        2}px;"
    ></div>

    <button
      class="planet"
      class:locked={!planet.unlocked}
      class:completed={planet.completed}
      style="
        --orbit-radius: {planet.orbitRadius}px;
        --planet-size: {planet.size}px;
        --planet-color: {planet.color};
        --orbit-duration: {10 + planet.order * 3}s;
      "
      on:click={() => selectPlanet(planet)}
      on:mouseenter={() => (hoveredPlanet = planet)}
      on:mouseleave={() => (hoveredPlanet = null)}
      disabled={!planet.unlocked}
    >
      <div class="planet-body">
        {#if planet.completed}
          <span class="completed-check">✓</span>
        {:else if !planet.unlocked}
          <span class="locked-icon">🔒</span>
        {/if}
      </div>

      {#if hoveredPlanet === planet}
        <div class="planet-tooltip">
          {planet.name}
          {#if planet.completed}
            <span class="tooltip-status">✓ Explorat</span>
          {:else if !planet.unlocked}
            <span class="tooltip-status locked">🔒 Blocat</span>
          {/if}
        </div>
      {/if}
    </button>
  {/each}

  <!-- Buton pașaport -->
  <button class="passport-btn" on:click={openPassport}>
    <span class="passport-icon">📔</span>
    <span class="passport-label">Pașaport</span>
  </button>

  <!-- Scânteică -->
  <div class="sparky">✨</div>
</div>

<style>
  .solar-map {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%);
  }

  .stars-layer {
    position: absolute;
    width: 200%;
    height: 200%;
    background-image: radial-gradient(1px 1px at 10% 20%, white, transparent),
      radial-gradient(1px 1px at 25% 45%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(2px 2px at 40% 15%, white, transparent),
      radial-gradient(1px 1px at 55% 65%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(2px 2px at 70% 35%, white, transparent),
      radial-gradient(1px 1px at 85% 55%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 15% 75%, white, transparent),
      radial-gradient(2px 2px at 90% 85%, rgba(255, 255, 255, 0.9), transparent);
    background-size: 250px 250px;
    animation: twinkle 4s ease-in-out infinite alternate;
  }

  .sun {
    position: absolute;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .sun-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 200, 50, 0.8) 0%,
      transparent 70%
    );
    border-radius: 50%;
    animation: sunPulse 3s ease-in-out infinite;
  }

  .sun-icon {
    font-size: 2.5rem;
    z-index: 1;
    filter: drop-shadow(0 0 20px rgba(255, 200, 50, 0.8));
  }

  .orbit {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }

  .planet {
    position: absolute;
    width: var(--planet-size);
    height: var(--planet-size);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    background: transparent;
    animation: orbit var(--orbit-duration) linear infinite;
    transform-origin: center;
    z-index: 20;
  }

  .planet-body {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--planet-color);
    box-shadow:
      0 0 15px var(--planet-color),
      inset -5px -5px 10px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .planet:hover:not(:disabled) .planet-body {
    transform: scale(1.3);
    box-shadow:
      0 0 30px var(--planet-color),
      inset -5px -5px 10px rgba(0, 0, 0, 0.4);
  }

  .planet.locked {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .planet.completed .planet-body {
    border: 3px solid var(--color-star-gold);
  }

  .completed-check {
    color: var(--color-star-gold);
    font-weight: bold;
    font-size: 0.8em;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  .locked-icon {
    font-size: 0.6em;
  }

  .planet-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--planet-color);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    white-space: nowrap;
    font-family: var(--font-display);
    font-size: 0.8rem;
    color: white;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }

  .tooltip-status {
    font-size: 0.7rem;
    color: var(--color-star-gold);
  }

  .tooltip-status.locked {
    color: rgba(255, 255, 255, 0.5);
  }

  .passport-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1a2a4a 0%, #0d1f3c 100%);
    border: 2px solid var(--color-star-gold);
    border-radius: 15px;
    padding: 0.8rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 50;
  }

  .passport-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  .passport-icon {
    font-size: 1.5rem;
  }

  .passport-label {
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--color-star-gold);
  }

  .sparky {
    position: absolute;
    bottom: 30px;
    right: 30px;
    font-size: 2rem;
    animation:
      float 2s ease-in-out infinite,
      sparkle 1s ease-in-out infinite;
    z-index: 50;
  }

  @keyframes orbit {
    from {
      transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
    }
  }

  @keyframes sunPulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.5);
    }
  }
</style>
