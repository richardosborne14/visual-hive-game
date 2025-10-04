// js/ui/profile.js - Fixed to match actual character data structure

export class ProfileManager {
    constructor(k) {
        this.k = k;
        this.currentProfile = null;
        this.profileDisplay = null;
    }

    // Show character profile
    showProfile(char, x, y) {
        // Hide existing profile if any
        if (this.profileDisplay) {
            this.hideProfile();
        }

        this.currentProfile = char;
        
        // Create profile background with rounded corners
        const profileBg = this.k.add([
            this.k.rect(400, 300, { radius: 8 }),
            this.k.pos(this.k.width() / 2 - 200, this.k.height() / 2 - 150),
            this.k.color(30, 30, 50),
            this.k.outline(3, this.k.rgb(char.color[0], char.color[1], char.color[2])),
            this.k.z(100),
        ]);

        // Profile header
        const headerText = this.k.add([
            this.k.text(`${char.emoji} ${char.name} - ${char.role}`, { size: 24 }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 - 120),
            this.k.anchor("center"),
            this.k.color(char.color[0], char.color[1], char.color[2]),
            this.k.z(101),
        ]);

        // Superpower (main ability)
        const superpowerText = this.k.add([
            this.k.text(`⚡ ${char.profile.superpower}`, { size: 13, width: 360 }),
            this.k.pos(this.k.width() / 2 - 180, this.k.height() / 2 - 85),
            this.k.color(255, 215, 0),
            this.k.z(101),
        ]);

        // Quote
        const quoteText = this.k.add([
            this.k.text(`"${char.profile.quote}"`, { size: 12, width: 360 }),
            this.k.pos(this.k.width() / 2 - 180, this.k.height() / 2 - 45),
            this.k.color(150, 255, 150),
            this.k.z(101),
        ]);

        // Fun fact
        const funFactText = this.k.add([
            this.k.text(`💡 ${char.profile.funFact}`, { size: 12, width: 360 }),
            this.k.pos(this.k.width() / 2 - 180, this.k.height() / 2 - 5),
            this.k.color(200, 200, 220),
            this.k.z(101),
        ]);

        // Hobby
        const hobbyText = this.k.add([
            this.k.text(`🎯 Hobby: ${char.profile.hobby}`, { size: 12, width: 360 }),
            this.k.pos(this.k.width() / 2 - 180, this.k.height() / 2 + 35),
            this.k.color(180, 180, 255),
            this.k.z(101),
        ]);

        // Series A boost (the important metric!)
        const boostText = this.k.add([
            this.k.text(`🚀 Series A Boost: +${char.boost}%`, { size: 16 }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 + 75),
            this.k.anchor("center"),
            this.k.color(100, 255, 100),
            this.k.z(101),
        ]);

        // Close instruction
        const closeText = this.k.add([
            this.k.text("Click anywhere to close", { size: 10 }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 + 110),
            this.k.anchor("center"),
            this.k.color(150, 150, 150),
            this.k.z(101),
        ]);

        // Store all elements
        this.profileDisplay = [
            profileBg, 
            headerText, 
            superpowerText, 
            quoteText, 
            funFactText, 
            hobbyText, 
            boostText, 
            closeText
        ];
    }

    // Hide profile
    hideProfile() {
        if (this.profileDisplay) {
            this.profileDisplay.forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                }
            });
            this.profileDisplay = null;
            this.currentProfile = null;
        }
    }

    // Check if profile is showing
    isProfileShowing() {
        return this.currentProfile !== null;
    }

    // Get current profile character
    getCurrentProfile() {
        return this.currentProfile;
    }
}