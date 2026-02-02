<script>
  import { gameStore } from "$lib/stores/gameStore.js";
  import { fade, scale } from "svelte/transition";

  export let content = null;

  function handleClose() {
    gameStore.closeDialog();
  }
</script>

{#if content}
  <div
    class="dialog-overlay"
    transition:fade={{ duration: 200 }}
    on:click={handleClose}
  >
    <div
      class="dialog-box"
      transition:scale={{ duration: 300, start: 0.8 }}
      on:click|stopPropagation
    >
      <div class="professor-avatar">
        <div class="avatar-circle">
          <span class="professor-icon">🤖</span>
          <div class="monocle">🔍</div>
        </div>
        <span class="professor-name">Profesorul Lentilă</span>
      </div>

      <div class="dialog-content">
        <p class="dialog-text">{content}</p>
      </div>

      <button class="btn btn-primary close-btn" on:click={handleClose}>
        Am înțeles!
      </button>
    </div>
  </div>
{/if}

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .dialog-box {
    background: linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%);
    border: 2px solid rgba(107, 92, 231, 0.5);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow:
      0 0 40px rgba(107, 92, 231, 0.3),
      inset 0 0 20px rgba(107, 92, 231, 0.1);
    position: relative;
  }

  .professor-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .avatar-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #6b5ce7 0%, #a855f7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 0 20px rgba(107, 92, 231, 0.5);
  }

  .professor-icon {
    font-size: 2.5rem;
  }

  .monocle {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 1.5rem;
    animation: float 2s ease-in-out infinite;
  }

  .professor-name {
    margin-top: 0.5rem;
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--color-star-gold);
    letter-spacing: 2px;
  }

  .dialog-content {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .dialog-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--color-cosmic-white);
  }

  .close-btn {
    width: 100%;
    font-size: 1rem;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(-10deg);
    }
    50% {
      transform: translateY(-3px) rotate(-10deg);
    }
  }
</style>
