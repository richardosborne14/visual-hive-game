// Profile display system

export class ProfileManager {
    constructor() {
        this.currentProfile = null;
        this.profileDisplay = null;
    }

    // Show character profile
    showProfile(char, add, width, height, text, pos, anchor, color, rect, outline, z) {
        // Hide existing profile if any
        if (this.profileDisplay) {
            this.hideProfile();
        }

        this.currentProfile = char;
        const profile = char.profile;
        
        // Create profile background
        const profileBg = add([
            rect(350, 260),
            pos(width() / 2 - 175, height() / 2 - 130),
            color(30, 30, 50),
            outline(2, [char.color[0], char.color[1], char.color[2]]),
            z(100),
        ]);

        // Profile header
        const headerText = add([
            text(`${char.name} - ${char.role}`, { size: 20 }),
            pos(width() / 2, height() / 2 - 110),
            anchor("center"),
            color(char.color[0], char.color[1], char.color[2]),
            z(101),
        ]);

        // Profile content
        const funFactText = add([
            text(`Fun Fact: ${profile.funFact}`, { size: 12, width: 320 }),
            pos(width() / 2 - 160, height() / 2 - 80),
            color(200, 200, 200),
            z(101),
        ]);

        const superpowerText = add([
            text(`Superpower: ${profile.superpower}`, { size: 12, width: 320 }),
            pos(width() / 2 - 160, height() / 2 - 50),
            color(255, 215, 0),
            z(101),
        ]);

        const quoteText = add([
            text(`"${profile.quote}"`, { size: 12, width: 320 }),
            pos(width() / 2 - 160, height() / 2 - 20),
            color(150, 255, 150),
            z(101),
        ]);

        const hobbyText = add([
            text(`Hobby: ${profile.hobby}`, { size: 12, width: 320 }),
            pos(width() / 2 - 160, height() / 2 + 10),
            color(180, 180, 255),
            z(101),
        ]);

        const boostText = add([
            text(`Series A Boost: ${char.boost}%`, { size: 14 }),
            pos(width() / 2, height() / 2 + 40),
            anchor("center"),
            color(100, 255, 100),
            z(101),
        ]);

        const closeText = add([
            text("Click anywhere to close", { size: 10 }),
            pos(width() / 2, height() / 2 + 70),
            anchor("center"),
            color(150, 150, 150),
            z(101),
        ]);

        this.profileDisplay = [
            profileBg, headerText, funFactText, 
            superpowerText, quoteText, hobbyText, 
            boostText, closeText
        ];
    }

    // Hide profile
    hideProfile() {
        if (this.profileDisplay) {
            this.profileDisplay.forEach(element => element.destroy());
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