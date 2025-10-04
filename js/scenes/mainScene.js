// Main game scene
import { characters, createCharacterMap } from '../data/characters.js';
import { UI_CONFIG, CHARACTER_CONFIG, CONNECTION_CONFIG } from '../config.js';
import { ConnectionManager } from '../utils/connections.js';
import { ProfileManager } from '../ui/profile.js';

export function createMainScene() {
    return () => {
        // Initialize managers
        const connectionManager = new ConnectionManager();
        const profileManager = new ProfileManager();

        // Game state
        let nextBoosted = false;
        const charObjects = [];
        let exploredCount = 0;
        const totalMembers = characters.length;
        let connectionTime = 0;

        // Create character map
        const characterMap = createCharacterMap(characters);

        // UI - Title
        add([
            text(UI_CONFIG.title.text, { size: UI_CONFIG.title.size }),
            pos(width() / 2, UI_CONFIG.title.y),
            anchor("center"),
            color(...UI_CONFIG.title.color),
        ]);

        // UI - Subtitle
        add([
            text(UI_CONFIG.subtitle.text, { size: UI_CONFIG.subtitle.size }),
            pos(width() / 2, UI_CONFIG.subtitle.y),
            anchor("center"),
            color(...UI_CONFIG.subtitle.color),
        ]);

        // UI - Progress bar background
        add([
            rect(UI_CONFIG.progressBar.width, UI_CONFIG.progressBar.height),
            pos(width() / 2 - UI_CONFIG.progressBar.width / 2, UI_CONFIG.progressBar.y),
            color(...UI_CONFIG.progressBar.bgColor),
        ]);

        // UI - Progress bar fill
        const progressBar = add([
            rect(0, 26),
            pos(width() / 2 - 198, 122),
            color(...UI_CONFIG.progressBar.fillColor),
            { progress: 0 },
        ]);

        // UI - Progress text
        const progressText = add([
            text("Series A Progress: 0%", { size: 14 }),
            pos(width() / 2, 135),
            anchor("center"),
            color(255, 255, 255),
        ]);

        // UI - Exploration counter
        const explorationText = add([
            text(`Team Members Explored: 0/${totalMembers}`, { size: UI_CONFIG.exploration.size }),
            pos(width() / 2, UI_CONFIG.exploration.y),
            anchor("center"),
            color(...UI_CONFIG.exploration.color),
        ]);

        // Draw connections
        onDraw(() => {
            connectionManager.drawConnections(drawLine, vec2, rgb, time);
        });

        // Create characters
        characters.forEach(char => {
            char.explored = false;
            
            const charCircle = add([
                circle(CHARACTER_CONFIG.circleRadius),
                pos(char.pos[0], char.pos[1]),
                anchor("center"),
                color(char.color[0], char.color[1], char.color[2]),
                area(),
                "character",
                { cooldown: false, charData: char },
            ]);

            charObjects.push(charCircle);

            // Try to add sprite
            try {
                add([
                    sprite(char.name.toLowerCase()),
                    pos(char.pos[0], char.pos[1]),
                    anchor("center"),
                    scale(CHARACTER_CONFIG.spriteScale),
                ]);
            } catch (e) {
                // Sprite not available
            }

            // Character name
            add([
                text(char.name, { size: 16 }),
                pos(char.pos[0], char.pos[1] + CHARACTER_CONFIG.labelOffsetY),
                anchor("center"),
            ]);

            // Character role
            add([
                text(char.role, { size: 12 }),
                pos(char.pos[0], char.pos[1] + CHARACTER_CONFIG.roleOffsetY),
                anchor("center"),
                color(180, 180, 180),
            ]);
        });

        // Click handler
        onMousePress(() => {
            const mPos = mousePos();
            
            if (profileManager.isProfileShowing()) {
                profileManager.hideProfile();
                return;
            }
            
            charObjects.forEach(charCircle => {
                if (charCircle.cooldown) return;
                
                const dist = charCircle.pos.dist(mPos);
                if (dist < CHARACTER_CONFIG.circleRadius) {
                    profileManager.showProfile(
                        charCircle.charData,
                        add, width, height, text, pos, anchor, color, rect, outline, z
                    );
                    handleClick(charCircle);
                }
            });
        });

        // Handle character click
        function handleClick(charCircle) {
            const char = charCircle.charData;
            let boost = char.boost;

            // Trigger connection ripple
            connectionManager.triggerConnectionRipple(char.name, characterMap, wait);

            // Track exploration
            if (!char.explored) {
                char.explored = true;
                exploredCount++;
                explorationText.text = `Team Members Explored: ${exploredCount}/${totalMembers}`;
                
                add([
                    text("✓", { size: 20 }),
                    pos(char.pos[0] + 35, char.pos[1] - 35),
                    anchor("center"),
                    color(100, 255, 100),
                ]);
            }

            // Special abilities
            if (char.name === "Arianne") {
                char.growth++;
                boost = char.boost + char.growth;
                charCircle.radius = CHARACTER_CONFIG.circleRadius + (char.growth * 2);
            }

            if (char.name === "Maksym") {
                nextBoosted = true;
            } else if (nextBoosted) {
                boost = Math.round(boost * 1.2);
                nextBoosted = false;
            }

            if (char.name === "Thong" && Math.random() > 0.5) {
                add([
                    text("Real!", { size: 14 }),
                    pos(char.pos[0], char.pos[1] + 100),
                    anchor("center"),
                    color(150, 255, 100),
                    lifespan(1.5),
                ]);
            }

            // Show boost
            add([
                text(`+${boost}%`, { size: 16 }),
                pos(char.pos[0] + 50, char.pos[1] - 50),
                anchor("center"),
                color(100, 255, 100),
                lifespan(1),
            ]);

            // Update progress
            progressBar.progress += boost;
            if (progressBar.progress > 100) progressBar.progress = 100;
            progressBar.width = (progressBar.progress / 100) * 396;
            progressText.text = `Series A Progress: ${Math.floor(progressBar.progress)}%`;

            // Win condition
            if (progressBar.progress >= 100 && exploredCount >= totalMembers) {
                wait(0.5, () => go("victory"));
            } else if (progressBar.progress >= 100 && exploredCount < totalMembers) {
                add([
                    text("Explore all team members to secure Series A!", { size: 16 }),
                    pos(width() / 2, 200),
                    anchor("center"),
                    color(255, 100, 100),
                    lifespan(3),
                ]);
            }

            // Cooldown
            charCircle.cooldown = true;
            wait(CHARACTER_CONFIG.cooldownTime, () => {
                charCircle.cooldown = false;
            });
        }

        // Update loop
        onUpdate(() => {
            connectionTime += dt();
            
            // Periodic connection pulses
            if (connectionTime > CONNECTION_CONFIG.pulseInterval && 
                connectionManager.connections.length === 0 && 
                !profileManager.isProfileShowing()) {
                connectionTime = 0;
                const randomChar = characters[Math.floor(Math.random() * characters.length)];
                connectionManager.showCharacterConnections(randomChar.name, characterMap, 0.4);
                wait(CONNECTION_CONFIG.fadeOutDelay, () => connectionManager.clearConnections());
            }
            
            // Hover effects
            const mPos = mousePos();
            charObjects.forEach(charCircle => {
                const dist = charCircle.pos.dist(mPos);
                if (dist < CHARACTER_CONFIG.circleRadius && !charCircle.cooldown) {
                    charCircle.scale = vec2(1.1, 1.1);
                    
                    if (connectionManager.connections.length === 0 && !profileManager.isProfileShowing()) {
                        const char = charCircle.charData;
                        if (char.connections && char.connections.length > 0) {
                            char.connections.forEach(connectedName => {
                                const connectedChar = characterMap[connectedName];
                                if (connectedChar) {
                                    connectionManager.addConnection(char, connectedChar, CONNECTION_CONFIG.hoverOpacity);
                                }
                            });
                        }
                    }
                } else if (!charCircle.cooldown) {
                    charCircle.scale = vec2(1, 1);
                    
                    if (connectionManager.connections.length > 0 && 
                        connectionManager.connections[0].opacity === CONNECTION_CONFIG.hoverOpacity) {
                        connectionManager.clearConnections();
                    }
                }
            });
        });

        // Footer
        add([
            text(UI_CONFIG.footer.text, { size: UI_CONFIG.footer.size }),
            pos(width() / 2, height() - 30),
            anchor("center"),
            color(...UI_CONFIG.footer.color),
        ]);
    };
}