import { writable } from 'svelte/store';
import { planets } from '$lib/data/planets.js';

const STORAGE_KEY = 'cosmicOdyssey_progress';

// Загрузка прогресса из localStorage
function loadProgress() {
    if (typeof localStorage === 'undefined') return null;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Eroare la încărcarea progresului:', e);
    }
    return null;
}

// Сохранение прогресса в localStorage
function saveProgress(stamps, planetsState) {
    if (typeof localStorage === 'undefined') return;
    try {
        const progress = {
            stamps,
            completedPlanets: planetsState.filter(p => p.completed).map(p => p.id),
            unlockedPlanets: planetsState.filter(p => p.unlocked).map(p => p.id)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.warn('Eroare la salvarea progresului:', e);
    }
}

// Инициализация планет с сохранённым прогрессом
function initPlanetsWithProgress() {
    const saved = loadProgress();
    if (!saved) return [...planets];
    
    return planets.map(p => ({
        ...p,
        completed: saved.completedPlanets?.includes(p.id) || false,
        unlocked: saved.unlockedPlanets?.includes(p.id) || p.unlocked
    }));
}

// Инициализация штампов с сохранённым прогрессом
function initStampsWithProgress() {
    const saved = loadProgress();
    return saved?.stamps || [];
}

// Состояние игры
function createGameStore() {
    const initialPlanets = initPlanetsWithProgress();
    const initialStamps = initStampsWithProgress();
    
    const { subscribe, set, update } = writable({
        currentScene: 'menu',
        currentPlanet: null,
        showDialog: false,
        dialogContent: null,
        showPassport: false,
        showScanner: false,
        planets: initialPlanets,
        stamps: initialStamps,
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

            const nextStamps = s.stamps.includes(planetId)
                ? s.stamps
                : [...s.stamps, planetId];

            // Сохранение прогресса
            saveProgress(nextStamps, updatedPlanets);

            return {
                ...s,
                currentScene: 'victory',
                planets: updatedPlanets,
                stamps: nextStamps
            };
        }),

        // Проверка завершения игры
        isGameComplete: () => {
            let complete = true;
            const unsub = subscribe(s => {
                complete = new Set(s.stamps).size === 8;
            });
            unsub();
            return complete;
        },

        // Полный сброс прогресса
        resetProgress: () => {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY);
            }
            set({
                currentScene: 'menu',
                currentPlanet: null,
                showDialog: false,
                dialogContent: null,
                showPassport: false,
                showScanner: false,
                planets: [...planets],
                stamps: [],
                missionUnlocked: false
            });
        },

        reset: () => set({
            currentScene: 'menu',
            currentPlanet: null,
            showDialog: false,
            dialogContent: null,
            showPassport: false,
            showScanner: false,
            planets: initPlanetsWithProgress(),
            stamps: initStampsWithProgress(),
            missionUnlocked: false
        })
    };
}

export const gameStore = createGameStore();
