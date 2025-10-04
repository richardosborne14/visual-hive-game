// Connection lines system for Visual Hive game

export class ConnectionManager {
    constructor() {
        this.connections = [];
        this.activeConnections = new Set();
    }

    // Get connection color based on relationship
    getConnectionColor(char1, char2) {
        // Leadership triangle
        if ((char1.name === "Bogdan" && char2.name === "Petrica") || 
            (char1.name === "Petrica" && char2.name === "Kunal") ||
            (char1.name === "Bogdan" && char2.name === "Kunal")) {
            return [255, 215, 0]; // Golden
        }
        
        // Richard's tech connections
        if (char1.name === "Richard" || char2.name === "Richard") {
            return [100, 150, 255]; // Blue
        }
        
        // Mentorship connections
        if ((char1.name === "Arianne" && (char2.name === "Richard" || char2.name === "Dishant")) ||
            (char2.name === "Arianne" && (char1.name === "Richard" || char1.name === "Dishant"))) {
            return [150, 255, 150]; // Green
        }
        
        // Cross-functional
        if ((char1.name === "Caroline" && char2.name === "Maksym") || 
            (char1.name === "Maksym" && char2.name === "Caroline")) {
            return [180, 100, 200]; // Purple
        }
        
        return [150, 150, 200]; // Default
    }

    // Add a connection
    addConnection(char1, char2, opacity = 1) {
        const connectionKey = [char1.name, char2.name].sort().join('-');
        
        if (this.activeConnections.has(connectionKey)) {
            return;
        }
        
        const color = this.getConnectionColor(char1, char2);
        this.connections.push({
            x1: char1.pos[0],
            y1: char1.pos[1],
            x2: char2.pos[0],
            y2: char2.pos[1],
            color: color,
            opacity: opacity,
            key: connectionKey
        });
        
        this.activeConnections.add(connectionKey);
    }

    // Show character connections
    showCharacterConnections(characterName, characterMap, opacity = 1) {
        const char = characterMap[characterName];
        if (!char || !char.connections) return;
        
        char.connections.forEach(connectedName => {
            const connectedChar = characterMap[connectedName];
            if (connectedChar) {
                this.addConnection(char, connectedChar, opacity);
            }
        });
    }

    // Clear all connections
    clearConnections() {
        this.connections = [];
        this.activeConnections.clear();
    }

    // Trigger ripple effect
    triggerConnectionRipple(characterName, characterMap, wait) {
        this.clearConnections();
        this.showCharacterConnections(characterName, characterMap, 0.9);
        
        wait(0.2, () => {
            const char = characterMap[characterName];
            if (char && char.connections) {
                char.connections.forEach(connectedName => {
                    this.showCharacterConnections(connectedName, characterMap, 0.5);
                });
            }
        });
        
        wait(2, () => {
            this.clearConnections();
        });
    }

    // Draw all connections (call this in onDraw)
    drawConnections(drawLine, vec2, rgb, time) {
        this.connections.forEach(conn => {
            // Calculate effects
            const pulse = (Math.sin(time() * 3) + 1) / 2;
            const shimmer = (Math.sin(time() * 5 + conn.x1 + conn.y1) + 1) / 2;
            
            // Outer glow (widest, most transparent)
            drawLine({
                p1: vec2(conn.x1, conn.y1),
                p2: vec2(conn.x2, conn.y2),
                width: 8,
                color: rgb(conn.color[0], conn.color[1], conn.color[2]),
                opacity: conn.opacity * 0.15 * pulse
            });
            
            // Middle glow
            drawLine({
                p1: vec2(conn.x1, conn.y1),
                p2: vec2(conn.x2, conn.y2),
                width: 4,
                color: rgb(conn.color[0], conn.color[1], conn.color[2]),
                opacity: conn.opacity * 0.3 * shimmer
            });
            
            // Core line (bright)
            drawLine({
                p1: vec2(conn.x1, conn.y1),
                p2: vec2(conn.x2, conn.y2),
                width: 2,
                color: rgb(
                    Math.min(conn.color[0] + 50, 255),
                    Math.min(conn.color[1] + 50, 255),
                    Math.min(conn.color[2] + 50, 255)
                ),
                opacity: conn.opacity * (0.7 + shimmer * 0.3)
            });
        });
    }
}