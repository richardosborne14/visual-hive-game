// Game configuration and constants

export const GAME_CONFIG = {
    width: 1200,
    height: 800,
    background: [20, 20, 40]
};

export const SPRITES = [
    { name: "bogdan", path: "assets/sprites/bogdan.jpeg" },
    { name: "petrica", path: "assets/sprites/petrica.jpeg" },
    { name: "richard", path: "assets/sprites/richard.jpeg" },
    { name: "dishant", path: "assets/sprites/dishant.jpeg" },
    { name: "thong", path: "assets/sprites/thong.jpeg" },
    { name: "caroline", path: "assets/sprites/caroline.jpeg" },
    { name: "kunal", path: "assets/sprites/kunal.jpeg" },
    { name: "kateryna", path: "assets/sprites/kateryna.jpeg" },
    { name: "maksym", path: "assets/sprites/maksym.jpeg" },
    { name: "arianne", path: "assets/sprites/arianne.jpeg" },
    { name: "iustina", path: "assets/sprites/iustina.png" }
];

export const UI_CONFIG = {
    title: {
        text: "Visual Hive: Quest for Series A",
        size: 32,
        y: 40,
        color: [255, 215, 0]
    },
    subtitle: {
        text: "Explore ALL team members to secure Series A!",
        size: 16,
        y: 80,
        color: [200, 200, 200]
    },
    progressBar: {
        width: 400,
        height: 30,
        y: 120,
        fillColor: [100, 200, 100],
        bgColor: [60, 60, 80]
    },
    exploration: {
        y: 160,
        size: 14,
        color: [255, 215, 0]
    },
    footer: {
        text: "Click team members to secure Series A!",
        size: 14,
        color: [150, 150, 150]
    }
};

export const CONNECTION_CONFIG = {
    pulseInterval: 3,
    fadeOutDelay: 1.5,
    hoverOpacity: 0.15,
    clickOpacity: 0.9,
    secondaryOpacity: 0.5
};

export const CHARACTER_CONFIG = {
    circleRadius: 40,
    spriteScale: 0.25,
    labelOffsetY: 60,
    roleOffsetY: 80,
    cooldownTime: 1.5
};