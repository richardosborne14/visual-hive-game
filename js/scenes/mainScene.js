// js/scenes/mainScene.js - CLEAN RESPONSIVE VERSION
import { GAME_CONFIG, UI_CONFIG, CHARACTER_CONFIG } from '../config.js';
import { characters } from '../data/characters.js';
import { ConnectionManager } from '../utils/connections.js';
import { ProfileManager } from '../ui/profile.js';

export function createMainScene(k) {
    return () => {
        // ============================================
        // RESPONSIVE CONFIGURATION
        // ============================================
        
        const screenWidth = k.width();
        const screenHeight = k.height();
        
        // Determine device type based on Kaboom canvas width
        const isMobile = screenWidth < 600;
        const isTablet = screenWidth >= 600 && screenWidth < 1024;
        const isDesktop = screenWidth >= 1024;

        // Responsive settings
        const responsive = {
            // Sprite scaling
            spriteScale: isMobile ? 0.12 : isTablet ? 0.14 : 0.15,
            
            // Layout
            titleSize: isMobile ? 20 : isTablet ? 32 : 48,
            titleY: isMobile ? 25 : isTablet ? 35 : 50,
            progressBarY: isMobile ? 70 : isTablet ? 90 : 120,
            progressBarWidth: isMobile ? screenWidth - 40 : Math.min(400, screenWidth - 100),
            instructionY: isMobile ? 140 : isTablet ? 170 : 180,
            instructionSize: isMobile ? 11 : 14,
            
            // Character layout
            startY: isMobile ? 180 : isTablet ? 220 : 250,
            rowSpacing: isMobile ? 130 : isTablet ? 160 : 200,
            colSpacing: isMobile ? 140 : isTablet ? 180 : 200,
            
            // Labels
            labelOffsetY: isMobile ? 60 : 75,
            roleOffsetY: isMobile ? 75 : 95,
            nameSize: isMobile ? 13 : 16,
            roleSize: isMobile ? 10 : 12,
            emojiSize: isMobile ? 22 : 28,
            emojiOffsetX: isMobile ? 28 : 35,
            emojiOffsetY: isMobile ? 28 : 35,
            
            // Camera
            maxCameraY: isMobile ? 500 : isTablet ? 300 : 200,
            
            // Buttons
            buttonX: isMobile ? screenWidth - 35 : screenWidth - 50,
            buttonY: isMobile ? screenHeight - 120 : 150,
            buttonSize: isMobile ? 50 : 45
        };

        // Character rows based on device
        const getCharacterRows = () => {
            if (isMobile) {
                return [
                    characters.slice(0, 2),   // 2
                    characters.slice(2, 4),   // 2
                    characters.slice(4, 6),   // 2
                    characters.slice(6, 8),   // 2
                    characters.slice(8, 10),  // 2
                    characters.slice(10, 11)  // 1
                ];
            } else if (isTablet) {
                return [
                    characters.slice(0, 3),   // 3
                    characters.slice(3, 6),   // 3
                    characters.slice(6, 9),   // 3
                    characters.slice(9, 11)   // 2
                ];
            } else {
                return [
                    characters.slice(0, 3),   // 3
                    characters.slice(3, 7),   // 4
                    characters.slice(7, 11)   // 4
                ];
            }
        };

        // ============================================
        // GAME STATE
        // ============================================
        
        let progress = 0;
        let exploredCharacters = new Set();
        let connectionManager = null;
        let profileManager = null;
        let timeElapsed = 0;
        let comboCount = 0;
        let comboTimer = null;
        let lastMilestone = 0;

        // ============================================
        // BACKGROUND & ATMOSPHERE
        // ============================================
        
        k.add([
            k.rect(screenWidth, screenHeight),
            k.color(20, 20, 40),
            k.pos(0, 0),
            k.z(-100)
        ]);

        // Animated stars
        for (let i = 0; i < 50; i++) {
            const star = k.add([
                k.circle(k.rand(1, 3)),
                k.pos(k.rand(0, screenWidth), k.rand(0, screenHeight)),
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
            if (k.rand() < 0.3) {
                k.add([
                    k.circle(k.rand(2, 5)),
                    k.pos(k.mousePos()),
                    k.color(k.rand(150, 255), k.rand(150, 255), k.rand(200, 255)),
                    k.opacity(0.6),
                    k.z(-1),
                    k.lifespan(0.5, { fade: 0.3 })
                ]);
            }
        });

        // ============================================
        // UI ELEMENTS
        // ============================================
        
        // Title with pulse effect
        const title = k.add([
            k.text("Visual Hive: Quest for Series A", {
                size: responsive.titleSize,
                font: "sans-serif"
            }),
            k.pos(screenWidth / 2, responsive.titleY),
            k.anchor("center"),
            k.color(255, 215, 0),
            k.z(10)
        ]);

        title.onUpdate(() => {
            const pulse = k.wave(0.8, 1, k.time() * 2);
            title.scale = k.vec2(pulse, pulse);
        });

        // Progress bar container
        k.add([
            k.rect(responsive.progressBarWidth + 8, 38),
            k.pos(screenWidth / 2, responsive.progressBarY),
            k.anchor("center"),
            k.outline(3, k.rgb(100, 100, 150)),
            k.color(30, 30, 50),
            k.z(5)
        ]);

        // Progress bar fill
        const progressBar = k.add([
            k.rect(0, 30),
            k.pos(screenWidth / 2 - responsive.progressBarWidth / 2, responsive.progressBarY - 15),
            k.color(50, 205, 50),
            k.z(6),
            "progressBar"
        ]);

        // Progress text (shadow)
        k.add([
            k.text("0%", { size: 20 }),
            k.pos(screenWidth / 2 + 2, responsive.progressBarY + 2),
            k.anchor("center"),
            k.color(0, 0, 0),
            k.z(6),
            "progressShadow"
        ]);

        // Progress text (main)
        k.add([
            k.text("0%", { size: 20 }),
            k.pos(screenWidth / 2, responsive.progressBarY),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(7),
            "progressText"
        ]);

        // Instructions
        const instructionText = isMobile 
            ? "Tap members! Use ⬆⬇ to pan" 
            : "Click team members to use abilities! Use ↑↓ arrows or buttons to pan";

        k.add([
            k.text(instructionText, {
                size: responsive.instructionSize,
                align: "center"
            }),
            k.pos(screenWidth / 2, responsive.instructionY),
            k.anchor("center"),
            k.color(180, 180, 200),
            k.z(10)
        ]);

        // ============================================
        // CHARACTER CREATION
        // ============================================
        
        const characterObjects = [];
        const characterRows = getCharacterRows();

        characterRows.forEach((row, rowIndex) => {
            const rowWidth = row.length * responsive.colSpacing;
            const startX = (screenWidth - rowWidth) / 2 + (responsive.colSpacing / 2);

            row.forEach((char, colIndex) => {
                const x = startX + colIndex * responsive.colSpacing;
                const y = responsive.startY + rowIndex * responsive.rowSpacing;

                // Glow effect
                const glow = k.add([
                    k.circle(70),
                    k.pos(x, y),
                    k.color(char.color[0], char.color[1], char.color[2]),
                    k.opacity(0),
                    k.z(1)
                ]);

                // Character sprite
                const sprite = k.add([
                    k.sprite(char.name.toLowerCase()),
                    k.pos(x, y),
                    k.scale(responsive.spriteScale),
                    k.anchor("center"),
                    k.area(),
                    k.z(2),
                    "character",
                    {
                        characterData: char,
                        onCooldown: false,
                        glowObj: glow,
                        baseScale: responsive.spriteScale
                    }
                ]);

                // Emoji badge
                k.add([
                    k.text(char.emoji, { size: responsive.emojiSize }),
                    k.pos(x + responsive.emojiOffsetX, y - responsive.emojiOffsetY),
                    k.anchor("center"),
                    k.z(3)
                ]);

                // Name label
                k.add([
                    k.text(char.name, { size: responsive.nameSize }),
                    k.pos(x, y + responsive.labelOffsetY),
                    k.anchor("center"),
                    k.color(255, 255, 255),
                    k.z(3)
                ]);

                // Role label
                k.add([
                    k.text(char.role, { size: responsive.roleSize }),
                    k.pos(x, y + responsive.roleOffsetY),
                    k.anchor("center"),
                    k.color(180, 180, 200),
                    k.z(3)
                ]);

                characterObjects.push(sprite);

                // Click handler
                sprite.onClick(() => {
                    if (!sprite.onCooldown) {
                        handleClick(sprite, char, x, y);
                    }
                });

                // Hover effects (desktop only)
                if (isDesktop) {
                    sprite.onHoverUpdate(() => {
                        if (!sprite.onCooldown) {
                            k.setCursor("pointer");
                            glow.opacity = k.wave(0.3, 0.5, k.time() * 3);
                            sprite.scale = k.vec2(responsive.spriteScale * 1.2, responsive.spriteScale * 1.2);
                        }
                    });

                    sprite.onHoverEnd(() => {
                        k.setCursor("default");
                        if (!sprite.onCooldown) {
                            glow.opacity = 0;
                            sprite.scale = k.vec2(responsive.spriteScale, responsive.spriteScale);
                        }
                    });
                }
            });
        });

        connectionManager = new ConnectionManager(k, characterObjects);
        profileManager = new ProfileManager(k);

        // ============================================
        // VISUAL EFFECTS FUNCTIONS
        // ============================================

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
                    }, k.easings.easeOutQuad).then(() => k.destroy(ripple));
                });
            }
        }

        function createFloatingText(text, x, y, color) {
            const floatingText = k.add([
                k.text(text, { size: 32 }),
                k.pos(x, y),
                k.anchor("center"),
                k.color(color[0], color[1], color[2]),
                k.opacity(1),
                k.z(100),
                k.lifespan(1, { fade: 0.5 }),
                { velocity: k.vec2(0, -2) }
            ]);

            floatingText.onUpdate(() => {
                floatingText.pos = floatingText.pos.add(floatingText.velocity);
            });
        }

        function createParticleBurst(x, y, color) {
            for (let i = 0; i < 20; i++) {
                const angle = k.rand(0, 360);
                const speed = k.rand(2, 6);

                const particle = k.add([
                    k.circle(k.rand(3, 8)),
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

        function showCombo(count, x, y) {
            if (count < 2) return;
            
            const comboText = k.add([
                k.text(`${count}x COMBO!`, { size: 48 }),
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
            const achWidth = isMobile ? screenWidth - 40 : 400;
            
            const achievement = k.add([
                k.rect(achWidth, 80, { radius: 8 }),
                k.pos(screenWidth / 2, -100),
                k.anchor("center"),
                k.color(40, 40, 60),
                k.outline(2, k.rgb(255, 215, 0)),
                k.opacity(0),
                k.z(200)
            ]);

            const iconObj = k.add([
                k.text(icon, { size: 40 }),
                k.pos(screenWidth / 2 - achWidth / 2 + 50, -100),
                k.anchor("center"),
                k.z(201)
            ]);

            const achText = k.add([
                k.text(text, { size: isMobile ? 16 : 20 }),
                k.pos(screenWidth / 2, -100),
                k.anchor("center"),
                k.color(255, 255, 255),
                k.z(201)
            ]);

            k.tween(-100, 80, 0.5, (val) => {
                achievement.pos.y = val;
                iconObj.pos.y = val;
                achText.pos.y = val;
                achievement.opacity = 1;
            }, k.easings.easeOutBack);

            k.wait(3, () => {
                k.tween(80, -100, 0.5, (val) => {
                    achievement.pos.y = val;
                    iconObj.pos.y = val;
                    achText.pos.y = val;
                    achievement.opacity = 0;
                }, k.easings.easeInBack).then(() => {
                    k.destroy(achievement);
                    k.destroy(iconObj);
                    k.destroy(achText);
                });
            });
        }

        function createFirework(x, y) {
            const colors = [
                [255, 100, 100], [100, 255, 100], [100, 100, 255],
                [255, 255, 100], [255, 100, 255]
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
                k.text(msg.text, { size: isMobile ? 40 : 64 }),
                k.pos(screenWidth / 2, screenHeight / 2),
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
                }, k.easings.easeInBack).then(() => k.destroy(announcement));
            });

            if (milestone === 100) {
                for (let i = 0; i < 5; i++) {
                    k.wait(i * 0.2, () => {
                        createFirework(
                            k.rand(200, screenWidth - 200),
                            k.rand(100, 300)
                        );
                    });
                }
            }

            k.shake(milestone === 100 ? 12 : 6);
        }

        function updateProgressBar(newProgress) {
            const targetWidth = (newProgress / 100) * responsive.progressBarWidth;

            k.tween(progressBar.width, targetWidth, 0.5,
                (val) => progressBar.width = val,
                k.easings.easeOutQuad
            );

            k.destroyAll("progressText");
            k.destroyAll("progressShadow");

            k.add([
                k.text(`${Math.round(newProgress)}%`, { size: 20 }),
                k.pos(screenWidth / 2 + 2, responsive.progressBarY + 2),
                k.anchor("center"),
                k.color(0, 0, 0),
                k.z(6),
                "progressShadow"
            ]);

            k.add([
                k.text(`${Math.round(newProgress)}%`, { size: 20 }),
                k.pos(screenWidth / 2, responsive.progressBarY),
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

        // ============================================
        // GAME LOGIC
        // ============================================

        function handleClick(sprite, char, x, y) {
            // Track exploration
            const wasNewCharacter = !exploredCharacters.has(char.name);
            exploredCharacters.add(char.name);

            // Achievements
            if (exploredCharacters.size === 1) {
                showAchievement("First Ability Used!", "🎯");
            }
            if (wasNewCharacter && exploredCharacters.size === characters.length) {
                showAchievement("Met the Whole Team!", "👥");
            }

            // Show profile
            profileManager.showProfile(char, x, y);

            // Update progress
            progress = Math.min(100, progress + char.boost);
            updateProgressBar(progress);

            // Check milestone
            const newMilestone = Math.floor(progress / 25) * 25;
            if (newMilestone > lastMilestone && newMilestone > 0) {
                celebrateMilestone(newMilestone);
                lastMilestone = newMilestone;
            }

            // Visual effects
            createFloatingText(`+${char.boost}%`, x, y - 40, char.color);
            createParticleBurst(x, y, char.color);
            createRipple(x, y, char.color);

            // Combo system
            comboCount++;
            clearTimeout(comboTimer);
            comboTimer = setTimeout(() => comboCount = 0, 1000);
            showCombo(comboCount, x, y);

            // Show connections
            connectionManager.showConnections(char.name);

            // Cooldown
            sprite.onCooldown = true;
            sprite.scale = k.vec2(sprite.baseScale * 0.8, sprite.baseScale * 0.8);
            sprite.opacity = 0.5;

            k.wait(1.5, () => {
                sprite.onCooldown = false;
                sprite.scale = k.vec2(sprite.baseScale, sprite.baseScale);
                sprite.opacity = 1;
            });

            // Check win condition
            if (progress >= 100 && exploredCharacters.size === characters.length) {
                k.wait(1, () => k.go("victory"));
            }
        }

        // ============================================
        // CAMERA SYSTEM
        // ============================================

        let cameraY = 0;
        const CAMERA_SPEED = 300;

        k.onUpdate(() => {
            if (k.isKeyDown("down") || k.isKeyDown("s")) {
                cameraY = Math.min(cameraY + CAMERA_SPEED * k.dt(), responsive.maxCameraY);
            }
            if (k.isKeyDown("up") || k.isKeyDown("w")) {
                cameraY = Math.max(cameraY - CAMERA_SPEED * k.dt(), 0);
            }
            
            k.camPos(screenWidth / 2, screenHeight / 2 + cameraY);
        });

        // ============================================
        // PAN BUTTONS
        // ============================================

        // Container
        k.add([
            k.rect(65, 115, { radius: 8 }),
            k.pos(responsive.buttonX - 32.5, responsive.buttonY - 10),
            k.color(20, 20, 40),
            k.opacity(0.9),
            k.outline(2, k.rgb(100, 100, 150)),
            k.z(200),
            k.fixed()
        ]);

        // UP button
        const upBtn = k.add([
            k.rect(responsive.buttonSize, responsive.buttonSize, { radius: 6 }),
            k.pos(responsive.buttonX, responsive.buttonY),
            k.anchor("center"),
            k.color(50, 50, 80),
            k.outline(2, k.rgb(100, 150, 255)),
            k.area(),
            k.z(201),
            k.fixed()
        ]);

        k.add([
            k.text("▲", { size: responsive.buttonSize * 0.5 }),
            k.pos(responsive.buttonX, responsive.buttonY),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(202),
            k.fixed()
        ]);

        // DOWN button
        const downBtn = k.add([
            k.rect(responsive.buttonSize, responsive.buttonSize, { radius: 6 }),
            k.pos(responsive.buttonX, responsive.buttonY + 55),
            k.anchor("center"),
            k.color(50, 50, 80),
            k.outline(2, k.rgb(100, 150, 255)),
            k.area(),
            k.z(201),
            k.fixed()
        ]);

        k.add([
            k.text("▼", { size: responsive.buttonSize * 0.5 }),
            k.pos(responsive.buttonX, responsive.buttonY + 55),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(202),
            k.fixed()
        ]);

        // Button interactions
        upBtn.onClick(() => {
            k.tween(cameraY, Math.max(cameraY - 120, 0), 0.3,
                (val) => cameraY = val,
                k.easings.easeOutQuad
            );
            upBtn.color = k.rgb(100, 150, 255);
            k.wait(0.1, () => upBtn.color = k.rgb(50, 50, 80));
        });

        downBtn.onClick(() => {
            k.tween(cameraY, Math.min(cameraY + 120, responsive.maxCameraY), 0.3,
                (val) => cameraY = val,
                k.easings.easeOutQuad
            );
            downBtn.color = k.rgb(100, 150, 255);
            k.wait(0.1, () => downBtn.color = k.rgb(50, 50, 80));
        });

        upBtn.onUpdate(() => {
            const pulse = k.wave(0.95, 1, k.time() * 2);
            upBtn.scale = k.vec2(pulse, pulse);
        });

        downBtn.onUpdate(() => {
            const pulse = k.wave(0.95, 1, k.time() * 2 + Math.PI);
            downBtn.scale = k.vec2(pulse, pulse);
        });

        // ============================================
        // CONTINUOUS UPDATES
        // ============================================

        // Periodic connection pulses
        k.loop(3, () => {
            connectionManager.showConnections(k.choose(characters).name, true);
        });

        // Character breathing animation
        k.onUpdate(() => {
            timeElapsed += k.dt();
            
            k.get("character").forEach(char => {
                if (!char.onCooldown) {
                    const breathe = k.wave(0.98, 1.02, timeElapsed * 2 + char.pos.x);
                    const hoverScale = (isDesktop && char.isHovering()) ? 1.2 : 1;
                    const finalScale = char.baseScale * hoverScale * breathe;
                    char.scale = k.vec2(finalScale, finalScale);
                }
            });
        });

        // Click to close profile
        k.onClick(() => {
            if (!profileManager.wasJustShown() && profileManager.isProfileShowing()) {
                k.wait(0.05, () => {
                    if (profileManager.isProfileShowing()) {
                        profileManager.hideProfile();
                    }
                });
            }
        });
    };
}