// js/scenes/mainScene.js - FULL ENHANCED VERSION with all visual effects
import { GAME_CONFIG, UI_CONFIG, CHARACTER_CONFIG, getResponsiveConfig } from '../config.js';
import { characters } from '../data/characters.js';
import { ConnectionManager } from '../utils/connections.js';
import { ProfileManager } from '../ui/profile.js';

export function createMainScene(k) {
    return () => {
        // Get responsive configuration based on WINDOW width, not canvas width
        const responsive = getResponsiveConfig(window.innerWidth); // ✅ Use window.innerWidth
        const { isMobile, isTablet, spriteScale, labelOffsetY, roleOffsetY, layout } = responsive;
        
        // Track progress and exploration
        let progress = 0;
        let exploredCharacters = new Set();
        let connectionManager = null;
        let profileManager = null;
        let timeElapsed = 0;
        
        // Combo system
        let comboCount = 0;
        let comboTimer = null;
        let lastMilestone = 0;

        // Background with animated gradient
        k.add([
            k.rect(k.width(), k.height()),
            k.color(20, 20, 40),
            k.pos(0, 0),
            k.z(-100)
        ]);

        // Add animated stars in background
        for (let i = 0; i < 50; i++) {
            const star = k.add([
                k.circle(k.rand(1, 3)),
                k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
                k.color(255, 255, 255),
                k.opacity(k.rand(0.3, 0.8)),
                k.z(-50),
                "star"
            ]);

            star.onUpdate(() => {
                star.opacity = k.wave(0.3, 0.8, k.time() * k.rand(1, 3));
            });
        }

        // Mouse trail effect
        k.onUpdate(() => {
            const mousePos = k.mousePos();
            
            if (k.rand() < 0.3) {
                k.add([
                    k.circle(k.rand(2, 5)),
                    k.pos(mousePos),
                    k.color(k.rand(150, 255), k.rand(150, 255), k.rand(200, 255)),
                    k.opacity(0.6),
                    k.z(-1),
                    k.lifespan(0.5, { fade: 0.3 })
                ]);
            }
        });

        // Title with glow effect - RESPONSIVE
        const title = k.add([
            k.text("Visual Hive: Quest for Series A", {
                size: isMobile ? 24 : 48,  // ✅ Much smaller on mobile
                font: "sans-serif"
            }),
            k.pos(k.width() / 2, isMobile ? 30 : 50),  // ✅ Higher up on mobile
            k.anchor("center"),
            k.color(255, 215, 0),
            k.z(10)
        ]);

        title.onUpdate(() => {
            const pulse = k.wave(0.8, 1, k.time() * 2);
            title.scale = k.vec2(pulse, pulse);
        });

        // Progress bar container - responsive width
        const progressBarWidth = isMobile ? k.width() - 40 : UI_CONFIG.progressBar.width;  // ✅ Add padding

        k.add([
            k.rect(progressBarWidth + 8, UI_CONFIG.progressBar.height + 8),
            k.pos(k.width() / 2, UI_CONFIG.progressBar.y),
            k.anchor("center"),
            k.outline(3, k.rgb(100, 100, 150)),
            k.color(30, 30, 50),
            k.z(5)
        ]);

        const progressBar = k.add([
            k.rect(0, UI_CONFIG.progressBar.height),
            k.pos(k.width() / 2 - progressBarWidth / 2, UI_CONFIG.progressBar.y - UI_CONFIG.progressBar.height / 2),
            k.color(50, 205, 50),
            k.z(6),
            "progressBar",
            { maxWidth: progressBarWidth }  // ✅ Store for updateProgressBar
        ]);

        k.add([
            k.text("0%", { size: 24 }),
            k.pos(k.width() / 2 + 2, UI_CONFIG.progressBar.y + 2),
            k.anchor("center"),
            k.color(0, 0, 0),
            k.z(6),
            "progressShadow"
        ]);

        k.add([
            k.text("0%", { size: 24 }),
            k.pos(k.width() / 2, UI_CONFIG.progressBar.y),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(7),
            "progressText"
        ]);

        // Character layout - RESPONSIVE VERSION 
        let characterObjects = [];

        // Distribute characters across rows based on layout type
        const characterRows = [];
        if (layout.type === 'desktop') {
            // Desktop: 3, 4, 4
            characterRows.push(characters.slice(0, 3));
            characterRows.push(characters.slice(3, 7));
            characterRows.push(characters.slice(7, 11));
        } else if (layout.type === 'tablet') {
            // Tablet: 3, 3, 3, 2
            characterRows.push(characters.slice(0, 3));
            characterRows.push(characters.slice(3, 6));
            characterRows.push(characters.slice(6, 9));
            characterRows.push(characters.slice(9, 11));
        } else {
            // Mobile: 2, 2, 2, 2, 2, 1
            characterRows.push(characters.slice(0, 2));
            characterRows.push(characters.slice(2, 4));
            characterRows.push(characters.slice(4, 6));
            characterRows.push(characters.slice(6, 8));
            characterRows.push(characters.slice(8, 10));
            characterRows.push(characters.slice(10, 11));
        }

        characterRows.forEach((row, rowIndex) => {
            const numInRow = row.length;
            const rowWidth = numInRow * layout.spacing;
            const startX = (k.width() - rowWidth) / 2 + (layout.spacing / 2);

            row.forEach((char, colIndex) => {
                const x = startX + colIndex * layout.spacing;
                const y = layout.startY + rowIndex * layout.rowSpacing;

                // Glow effect
                const glow = k.add([
                    k.circle(CHARACTER_CONFIG.circleRadius + 20),
                    k.pos(x, y),
                    k.color(char.color[0], char.color[1], char.color[2]),
                    k.opacity(0),
                    k.z(1),
                    { characterName: char.name }
                ]);

                // Character sprite
                const characterSprite = k.add([
                    k.sprite(char.name.toLowerCase()),
                    k.pos(x, y),
                    k.scale(spriteScale),  // ✅ Use destructured variable
                    k.anchor("center"),
                    k.area(),
                    k.z(2),
                    "character",
                    {
                        characterData: char,
                        onCooldown: false,
                        glowObj: glow,
                        baseScale: spriteScale  // ✅ Use destructured variable
                    }
                ]);

                // Emoji overlay
                k.add([
                    k.text(char.emoji, { size: isMobile ? 24 : 28 }),  // ✅ Use destructured variable
                    k.pos(x + (isMobile ? 30 : 35), y - (isMobile ? 30 : 35)),
                    k.anchor("center"),
                    k.z(3)
                ]);

                // Name label
                k.add([
                    k.text(char.name, {
                        size: isMobile ? 14 : 16,  // ✅ Use destructured variable
                        font: "sans-serif"
                    }),
                    k.pos(x, y + labelOffsetY),  // ✅ Use destructured variable
                    k.anchor("center"),
                    k.color(255, 255, 255),
                    k.z(3)
                ]);

                // Role label
                k.add([
                    k.text(char.role, {
                        size: isMobile ? 10 : 12,  // ✅ Use destructured variable
                        font: "sans-serif"
                    }),
                    k.pos(x, y + roleOffsetY),  // ✅ Use destructured variable
                    k.anchor("center"),
                    k.color(180, 180, 200),
                    k.z(3)
                ]);

                characterObjects.push(characterSprite);

                // Touch/Click interaction
                characterSprite.onClick(() => {
                    if (characterSprite.onCooldown) return;
                    handleClick(characterSprite, char, x, y);
                });

                // Hover effects (desktop only)
                if (!isMobile) {  // ✅ Use destructured variable
                    characterSprite.onHoverUpdate(() => {
                        if (!characterSprite.onCooldown) {
                            k.setCursor("pointer");
                            glow.opacity = k.wave(0.3, 0.5, k.time() * 3);
                            characterSprite.scale = k.vec2(0.18, 0.18);
                        }
                    });

                    characterSprite.onHoverEnd(() => {
                        k.setCursor("default");
                        if (!characterSprite.onCooldown) {
                            glow.opacity = 0;
                            characterSprite.scale = k.vec2(spriteScale, spriteScale);  // ✅ Use destructured variable
                        }
                    });
                }
            });
        });

        connectionManager = new ConnectionManager(k, characterObjects);
        profileManager = new ProfileManager(k);

        // HELPER FUNCTIONS

        function createRipple(x, y, color) {
            for (let i = 0; i < 3; i++) {
                k.wait(i * 0.1, () => {
                    const ripple = k.add([
                        k.circle(60),
                        k.pos(x, y),
                        k.outline(3, k.rgb(color[0], color[1], color[2])),
                        k.opacity(0.8),
                        k.z(1)
                    ]);

                    k.tween(60, 120, 0.6, (val) => {
                        ripple.radius = val;
                        ripple.opacity = 0.8 - (val - 60) / 60 * 0.8;
                    }, k.easings.easeOutQuad).then(() => {
                        k.destroy(ripple);
                    });
                });
            }
        }

        function showCombo(count, x, y) {
            if (count < 2) return;
            
            const comboText = k.add([
                k.text(`${count}x COMBO!`, {
                    size: 48,
                    font: "sans-serif"
                }),
                k.pos(x, y - 100),
                k.anchor("center"),
                k.color(255, 215, 0),
                k.opacity(1),
                k.scale(0.5),
                k.z(150),
                k.lifespan(1, { fade: 0.5 })
            ]);

            k.tween(0.5, 1.2, 0.3, (val) => {
                comboText.scale = k.vec2(val, val);
            }, k.easings.easeOutBack);
        }

        function showAchievement(text, icon) {
            const achievement = k.add([
                k.rect(400, 80, { radius: 8 }),
                k.pos(k.width() / 2, -100),
                k.anchor("center"),
                k.color(40, 40, 60),
                k.outline(2, k.rgb(255, 215, 0)),
                k.opacity(0),
                k.z(200)
            ]);

            k.add([
                k.text(icon, { size: 40 }),
                k.pos(k.width() / 2 - 150, -100),
                k.anchor("center"),
                k.z(201)
            ]);

            const achText = k.add([
                k.text(text, { size: 20 }),
                k.pos(k.width() / 2, -100),
                k.anchor("center"),
                k.color(255, 255, 255),
                k.z(201)
            ]);

            k.tween(-100, 80, 0.5, (val) => {
                achievement.pos.y = val;
                achText.pos.y = val;
                achievement.opacity = 1;
            }, k.easings.easeOutBack);

            k.wait(3, () => {
                k.tween(80, -100, 0.5, (val) => {
                    achievement.pos.y = val;
                    achText.pos.y = val;
                    achievement.opacity = 0;
                }, k.easings.easeInBack).then(() => {
                    k.destroy(achievement);
                    k.destroy(achText);
                });
            });
        }

        function createFirework(x, y) {
            const colors = [
                [255, 100, 100],
                [100, 255, 100],
                [100, 100, 255],
                [255, 255, 100],
                [255, 100, 255]
            ];
            
            const color = k.choose(colors);
            
            for (let i = 0; i < 30; i++) {
                const angle = (360 / 30) * i;
                const speed = k.rand(3, 8);
                
                const particle = k.add([
                    k.circle(k.rand(3, 6)),
                    k.pos(x, y),
                    k.color(color[0], color[1], color[2]),
                    k.opacity(1),
                    k.z(150),
                    k.lifespan(1.5, { fade: 0.8 }),
                    {
                        velocity: k.Vec2.fromAngle(angle).scale(speed),
                        gravity: 0.2
                    }
                ]);

                particle.onUpdate(() => {
                    particle.pos = particle.pos.add(particle.velocity);
                    particle.velocity.y += particle.gravity;
                });
            }
        }

        function celebrateMilestone(milestone) {
            const messages = {
                25: { text: "Great Start! 🚀", color: [100, 200, 255] },
                50: { text: "Halfway There! 💪", color: [255, 200, 100] },
                75: { text: "Almost There! ⭐", color: [255, 150, 200] },
                100: { text: "SERIES A SECURED! 🎉", color: [255, 215, 0] }
            };

            const msg = messages[milestone];
            if (!msg) return;

            const announcement = k.add([
                k.text(msg.text, { size: 64 }),
                k.pos(k.width() / 2, k.height() / 2),
                k.anchor("center"),
                k.color(msg.color[0], msg.color[1], msg.color[2]),
                k.opacity(0),
                k.scale(0.5),
                k.z(200)
            ]);

            k.tween(0, 1, 0.3, (val) => {
                announcement.opacity = val;
                announcement.scale = k.vec2(val * 1.5, val * 1.5);
            }, k.easings.easeOutBack);

            k.wait(1.5, () => {
                k.tween(1, 0, 0.5, (val) => {
                    announcement.opacity = val;
                    announcement.scale = k.vec2(val * 1.5, val * 1.5);
                }, k.easings.easeInBack).then(() => {
                    k.destroy(announcement);
                });
            });

            // Fireworks for 100%
            if (milestone === 100) {
                for (let i = 0; i < 5; i++) {
                    k.wait(i * 0.2, () => {
                        const rx = k.rand(200, k.width() - 200);
                        const ry = k.rand(100, 300);
                        createFirework(rx, ry);
                    });
                }
            }

            // Screen shake
            k.shake(milestone === 100 ? 12 : 6);
        }

        function handleClick(character, charData, x, y) {
            // Mark as explored
            const wasNewCharacter = !exploredCharacters.has(charData.name);
            exploredCharacters.add(charData.name);

            // Achievement for first character
            if (exploredCharacters.size === 1) {
                showAchievement("First Ability Used!", "🎯");
            }

            // Achievement for meeting everyone
            if (wasNewCharacter && exploredCharacters.size === characters.length) {
                showAchievement("Met the Whole Team!", "👥");
            }

            // Show profile
            profileManager.showProfile(charData, x, y);

            // Calculate progress increase
            let progressIncrease = charData.boost;
            
            // Update progress
            const oldProgress = progress;
            progress = Math.min(100, progress + progressIncrease);
            updateProgressBar(progress);

            // Check for milestone
            const newMilestone = Math.floor(progress / 25) * 25;
            if (newMilestone > lastMilestone && newMilestone > 0) {
                celebrateMilestone(newMilestone);
                lastMilestone = newMilestone;
            }

            // Visual effects
            createFloatingText(`+${progressIncrease}%`, x, y - 40, charData.color);
            createParticleBurst(x, y, charData.color);
            createRipple(x, y, charData.color);

            // Combo system
            comboCount++;
            clearTimeout(comboTimer);
            comboTimer = setTimeout(() => comboCount = 0, 1000);
            showCombo(comboCount, x, y);

            // Show connections
            connectionManager.showConnections(charData.name);

            // Cooldown
            character.onCooldown = true;
            
            // Dim the sprite during cooldown
            const originalScale = character.baseScale;
            character.scale = k.vec2(originalScale * 0.8, originalScale * 0.8);
            character.opacity = 0.5;

            k.wait(1.5, () => {
                character.onCooldown = false;
                character.scale = k.vec2(originalScale, originalScale);
                character.opacity = 1;
            });

            // Check win condition
            if (progress >= 100 && exploredCharacters.size === characters.length) {
                k.wait(1, () => {
                    k.go("victory");
                });
            }
        }

        function createFloatingText(text, x, y, color) {
            const floatingText = k.add([
                k.text(text, {
                    size: 32,
                    font: "sans-serif"
                }),
                k.pos(x, y),
                k.anchor("center"),
                k.color(color[0], color[1], color[2]),
                k.opacity(1),
                k.z(100),
                k.lifespan(1, { fade: 0.5 }),
                {
                    velocity: k.vec2(0, -2)
                }
            ]);

            floatingText.onUpdate(() => {
                floatingText.pos = floatingText.pos.add(floatingText.velocity);
            });
        }

        function createParticleBurst(x, y, color) {
            for (let i = 0; i < 20; i++) {
                const angle = k.rand(0, 360);
                const speed = k.rand(2, 6);
                const size = k.rand(3, 8);

                const particle = k.add([
                    k.circle(size),
                    k.pos(x, y),
                    k.color(color[0], color[1], color[2]),
                    k.opacity(1),
                    k.z(50),
                    k.lifespan(0.8, { fade: 0.4 }),
                    {
                        velocity: k.Vec2.fromAngle(angle).scale(speed),
                        gravity: 0.3
                    }
                ]);

                particle.onUpdate(() => {
                    particle.pos = particle.pos.add(particle.velocity);
                    particle.velocity.y += particle.gravity;
                });
            }
        }

        function updateProgressBar(newProgress) {
            const progressBarWidth = isMobile ? k.width() - 40 : UI_CONFIG.progressBar.width;
            const targetWidth = (newProgress / 100) * progressBarWidth;  // ✅ Use responsive width

            k.tween(
                progressBar.width,
                targetWidth,
                0.5,
                (val) => progressBar.width = val,
                k.easings.easeOutQuad
            );

            k.destroyAll("progressText");
            k.destroyAll("progressShadow");

            k.add([
                k.text(`${Math.round(newProgress)}%`, { size: 24 }),
                k.pos(k.width() / 2 + 2, UI_CONFIG.progressBar.y + 2),
                k.anchor("center"),
                k.color(0, 0, 0),
                k.z(6),
                "progressShadow"
            ]);

            k.add([
                k.text(`${Math.round(newProgress)}%`, { size: 24 }),
                k.pos(k.width() / 2, UI_CONFIG.progressBar.y),
                k.anchor("center"),
                k.color(255, 255, 255),
                k.z(7),
                "progressText"
            ]);

            if (newProgress >= 100) {
                progressBar.color = k.rgb(255, 215, 0);
            } else if (newProgress >= 75) {
                progressBar.color = k.rgb(50, 255, 50);
            }
        }

        // Periodic connection pulses
        k.loop(3, () => {
            const randomChar = k.choose(characters);
            connectionManager.showConnections(randomChar.name, true);
        });

        // Update loop
        k.onUpdate(() => {
            timeElapsed += k.dt();

            k.get("character").forEach(char => {
                if (!char.onCooldown) {
                    const baseScale = char.baseScale || 0.15;
                    const hoverScale = char.isHovering() ? 1.2 : 1;
                    const breathe = k.wave(0.98, 1.02, timeElapsed * 2 + char.pos.x);
                    const finalScale = baseScale * hoverScale * breathe;
                    char.scale = k.vec2(finalScale, finalScale);
                }
            });
        });

        // Click anywhere to hide profile (but not immediately after showing)
        k.onClick(() => {
            if (!profileManager.wasJustShown() && profileManager.isProfileShowing()) {
                // Only hide if we didn't just show it
                k.wait(0.05, () => {  // Small delay to ensure profile bg click is processed first
                    if (profileManager.isProfileShowing()) {
                        profileManager.hideProfile();
                    }
                });
            }
        });

        // ============================================
        // CAMERA CONTROL SYSTEM
        // ============================================

        let cameraY = 0;
        const CAMERA_SPEED = 300;
        const MIN_CAMERA_Y = 0;
        const MAX_CAMERA_Y = isMobile ? 400 : 200;  // ✅ Double the scroll range on mobile

        // Camera movement with keyboard
        k.onUpdate(() => {
            if (k.isKeyDown("down") || k.isKeyDown("s")) {
                cameraY = Math.min(cameraY + CAMERA_SPEED * k.dt(), MAX_CAMERA_Y);
            }
            if (k.isKeyDown("up") || k.isKeyDown("w")) {
                cameraY = Math.max(cameraY - CAMERA_SPEED * k.dt(), MIN_CAMERA_Y);
            }
            
            k.camPos(k.width() / 2, k.height() / 2 + cameraY);
        });

        // ============================================
        // ON-SCREEN ARROW BUTTONS - RESPONSIVE
        // ============================================

        const buttonX = isMobile ? k.width() - 35 : k.width() - 50;
        const buttonBaseY = isMobile ? k.height() - 120 : 150;
        const buttonSize = isMobile ? 50 : 45;

        // Container background
        k.add([
            k.rect(65, 115, { radius: 8 }),
            k.pos(buttonX - 32.5, buttonBaseY - 10),
            k.color(20, 20, 40),
            k.opacity(0.9),
            k.outline(2, k.rgb(100, 100, 150)),
            k.z(200),
            k.fixed()
        ]);

        // UP BUTTON
        const upBtn = k.add([
            k.rect(buttonSize, buttonSize, { radius: 6 }),
            k.pos(buttonX, buttonBaseY),
            k.anchor("center"),
            k.color(50, 50, 80),
            k.outline(2, k.rgb(100, 150, 255)),
            k.area(),
            k.z(201),
            k.fixed(),
            "panBtn"
        ]);

        k.add([
            k.text("▲", { size: isMobile ? 28 : 24 }),
            k.pos(buttonX, buttonBaseY),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(202),
            k.fixed()
        ]);

        // DOWN BUTTON
        const downBtn = k.add([
            k.rect(buttonSize, buttonSize, { radius: 6 }),
            k.pos(buttonX, buttonBaseY + 55),
            k.anchor("center"),
            k.color(50, 50, 80),
            k.outline(2, k.rgb(100, 150, 255)),
            k.area(),
            k.z(201),
            k.fixed(),
            "panBtn"
        ]);

        k.add([
            k.text("▼", { size: isMobile ? 28 : 24 }),
            k.pos(buttonX, buttonBaseY + 55),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(202),
            k.fixed()
        ]);

        // Button hover effects
        upBtn.onHoverUpdate(() => {
            upBtn.color = k.rgb(70, 70, 100);
            k.setCursor("pointer");
        });

        upBtn.onHoverEnd(() => {
            upBtn.color = k.rgb(50, 50, 80);
            k.setCursor("default");
        });

        downBtn.onHoverUpdate(() => {
            downBtn.color = k.rgb(70, 70, 100);
            k.setCursor("pointer");
        });

        downBtn.onHoverEnd(() => {
            downBtn.color = k.rgb(50, 50, 80);
            k.setCursor("default");
        });

        // Click handlers with smooth pan
        upBtn.onClick(() => {
            const targetY = Math.max(cameraY - 120, MIN_CAMERA_Y);
            k.tween(cameraY, targetY, 0.3, (val) => {
                cameraY = val;
            }, k.easings.easeOutQuad);
            
            upBtn.color = k.rgb(100, 150, 255);
            k.wait(0.1, () => upBtn.color = k.rgb(50, 50, 80));
        });

        downBtn.onClick(() => {
            const targetY = Math.min(cameraY + 120, MAX_CAMERA_Y);
            k.tween(cameraY, targetY, 0.3, (val) => {
                cameraY = val;
            }, k.easings.easeOutQuad);
            
            downBtn.color = k.rgb(100, 150, 255);
            k.wait(0.1, () => downBtn.color = k.rgb(50, 50, 80));
        });

        // Subtle pulse animation
        upBtn.onUpdate(() => {
            const pulse = k.wave(0.95, 1, k.time() * 2);
            upBtn.scale = k.vec2(pulse, pulse);
        });

        downBtn.onUpdate(() => {
            const pulse = k.wave(0.95, 1, k.time() * 2 + Math.PI);
            downBtn.scale = k.vec2(pulse, pulse);
        });

        // Update instruction text (replace the section at the bottom of createMainScene)
        k.destroyAll("instructions"); // Remove old instructions if any

        // Instructions - positioned in layout between progress bar and sprites
        const instructionText = isMobile 
            ? "Tap members! Use ⬆⬇ to pan" 
            : "Click team members to use abilities! Use ↑↓ arrows or buttons to pan";

        k.add([
            k.text(instructionText, {
                size: isMobile ? 12 : 14,
                align: "center",
                width: isMobile ? k.width() - 40 : k.width() - 100
            }),
            k.pos(k.width() / 2, 180),
            k.anchor("center"),
            k.color(180, 180, 200),
            k.z(10),
            "instructions"
        ]);
    };
}