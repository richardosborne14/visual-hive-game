// Victory scene

export function createVictoryScene() {
    return () => {
        // Victory title
        add([
            text("🎉 SERIES A SECURED! 🎉", { size: 48 }),
            pos(width() / 2, height() / 2 - 60),
            anchor("center"),
            color(255, 215, 0),
        ]);

        // Victory message
        add([
            text("Visual Hive is ready to grow!", { size: 24 }),
            pos(width() / 2, height() / 2),
            anchor("center"),
            color(100, 200, 100),
        ]);

        // Replay prompt
        add([
            text("Click to play again", { size: 16 }),
            pos(width() / 2, height() / 2 + 60),
            anchor("center"),
            color(150, 150, 150),
        ]);

        // Click to restart
        onClick(() => go("main"));

        // Confetti effect
        for (let i = 0; i < 30; i++) {
            wait(i * 0.05, () => {
                const confetti = add([
                    rect(8, 8),
                    pos(rand(0, width()), -20),
                    color(rand(100, 255), rand(100, 255), rand(100, 255)),
                    lifespan(3),
                    { vel: rand(50, 150) }
                ]);
                
                confetti.onUpdate(() => {
                    confetti.pos.y += confetti.vel * dt();
                });
            });
        }
    };
}