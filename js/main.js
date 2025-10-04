// Main game entry point
import kaboom from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
import { GAME_CONFIG, SPRITES } from './config.js';
import { createMainScene } from './scenes/mainScene.js';
import { createVictoryScene } from './scenes/victoryScene.js';

const k = kaboom({
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    background: GAME_CONFIG.background,
    scale: 1,
    stretch: false,
    letterbox: false,
    crisp: true
});

// Load all sprites
SPRITES.forEach(sprite => {
    k.loadSprite(sprite.name, sprite.path);
});

// Register scenes
k.scene("main", createMainScene(k));
k.scene("victory", createVictoryScene(k));

// Start game
k.go("main");