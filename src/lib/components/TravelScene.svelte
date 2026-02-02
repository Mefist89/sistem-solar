<script>
  import { gameStore } from "$lib/stores/gameStore.js";

  $: planet = $gameStore.currentPlanet;
</script>

{#if planet}
  <div class="travel-scene">
    <div class="stars-warp"></div>

    <div class="spaceship-flying">
      <span class="ship">🚀</span>
      <div class="engine-trail"></div>
    </div>

    <div class="sparky-following">✨</div>

    <div class="destination-info">
      <p class="traveling-text">Zburăm spre planeta...</p>
      <h2 class="destination-name" style="color: {planet.color}">
        {planet.name}
      </h2>
    </div>
  </div>
{/if}

<style>
  .travel-scene {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stars-warp {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 50px,
      rgba(255, 255, 255, 0.1) 50px,
      rgba(255, 255, 255, 0.3) 52px,
      transparent 52px
    );
    animation: warpSpeed 0.3s linear infinite;
  }

  .spaceship-flying {
    position: relative;
    font-size: 5rem;
    z-index: 10;
    animation: shipShake 0.1s linear infinite;
  }

  .ship {
    display: block;
    transform: rotate(-90deg);
    filter: drop-shadow(0 0 30px rgba(255, 200, 50, 0.8));
  }

  .engine-trail {
    position: absolute;
    bottom: 50%;
    right: 100%;
    width: 200px;
    height: 20px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 150, 50, 0.8) 50%,
      rgba(255, 200, 100, 1) 100%
    );
    border-radius: 10px 0 0 10px;
    transform: translateY(50%);
    animation: trailPulse 0.2s ease-in-out infinite;
  }

  .sparky-following {
    position: absolute;
    left: calc(50% - 150px);
    top: calc(50% + 30px);
    font-size: 2rem;
    animation: sparkyFollow 0.5s ease-in-out infinite;
    z-index: 10;
  }

  .destination-info {
    position: absolute;
    bottom: 15%;
    text-align: center;
  }

  .traveling-text {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.5rem;
    letter-spacing: 2px;
  }

  .destination-name {
    font-family: var(--font-display);
    font-size: 3rem;
    text-shadow: 0 0 30px currentColor;
    animation: nameGlow 1s ease-in-out infinite;
  }

  @keyframes warpSpeed {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-52px);
    }
  }

  @keyframes shipShake {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(2px);
    }
  }

  @keyframes trailPulse {
    0%,
    100% {
      width: 200px;
      opacity: 1;
    }
    50% {
      width: 250px;
      opacity: 0.8;
    }
  }

  @keyframes sparkyFollow {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-10px, 5px);
    }
  }

  @keyframes nameGlow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
</style>
