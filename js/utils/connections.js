// js/utils/connections.js - Fixed to work with mainScene.js

export class ConnectionManager {
    constructor(k, characterObjects) {
        this.k = k;
        this.characterObjects = characterObjects;
        this.activeLines = [];
    }

    // Show connections for a character
    showConnections(characterName, subtle = false) {
        // Clear existing connection lines
        this.clearConnections();

        // Find the character object
        const sourceChar = this.characterObjects.find(
            obj => obj.characterData?.name === characterName
        );
        
        if (!sourceChar || !sourceChar.characterData.connections) return;

        const opacity = subtle ? 0.3 : 0.8;

        // Draw connections to connected characters
        sourceChar.characterData.connections.forEach(connectedName => {
            const targetChar = this.characterObjects.find(
                obj => obj.characterData?.name === connectedName
            );

            if (targetChar) {
                this.drawConnection(
                    sourceChar,
                    targetChar,
                    opacity
                );
            }
        });

        // Auto-clear after delay
        this.k.wait(subtle ? 1.5 : 2, () => {
            this.clearConnections();
        });
    }

    // Draw a single connection line
    drawConnection(char1, char2, opacity) {
        const color = this.getConnectionColor(char1.characterData, char2.characterData);
        
        // Create animated connection line
        const line = this.k.add([
            this.k.pos(0, 0),
            this.k.z(0),
            "connectionLine",
            {
                char1Pos: char1.pos,
                char2Pos: char2.pos,
                baseColor: color,
                baseOpacity: opacity,
                timeOffset: this.k.rand(0, Math.PI * 2)
            }
        ]);

        // Custom draw for the line
        line.onDraw(() => {
            const pulse = (Math.sin(this.k.time() * 3 + line.timeOffset) + 1) / 2;
            const shimmer = (Math.sin(this.k.time() * 5 + line.char1Pos.x) + 1) / 2;
            
            // Outer glow
            this.k.drawLine({
                p1: line.char1Pos,
                p2: line.char2Pos,
                width: 8,
                color: this.k.rgb(color[0], color[1], color[2]),
                opacity: line.baseOpacity * 0.15 * pulse
            });
            
            // Middle glow
            this.k.drawLine({
                p1: line.char1Pos,
                p2: line.char2Pos,
                width: 4,
                color: this.k.rgb(color[0], color[1], color[2]),
                opacity: line.baseOpacity * 0.3 * shimmer
            });
            
            // Core line
            this.k.drawLine({
                p1: line.char1Pos,
                p2: line.char2Pos,
                width: 2,
                color: this.k.rgb(
                    Math.min(color[0] + 50, 255),
                    Math.min(color[1] + 50, 255),
                    Math.min(color[2] + 50, 255)
                ),
                opacity: line.baseOpacity * (0.7 + shimmer * 0.3)
            });
        });

        this.activeLines.push(line);
    }

    // Get connection color based on relationship
    getConnectionColor(char1, char2) {
        // Leadership triangle (Bogdan, Petrica, Kunal)
        if ((char1.name === "Bogdan" && char2.name === "Petrica") || 
            (char1.name === "Petrica" && char2.name === "Bogdan") ||
            (char1.name === "Bogdan" && char2.name === "Kunal") ||
            (char1.name === "Kunal" && char2.name === "Bogdan") ||
            (char1.name === "Petrica" && char2.name === "Kunal") ||
            (char1.name === "Kunal" && char2.name === "Petrica")) {
            return [255, 215, 0]; // Golden
        }
        
        // Richard's tech connections
        if (char1.name === "Richard" || char2.name === "Richard") {
            return [100, 150, 255]; // Blue
        }
        
        // Mentorship (Arianne with Richard/Dishant)
        if ((char1.name === "Arianne" && (char2.name === "Richard" || char2.name === "Dishant")) ||
            (char2.name === "Arianne" && (char1.name === "Richard" || char1.name === "Dishant"))) {
            return [150, 255, 150]; // Green
        }
        
        // Cross-functional (Caroline-Maksym)
        if ((char1.name === "Caroline" && char2.name === "Maksym") || 
            (char1.name === "Maksym" && char2.name === "Caroline")) {
            return [180, 100, 200]; // Purple
        }
        
        // DevOps connections (Kateryna-Maksym)
        if ((char1.name === "Kateryna" && char2.name === "Maksym") ||
            (char1.name === "Maksym" && char2.name === "Kateryna")) {
            return [255, 100, 150]; // Pink/Red
        }
        
        return [150, 150, 200]; // Default blue-grey
    }

    // Clear all connection lines
    clearConnections() {
        this.activeLines.forEach(line => {
            if (line.exists) {
                this.k.destroy(line);
            }
        });
        this.activeLines = [];
    }
}