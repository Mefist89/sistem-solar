<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { onMount, onDestroy } from "svelte";

  $: planet = $gameStore.currentPlanet;

  // Starea mini-jocului
  let gameCanvas;
  let score = 0;
  let timeLeft = 30;
  let isPlaying = false;
  let gameWon = false;
  let playerX = 50;
  let playerY = 50;
  let obstacles = [];
  let collectibles = [];
  let animationFrame;
  let timerInterval;
  let missionTimeout;

  onMount(() => {
    startGame();
  });

  onDestroy(() => {
    cleanup();
  });

  function cleanup() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (timerInterval) clearInterval(timerInterval);
    if (missionTimeout) clearTimeout(missionTimeout);
  }

  function startGame() {
    score = 0;
    timeLeft = 30;
    isPlaying = true;
    gameWon = false;
    playerX = 50;
    playerY = 50;

    // Creăm obstacole
    obstacles = [];
    collectibles = [];

    for (let i = 0; i < 5; i++) {
      obstacles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        size: 30 + Math.random() * 20,
        speed: 0.5 + Math.random() * 1,
      });
    }

    for (let i = 0; i < 8; i++) {
      collectibles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        collected: false,
      });
    }

    // Cronometru
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    // Bucla jocului
    gameLoop();
  }

  function gameLoop() {
    if (!isPlaying) return;

    // Mișcăm obstacolele
    obstacles.forEach((obs) => {
      obs.x += obs.speed;
      if (obs.x > 100) obs.x = -10;
    });

    // Verificăm colectarea
    collectibles.forEach((item) => {
      if (!item.collected) {
        const dist = Math.sqrt(
          Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2),
        );
        if (dist < 5) {
          item.collected = true;
          score += 10;
        }
      }
    });

    // Verificăm victoria
    if (collectibles.every((i) => i.collected)) {
      endGame(true);
      return;
    }

    // Verificăm coliziunile
    for (const obs of obstacles) {
      const dist = Math.sqrt(
        Math.pow(playerX - obs.x, 2) + Math.pow(playerY - obs.y, 2),
      );
      if (dist < obs.size / 10) {
        // Respingem jucătorul
        playerX = Math.max(5, Math.min(95, playerX - 5));
        break;
      }
    }

    obstacles = obstacles;
    collectibles = collectibles;

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function handleKeydown(e) {
    if (!isPlaying) return;

    const speed = 3;
    switch (e.key) {
      case "ArrowUp":
      case "w":
        playerY = Math.max(5, playerY - speed);
        break;
      case "ArrowDown":
      case "s":
        playerY = Math.min(95, playerY + speed);
        break;
      case "ArrowLeft":
      case "a":
        playerX = Math.max(5, playerX - speed);
        break;
      case "ArrowRight":
      case "d":
        playerX = Math.min(95, playerX + speed);
        break;
    }
  }

  function handleMove(e) {
    if (!isPlaying || !gameCanvas) return;

    const rect = gameCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    playerX = Math.max(5, Math.min(95, x));
    playerY = Math.max(5, Math.min(95, y));
  }

  function endGame(won) {
    cleanup();
    isPlaying = false;
    gameWon = won;

    if (won) {
      missionTimeout = setTimeout(() => {
        gameStore.completeMission(planet.id);
      }, 1500);
    }
  }

  function retry() {
    startGame();
  }

  function goBack() {
    cleanup();
    gameStore.goToMap();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if planet}
  <div class="minigame-container">
    <div class="game-header">
      <button class="back-btn" on:click={goBack}>← Înapoi</button>
      <h2 class="mission-title">{planet.missionName}</h2>
      <div class="stats">
        <span class="score">⭐ {score}</span>
        <span class="timer" class:warning={timeLeft <= 10}>⏱ {timeLeft}s</span>
      </div>
    </div>

    <div
      class="game-area"
      bind:this={gameCanvas}
      on:mousemove={handleMove}
      style="--planet-color: {planet.color}"
    >
      {#if isPlaying}
        <!-- Jucător -->
        <div class="player" style="left: {playerX}%; top: {playerY}%">🚀</div>

        <!-- Scânteică -->
        <div class="sparky" style="left: {playerX - 5}%; top: {playerY + 5}%">
          ✨
        </div>

        <!-- Obstacole -->
        {#each obstacles as obs}
          <div
            class="obstacle"
            style="left: {obs.x}%; top: {obs.y}%; width: {obs.size}px; height: {obs.size}px"
          >
            💥
          </div>
        {/each}

        <!-- Obiecte de colectat -->
        {#each collectibles as item}
          {#if !item.collected}
            <div class="collectible" style="left: {item.x}%; top: {item.y}%">
              🔮
            </div>
          {/if}
        {/each}
      {:else if gameWon}
        <div class="game-result win">
          <span class="result-icon">🎉</span>
          <h3>Excelent!</h3>
          <p>Misiune îndeplinită!</p>
        </div>
      {:else}
        <div class="game-result lose">
          <span class="result-icon">😢</span>
          <h3>Timpul a expirat!</h3>
          <button class="btn btn-primary" on:click={retry}>
            Încearcă din nou
          </button>
        </div>
      {/if}
    </div>

    <div class="controls-hint">
      <p>🖱️ Mișcă mouse-ul sau folosește săgețile ⬆️⬇️⬅️➡️</p>
      <p>Colectează toate cristalele 🔮 și evită obstacolele 💥</p>
    </div>
  </div>
{/if}

<style>
  .minigame-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--gradient-space);
  }

  .game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: rgba(0, 0, 0, 0.5);
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    color: white;
    cursor: pointer;
    font-family: var(--font-body);
  }

  .mission-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--color-star-gold);
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    font-family: var(--font-display);
    font-size: 1.2rem;
  }

  .score {
    color: var(--color-star-gold);
  }

  .timer {
    color: var(--color-cosmic-white);
  }

  .timer.warning {
    color: var(--color-mars-red);
    animation: blink 0.5s ease-in-out infinite;
  }

  .game-area {
    flex: 1;
    position: relative;
    margin: 1rem 2rem;
    border-radius: 20px;
    background: radial-gradient(
        ellipse at center,
        color-mix(in srgb, var(--planet-color) 20%, transparent),
        transparent
      ),
      linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    cursor: none;
  }

  .player {
    position: absolute;
    font-size: 2.5rem;
    transform: translate(-50%, -50%) rotate(-45deg);
    filter: drop-shadow(0 0 15px rgba(255, 200, 50, 0.8));
    z-index: 10;
    transition:
      left 0.05s,
      top 0.05s;
  }

  .sparky {
    position: absolute;
    font-size: 1.5rem;
    transform: translate(-50%, -50%);
    z-index: 9;
    transition:
      left 0.1s,
      top 0.1s;
  }

  .obstacle {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    animation: spin 2s linear infinite;
  }

  .collectible {
    position: absolute;
    font-size: 1.8rem;
    transform: translate(-50%, -50%);
    animation: float 1s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(107, 92, 231, 0.8));
  }

  .game-result {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 3rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .game-result.win {
    background: rgba(46, 204, 113, 0.3);
    border: 2px solid rgba(46, 204, 113, 0.6);
    animation: winPulse 0.5s ease-out;
  }

  .game-result.lose {
    background: rgba(231, 76, 60, 0.3);
    border: 2px solid rgba(231, 76, 60, 0.6);
  }

  .result-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }

  .game-result h3 {
    font-family: var(--font-display);
    font-size: 2rem;
    color: white;
    margin-bottom: 0.5rem;
  }

  .game-result p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1rem;
  }

  .controls-hint {
    text-align: center;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }

  .controls-hint p {
    margin: 0.3rem 0;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -60%) scale(1.1);
    }
  }

  @keyframes winPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
</style>
