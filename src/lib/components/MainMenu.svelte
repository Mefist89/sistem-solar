<script>
  import { gameStore } from "$lib/stores/gameStore.js";

  function handleStart() {
    gameStore.goToMap();
  }
</script>

<div class="main-menu">
  <div class="stars"></div>

  <div class="menu-content">
    <div class="logo-container">
      <h1 class="game-title">
        <span class="title-cosmic">Odiseea</span>
        <span class="title-odyssey">Cosmică</span>
      </h1>
      <p class="subtitle">Misiunea clasei a 4-a</p>
    </div>

    <div class="spaceship-preview">
      <div class="spaceship">🚀</div>
      <div class="sparky">✨</div>
    </div>

    <button class="btn btn-gold start-btn" on:click={handleStart}>
      🚀 Start
    </button>

    <p class="hint">Explorează toate cele 8 planete ale Sistemului Solar!</p>
  </div>

  <div class="ground"></div>
</div>

<style>
  .main-menu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 60%, #2d4a6d 100%);
  }

  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70%;
    background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
      radial-gradient(
        2px 2px at 40px 70px,
        rgba(255, 255, 255, 0.8),
        transparent
      ),
      radial-gradient(1px 1px at 90px 40px, white, transparent),
      radial-gradient(
        2px 2px at 130px 80px,
        rgba(255, 255, 255, 0.6),
        transparent
      ),
      radial-gradient(1px 1px at 160px 120px, white, transparent),
      radial-gradient(
        2px 2px at 200px 50px,
        rgba(255, 255, 255, 0.9),
        transparent
      ),
      radial-gradient(1px 1px at 250px 160px, white, transparent),
      radial-gradient(
        2px 2px at 300px 90px,
        rgba(255, 255, 255, 0.7),
        transparent
      );
    background-size: 350px 200px;
    animation: twinkle 3s ease-in-out infinite alternate;
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    text-align: center;
  }

  .logo-container {
    margin-bottom: 2rem;
  }

  .game-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title-cosmic {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 400;
    color: var(--color-cosmic-white);
    text-shadow: 0 0 20px rgba(107, 92, 231, 0.5);
    letter-spacing: 8px;
  }

  .title-odyssey {
    font-family: var(--font-display);
    font-size: 4rem;
    font-weight: 900;
    background: var(--gradient-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  }

  .subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 1rem;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .spaceship-preview {
    position: relative;
    font-size: 5rem;
    margin: 2rem 0;
    animation: float 3s ease-in-out infinite;
  }

  .spaceship {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  }

  .sparky {
    position: absolute;
    right: -30px;
    bottom: 10px;
    font-size: 2rem;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .start-btn {
    font-size: 1.5rem;
    padding: 1.2rem 3rem;
    margin-top: 1rem;
    animation: glow 2s ease-in-out infinite;
  }

  .hint {
    margin-top: 2rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .ground {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 15%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      #1a3a5c 30%,
      #0d2840 100%
    );
    border-top: 2px solid rgba(255, 255, 255, 0.1);
  }

  .ground::before {
    content: "";
    position: absolute;
    bottom: 20%;
    left: 10%;
    width: 80%;
    height: 60%;
    background: radial-gradient(
        ellipse 100px 20px at 10% 50%,
        rgba(100, 150, 200, 0.3),
        transparent
      ),
      radial-gradient(
        ellipse 150px 30px at 50% 70%,
        rgba(100, 150, 200, 0.2),
        transparent
      ),
      radial-gradient(
        ellipse 80px 15px at 80% 40%,
        rgba(100, 150, 200, 0.25),
        transparent
      );
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
      transform: translateY(-15px);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  @keyframes glow {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }
    50% {
      box-shadow:
        0 0 40px rgba(255, 215, 0, 0.8),
        0 0 60px rgba(255, 215, 0, 0.4);
    }
  }
</style>
