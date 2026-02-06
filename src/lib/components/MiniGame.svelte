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
  let playerY = 80;
  let obstacles = [];
  let collectibles = [];
  let animationFrame;
  let timerInterval;
  let missionTimeout;
  
  // Variabile specifice pentru fiecare planetă
  let windForce = 0;
  let targetScore = 8;
  let mazeWalls = [];
  let mazeExit = { x: 90, y: 10 };

  // Configurație pentru fiecare planetă
  const gameConfigs = {
    mercury: {
      name: 'Scutul Solar',
      hint: 'Evită erupțiile solare! ☀️',
      targetScore: 20,
      timeLimit: 25,
      obstacleEmoji: '☀️',
      collectEmoji: '🛡️'
    },
    venus: {
      name: 'Prin Nori',
      hint: 'Urcă prin norii denși! ☁️',
      targetScore: 6,
      timeLimit: 30,
      obstacleEmoji: '☁️',
      collectEmoji: '⭐'
    },
    earth: {
      name: 'Deșeuri Spațiale',
      hint: 'Colectează deșeurile de pe orbită! 🛰️',
      targetScore: 10,
      timeLimit: 35,
      obstacleEmoji: '☄️',
      collectEmoji: '🛰️'
    },
    mars: {
      name: 'Roverul în Dune',
      hint: 'Conduce roverul și evită pietrele! 🚗',
      targetScore: 15,
      timeLimit: 30,
      obstacleEmoji: '🪨',
      collectEmoji: '💎'
    },
    jupiter: {
      name: 'Zbor în Uragan',
      hint: 'Zboară prin furtuni și evită fulgerele! ⚡',
      targetScore: 12,
      timeLimit: 25,
      obstacleEmoji: '⚡',
      collectEmoji: '🔮'
    },
    saturn: {
      name: 'Dansul Inelelor',
      hint: 'Colectează cristale de gheață în inele! 💎',
      targetScore: 10,
      timeLimit: 30,
      obstacleEmoji: '🪨',
      collectEmoji: '💎'
    },
    uranus: {
      name: 'Labirintul de Gheață',
      hint: 'Găsește ieșirea din labirint! ❄️',
      targetScore: 1,
      timeLimit: 45,
      obstacleEmoji: '🧊',
      collectEmoji: '🚪'
    },
    neptune: {
      name: 'Vântul Furtunos',
      hint: 'Rezistă la cel mai puternic vânt! 🌪️',
      targetScore: 20,
      timeLimit: 30,
      obstacleEmoji: '🌪️',
      collectEmoji: '⚓'
    }
  };

  $: config = planet ? gameConfigs[planet.id] : null;

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
    if (!planet) return;
    
    score = 0;
    timeLeft = config?.timeLimit || 30;
    targetScore = config?.targetScore || 8;
    isPlaying = true;
    gameWon = false;
    playerX = 50;
    playerY = planet.id === 'venus' ? 90 : (planet.id === 'uranus' ? 10 : 80);
    windForce = 0;
    obstacles = [];
    collectibles = [];
    mazeWalls = [];

    initGameForPlanet();

    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    gameLoop();
  }

  function initGameForPlanet() {
    switch (planet.id) {
      case 'mercury':
        initMercuryGame();
        break;
      case 'venus':
        initVenusGame();
        break;
      case 'earth':
        initEarthGame();
        break;
      case 'mars':
        initMarsGame();
        break;
      case 'jupiter':
        initJupiterGame();
        break;
      case 'saturn':
        initSaturnGame();
        break;
      case 'uranus':
        initUranusGame();
        break;
      case 'neptune':
        initNeptuneGame();
        break;
    }
  }

  // MERCUR: Evită erupțiile solare
  function initMercuryGame() {
    for (let i = 0; i < 4; i++) {
      spawnSolarFlare();
    }
  }

  function spawnSolarFlare() {
    obstacles.push({
      x: Math.random() * 90 + 5,
      y: -10,
      size: 40,
      speed: 2 + Math.random() * 2
    });
  }

  // VENUS: Urcă prin nori
  function initVenusGame() {
    playerY = 90;
    for (let i = 0; i < 6; i++) {
      collectibles.push({
        x: Math.random() * 80 + 10,
        y: 80 - i * 15,
        collected: false
      });
    }
    for (let i = 0; i < 8; i++) {
      obstacles.push({
        x: Math.random() * 100,
        y: Math.random() * 80,
        size: 60 + Math.random() * 40,
        speed: 0.3 + Math.random() * 0.5
      });
    }
  }

  // PĂMÂNT: Colectează deșeuri spațiale
  function initEarthGame() {
    for (let i = 0; i < 10; i++) {
      collectibles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        collected: false
      });
    }
    for (let i = 0; i < 3; i++) {
      obstacles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        size: 30,
        speed: 1 + Math.random()
      });
    }
  }

  // MARTE: Rover în dune
  function initMarsGame() {
    playerY = 85;
    for (let i = 0; i < 6; i++) {
      obstacles.push({
        x: 100 + i * 30,
        y: 75 + Math.random() * 15,
        size: 25 + Math.random() * 15,
        speed: 3 + Math.random() * 2
      });
    }
  }

  // JUPITER: Zbor prin furtuni
  function initJupiterGame() {
    for (let i = 0; i < 12; i++) {
      collectibles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        collected: false
      });
    }
    for (let i = 0; i < 6; i++) {
      obstacles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 35,
        speed: 3 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  // SATURN: Dansul inelelor
  function initSaturnGame() {
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      collectibles.push({
        x: 50 + Math.cos(angle) * (25 + Math.random() * 15),
        y: 50 + Math.sin(angle) * (15 + Math.random() * 10),
        collected: false,
        angle: angle
      });
    }
    for (let i = 0; i < 4; i++) {
      obstacles.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: 30,
        speed: 1,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  // URANUS: Labirint de gheață
  function initUranusGame() {
    playerX = 10;
    playerY = 90;
    mazeWalls = [
      { x1: 20, y1: 0, x2: 20, y2: 70 },
      { x1: 40, y1: 30, x2: 40, y2: 100 },
      { x1: 60, y1: 0, x2: 60, y2: 70 },
      { x1: 80, y1: 30, x2: 80, y2: 100 }
    ];
    collectibles.push({
      x: 90,
      y: 10,
      collected: false
    });
  }

  // NEPTUN: Rezistă la vânt
  function initNeptuneGame() {
    playerX = 50;
    playerY = 50;
  }

  function gameLoop() {
    if (!isPlaying) return;

    switch (planet.id) {
      case 'mercury':
        updateMercuryGame();
        break;
      case 'venus':
        updateVenusGame();
        break;
      case 'earth':
        updateEarthGame();
        break;
      case 'mars':
        updateMarsGame();
        break;
      case 'jupiter':
        updateJupiterGame();
        break;
      case 'saturn':
        updateSaturnGame();
        break;
      case 'uranus':
        updateUranusGame();
        break;
      case 'neptune':
        updateNeptuneGame();
        break;
    }

    obstacles = obstacles;
    collectibles = collectibles;

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function updateMercuryGame() {
    // Supraviețuire: evită erupțiile solare
    obstacles.forEach(obs => {
      obs.y += obs.speed;
      if (obs.y > 110) {
        obs.y = -10;
        obs.x = Math.random() * 90 + 5;
        score++;
      }
    });

    // Verifică coliziuni
    for (const obs of obstacles) {
      const dist = Math.sqrt(Math.pow(playerX - obs.x, 2) + Math.pow(playerY - obs.y, 2));
      if (dist < obs.size / 8) {
        endGame(false);
        return;
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateVenusGame() {
    // Nori care se mișcă
    obstacles.forEach(obs => {
      obs.x += obs.speed;
      if (obs.x > 110) obs.x = -20;
    });

    // Colectează stele
    collectibles.forEach(item => {
      if (!item.collected) {
        const dist = Math.sqrt(Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2));
        if (dist < 6) {
          item.collected = true;
          score++;
        }
      }
    });

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateEarthGame() {
    // Obstacole care orbitează
    obstacles.forEach(obs => {
      obs.x += obs.speed;
      if (obs.x > 100) obs.x = 0;
    });

    // Colectează deșeuri
    collectibles.forEach(item => {
      if (!item.collected) {
        const dist = Math.sqrt(Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2));
        if (dist < 5) {
          item.collected = true;
          score++;
        }
      }
    });

    // Verifică coliziuni cu obstacole
    for (const obs of obstacles) {
      const dist = Math.sqrt(Math.pow(playerX - obs.x, 2) + Math.pow(playerY - obs.y, 2));
      if (dist < obs.size / 10) {
        playerX = Math.max(5, Math.min(95, playerX - 3));
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateMarsGame() {
    // Pietre care vin spre rover
    obstacles.forEach(obs => {
      obs.x -= obs.speed;
      if (obs.x < -10) {
        obs.x = 110;
        obs.y = 75 + Math.random() * 15;
        score++;
      }
    });

    // Verifică coliziuni
    for (const obs of obstacles) {
      if (obs.x > playerX - 5 && obs.x < playerX + 5 && 
          Math.abs(obs.y - playerY) < 8) {
        endGame(false);
        return;
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateJupiterGame() {
    // Fulgere care se mișcă aleatoriu
    obstacles.forEach(obs => {
      obs.x += Math.cos(obs.angle) * obs.speed;
      obs.y += Math.sin(obs.angle) * obs.speed;
      obs.angle += 0.05;
      
      if (obs.x < 0 || obs.x > 100) obs.angle = Math.PI - obs.angle;
      if (obs.y < 0 || obs.y > 100) obs.angle = -obs.angle;
    });

    // Colectează cristale
    collectibles.forEach(item => {
      if (!item.collected) {
        const dist = Math.sqrt(Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2));
        if (dist < 5) {
          item.collected = true;
          score++;
        }
      }
    });

    // Verifică coliziuni
    for (const obs of obstacles) {
      const dist = Math.sqrt(Math.pow(playerX - obs.x, 2) + Math.pow(playerY - obs.y, 2));
      if (dist < obs.size / 10) {
        endGame(false);
        return;
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateSaturnGame() {
    // Cristale care se rotesc în inele
    collectibles.forEach(item => {
      if (!item.collected) {
        item.angle += 0.01;
        item.x = 50 + Math.cos(item.angle) * 30;
        item.y = 50 + Math.sin(item.angle) * 20;
        
        const dist = Math.sqrt(Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2));
        if (dist < 5) {
          item.collected = true;
          score++;
        }
      }
    });

    // Obstacole
    obstacles.forEach(obs => {
      obs.angle += 0.02;
      obs.x = 50 + Math.cos(obs.angle) * 40;
      obs.y = 50 + Math.sin(obs.angle) * 25;
    });

    for (const obs of obstacles) {
      const dist = Math.sqrt(Math.pow(playerX - obs.x, 2) + Math.pow(playerY - obs.y, 2));
      if (dist < obs.size / 10) {
        playerX = Math.max(5, Math.min(95, playerX - 5));
        playerY = Math.max(5, Math.min(95, playerY - 5));
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function updateUranusGame() {
    // Verifică dacă a ajuns la ieșire
    const item = collectibles[0];
    if (item && !item.collected) {
      const dist = Math.sqrt(Math.pow(playerX - item.x, 2) + Math.pow(playerY - item.y, 2));
      if (dist < 8) {
        item.collected = true;
        score++;
        endGame(true);
      }
    }
  }

  function updateNeptuneGame() {
    // Vânt puternic care împinge jucătorul
    windForce = Math.sin(Date.now() / 500) * 3;
    playerX += windForce * 0.1;
    playerX = Math.max(10, Math.min(90, playerX));

    // Puncte pentru menținerea poziției centrale
    if (Math.abs(playerX - 50) < 15) {
      score += 0.1;
    }

    if (score >= targetScore) {
      endGame(true);
    }
  }

  function handleKeydown(e) {
    if (!isPlaying) return;

    const speed = planet.id === 'mars' ? 5 : 3;
    
    switch (e.key) {
      case "ArrowUp":
      case "w":
        if (planet.id !== 'mars') {
          if (!checkMazeCollision(playerX, playerY - speed)) {
            playerY = Math.max(5, playerY - speed);
          }
        }
        break;
      case "ArrowDown":
      case "s":
        if (planet.id !== 'mars') {
          if (!checkMazeCollision(playerX, playerY + speed)) {
            playerY = Math.min(95, playerY + speed);
          }
        }
        break;
      case "ArrowLeft":
      case "a":
        if (!checkMazeCollision(playerX - speed, playerY)) {
          playerX = Math.max(5, playerX - speed);
        }
        break;
      case "ArrowRight":
      case "d":
        if (!checkMazeCollision(playerX + speed, playerY)) {
          playerX = Math.min(95, playerX + speed);
        }
        break;
      case " ":
        if (planet.id === 'mars') {
          playerY = Math.max(70, playerY - 10);
          setTimeout(() => {
            if (isPlaying) playerY = Math.min(95, playerY + 10);
          }, 300);
        }
        break;
    }
  }

  function checkMazeCollision(newX, newY) {
    if (planet.id !== 'uranus') return false;
    
    for (const wall of mazeWalls) {
      if (newX > wall.x1 - 3 && newX < wall.x1 + 3) {
        if (newY > wall.y1 && newY < wall.y2) {
          return true;
        }
      }
    }
    return false;
  }

  function handleMove(e) {
    if (!isPlaying || !gameCanvas) return;
    if (planet.id === 'mars') return;

    const rect = gameCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, x));
    const newY = Math.max(5, Math.min(95, y));

    if (!checkMazeCollision(newX, newY)) {
      playerX = newX;
      if (planet.id !== 'mars') {
        playerY = newY;
      }
    }
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

  function getPlayerEmoji() {
    switch (planet?.id) {
      case 'mars': return '🚗';
      case 'neptune': return '⚓';
      default: return '🚀';
    }
  }

  function getPlayerRotation() {
    switch (planet?.id) {
      case 'venus': return 'rotate(0deg)';
      case 'mars': return 'rotate(0deg)';
      default: return 'rotate(-45deg)';
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if planet && config}
  <div class="minigame-container">
    <div class="game-header">
      <button class="back-btn" on:click={goBack}>← Înapoi</button>
      <h2 class="mission-title">{config.name}</h2>
      <div class="stats">
        <span class="score">⭐ {Math.floor(score)}/{targetScore}</span>
        <span class="timer" class:warning={timeLeft <= 10}>⏱ {timeLeft}s</span>
      </div>
    </div>

    <button
      class="game-area"
      bind:this={gameCanvas}
      on:mousemove={handleMove}
      type="button"
      aria-label="Zona de joc"
      style="--planet-color: {planet.color}"
    >
      {#if isPlaying}
        <!-- Jucător -->
        <div 
          class="player" 
          style="left: {playerX}%; top: {playerY}%; transform: translate(-50%, -50%) {getPlayerRotation()}"
        >
          {getPlayerEmoji()}
        </div>

        <!-- Scânteică -->
        {#if planet.id !== 'mars'}
          <div class="sparky" style="left: {playerX - 5}%; top: {playerY + 5}%">
            ✨
          </div>
        {/if}

        <!-- Indicator vânt pentru Neptun -->
        {#if planet.id === 'neptune'}
          <div class="wind-indicator" style="transform: scaleX({windForce})">
            🌪️
          </div>
          <div class="target-zone" style="left: 35%; width: 30%"></div>
        {/if}

        <!-- Ziduri labirint pentru Uranus -->
        {#if planet.id === 'uranus'}
          {#each mazeWalls as wall}
            <div 
              class="maze-wall"
              style="left: {wall.x1}%; top: {wall.y1}%; height: {wall.y2 - wall.y1}%"
            ></div>
          {/each}
        {/if}

        <!-- Obstacole -->
        {#each obstacles as obs}
          <div
            class="obstacle"
            style="left: {obs.x}%; top: {obs.y}%; width: {obs.size}px; height: {obs.size}px"
          >
            {config.obstacleEmoji}
          </div>
        {/each}

        <!-- Obiecte de colectat -->
        {#each collectibles as item}
          {#if !item.collected}
            <div class="collectible" style="left: {item.x}%; top: {item.y}%">
              {config.collectEmoji}
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
          <h3>{planet.id === 'mercury' || planet.id === 'jupiter' || planet.id === 'mars' ? 'Ai fost lovit!' : 'Timpul a expirat!'}</h3>
          <button class="btn btn-primary" on:click={retry}>
            Încearcă din nou
          </button>
        </div>
      {/if}
    </button>

    <div class="controls-hint">
      <p>🖱️ Mișcă mouse-ul sau folosește {planet.id === 'mars' ? '⬅️➡️ + SPAȚIU pentru a sări' : 'săgețile ⬆️⬇️⬅️➡️'}</p>
      <p>{config.hint}</p>
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
    appearance: none;
    -webkit-appearance: none;
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

  .wind-indicator {
    position: absolute;
    top: 10%;
    left: 50%;
    font-size: 3rem;
    transform-origin: center;
    transition: transform 0.2s;
  }

  .target-zone {
    position: absolute;
    top: 30%;
    height: 40%;
    background: rgba(46, 204, 113, 0.2);
    border: 2px dashed rgba(46, 204, 113, 0.5);
    border-radius: 10px;
  }

  .maze-wall {
    position: absolute;
    width: 4px;
    background: linear-gradient(180deg, #76d7c4, #1abc9c);
    box-shadow: 0 0 10px rgba(118, 215, 196, 0.8);
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
