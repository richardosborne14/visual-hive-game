// Main game entry point
import kaboom from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
import { GAME_CONFIG, SPRITES } from './config.js';
import { createMainScene } from './scenes/mainScene.js';
import { createVictoryScene } from './scenes/victoryScene.js';

// Initialize Kaboom/Kaplay
kaboom({
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    background: GAME_CONFIG.background,
});

// Load all sprites
SPRITES.forEach(sprite => {
    loadSprite(sprite.name, sprite.path);
});

// Register scenes
scene("main", createMainScene());
scene("victory", createVictoryScene());

// Start game
go("main");