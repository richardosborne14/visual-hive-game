// Main game entry point
import kaboom from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
import { GAME_CONFIG, SPRITES } from './config.js';
import { createMainScene } from './scenes/mainScene.js';
import { createVictoryScene } from './scenes/victoryScene.js';

// Detect if mobile
const isMobile = window.innerWidth < 768;

// Calculate responsive dimensions
const getGameDimensions = () => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    // Desktop: use config dimensions
    if (!isMobile) {
        return {
            width: Math.min(GAME_CONFIG.width, maxWidth),
            height: Math.min(GAME_CONFIG.height, maxHeight)
        };
    }
    
    // Mobile: full screen
    return {
        width: maxWidth,
        height: maxHeight
    };
};

const dimensions = getGameDimensions();

const k = kaboom({
    width: dimensions.width,
    height: dimensions.height,
    background: GAME_CONFIG.background,
    scale: 1,
    stretch: true,  // Changed to true for better scaling
    letterbox: true, // Changed to true to maintain aspect ratio
    crisp: false,    // Changed to false to fix pixelation
    canvas: document.querySelector("canvas") || undefined,
    root: document.getElementById("game-container")
});

// Load all sprites
SPRITES.forEach(sprite => {
    k.loadSprite(sprite.name, sprite.path);
});

// Register scenes - pass both k and isMobile flag
k.scene("main", createMainScene(k, isMobile));
k.scene("victory", createVictoryScene(k));

// Start game
k.go("main");

// Handle window resize
window.addEventListener('resize', () => {
    const newDimensions = getGameDimensions();
    // Kaboom will handle the resize automatically with letterbox
});