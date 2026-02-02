import { writable } from 'svelte/store';
import { planets } from '$lib/data/planets.js';

// Состояние игры
function createGameStore() {
    const { subscribe, set, update } = writable({
        currentScene: 'menu', // menu, map, travel, orbit, minigame, victory
        currentPlanet: null,
        showDialog: false,
        dialogContent: null,
        showPassport: false,
        showScanner: false,
        planets: [...planets],
        stamps: [],
        missionUnlocked: false
    });

    return {
        subscribe,

        // Навигация
        goToMenu: () => update(s => ({ ...s, currentScene: 'menu' })),
        goToMap: () => update(s => ({ ...s, currentScene: 'map', currentPlanet: null })),

        // Выбор планеты
        selectPlanet: (planetId) => update(s => {
            const planet = s.planets.find(p => p.id === planetId);
            return { ...s, currentScene: 'travel', currentPlanet: planet, missionUnlocked: false };
        }),

        arriveAtPlanet: () => update(s => ({ ...s, currentScene: 'orbit' })),

        // Диалоги профессора
        showProfessorDialog: (content) => update(s => ({
            ...s, showDialog: true, dialogContent: content
        })),

        closeDialog: () => update(s => ({ ...s, showDialog: false, dialogContent: null })),

        // Сканер
        openScanner: () => update(s => ({ ...s, showScanner: true })),
        closeScanner: () => update(s => ({ ...s, showScanner: false, missionUnlocked: true })),

        // Паспорт
        togglePassport: () => update(s => ({ ...s, showPassport: !s.showPassport })),

        // Мини-игра
        startMission: () => update(s => ({ ...s, currentScene: 'minigame' })),

        // Победа
        completeMission: (planetId) => update(s => {
            const updatedPlanets = s.planets.map((p, idx) => {
                if (p.id === planetId) {
                    return { ...p, completed: true };
                }
                // Разблокировать следующую планету
                if (idx > 0 && s.planets[idx - 1].id === planetId && !p.unlocked) {
                    return { ...p, unlocked: true };
                }
                return p;
            });

            return {
                ...s,
                currentScene: 'victory',
                planets: updatedPlanets,
                stamps: [...s.stamps, planetId]
            };
        }),

        // Проверка завершения игры
        isGameComplete: () => {
            let complete = true;
            const unsub = subscribe(s => {
                complete = s.stamps.length === 8;
            });
            unsub();
            return complete;
        },

        reset: () => set({
            currentScene: 'menu',
            currentPlanet: null,
            showDialog: false,
            dialogContent: null,
            showPassport: false,
            showScanner: false,
            planets: [...planets],
            stamps: [],
            missionUnlocked: false
        })
    };
}

export const gameStore = createGameStore();
