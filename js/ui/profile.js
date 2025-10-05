// js/ui/profile.js - Responsive with clear labels

export class ProfileManager {
    constructor(k) {
        this.k = k;
        this.currentProfile = null;
        this.profileDisplay = null;
        this.justShown = false;
    }

    // Show character profile
    showProfile(char, x, y) {
        // Hide existing profile if any
        if (this.profileDisplay) {
            this.hideProfile();
        }

        this.currentProfile = char;
        this.justShown = true;
        
        // Reset flag after a short delay
        this.k.wait(0.1, () => {
            this.justShown = false;
        });
        
        // Responsive sizing
        const isMobile = this.k.width() < 600;
        const popupWidth = isMobile ? this.k.width() - 40 : 420;
        const textWidth = popupWidth - 40;
        const fontSize = isMobile ? 11 : 12;
        const labelSize = isMobile ? 12 : 13;
        const headerSize = isMobile ? 18 : 24;
        
        // Create profile background with rounded corners
        const profileBg = this.k.add([
            this.k.rect(popupWidth, 340, { radius: 8 }),
            this.k.pos(this.k.width() / 2 - popupWidth / 2, this.k.height() / 2 - 170),
            this.k.color(30, 30, 50),
            this.k.outline(3, this.k.rgb(char.color[0], char.color[1], char.color[2])),
            this.k.area(),  // ✅ Add area component to catch clicks
            this.k.z(100),
        ]);

        // Prevent click-through by stopping propagation
        profileBg.onClick((e) => {
            // Don't close profile when clicking ON the popup itself
            // Click handler in mainScene.js will handle clicks OUTSIDE the popup
            if (e) e.cancel?.();  // Stop event propagation if available
        });

        // Profile header
        const headerText = this.k.add([
            this.k.text(`${char.emoji} ${char.name} - ${char.role}`, { 
                size: headerSize,
                width: textWidth 
            }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 - 135),
            this.k.anchor("center"),
            this.k.color(char.color[0], char.color[1], char.color[2]),
            this.k.z(101),
        ]);

        // Superpower section
        const superpowerLabel = this.k.add([
            this.k.text("⚡ Superpower:", { size: labelSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 - 95),
            this.k.color(255, 215, 0),
            this.k.z(101),
        ]);

        const superpowerText = this.k.add([
            this.k.text(char.profile.superpower, { size: fontSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 - 75),
            this.k.color(200, 200, 220),
            this.k.z(101),
        ]);

        // Quote section
        const quoteLabel = this.k.add([
            this.k.text("💬 Signature Quote:", { size: labelSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 - 40),
            this.k.color(150, 255, 150),
            this.k.z(101),
        ]);

        const quoteText = this.k.add([
            this.k.text(`"${char.profile.quote}"`, { size: fontSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 - 20),
            this.k.color(200, 200, 220),
            this.k.z(101),
        ]);

        // Fun fact section
        const funFactLabel = this.k.add([
            this.k.text("💡 Fun Fact:", { size: labelSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 + 15),
            this.k.color(255, 180, 100),
            this.k.z(101),
        ]);

        const funFactText = this.k.add([
            this.k.text(char.profile.funFact, { size: fontSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 + 35),
            this.k.color(200, 200, 220),
            this.k.z(101),
        ]);

        // Hobby section
        const hobbyLabel = this.k.add([
            this.k.text("🎯 Hobbies:", { size: labelSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 + 70),
            this.k.color(180, 180, 255),
            this.k.z(101),
        ]);

        const hobbyText = this.k.add([
            this.k.text(char.profile.hobby, { size: fontSize, width: textWidth }),
            this.k.pos(this.k.width() / 2 - (popupWidth / 2 - 20), this.k.height() / 2 + 90),
            this.k.color(200, 200, 220),
            this.k.z(101),
        ]);

        // Series A boost
        const boostText = this.k.add([
            this.k.text(`🚀 Series A Boost: +${char.boost}%`, { size: isMobile ? 14 : 16 }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 + 125),
            this.k.anchor("center"),
            this.k.color(100, 255, 100),
            this.k.z(101),
        ]);

        // Close instruction
        const closeText = this.k.add([
            this.k.text("Click anywhere to close", { size: 10 }),
            this.k.pos(this.k.width() / 2, this.k.height() / 2 + 155),
            this.k.anchor("center"),
            this.k.color(150, 150, 150),
            this.k.z(101),
        ]);

        // Store all elements
        this.profileDisplay = [
            profileBg, 
            headerText, 
            superpowerLabel,
            superpowerText, 
            quoteLabel,
            quoteText, 
            funFactLabel,
            funFactText, 
            hobbyLabel,
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

    // Check if profile was just shown
    wasJustShown() {
        return this.justShown;
    }

    // Get current profile character
    getCurrentProfile() {
        return this.currentProfile;
    }
}