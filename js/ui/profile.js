// js/ui/profile.js - FIXED SCREEN SPACE VERSION

export class ProfileManager {
    constructor(k) {
        this.k = k;
        this.currentProfile = null;
        this.profileDisplay = null;
        this.justShown = false;
    }

    showProfile(char, x, y) {
        if (this.profileDisplay) {
            this.hideProfile();
        }

        this.currentProfile = char;
        this.justShown = true;
        
        this.k.wait(0.1, () => {
            this.justShown = false;
        });

        // ✅ RESPONSIVE DIMENSIONS
        const screenWidth = this.k.width();
        const screenHeight = this.k.height();
        const isMobile = screenWidth < 600;
        
        const profileWidth = isMobile ? screenWidth - 40 : Math.min(420, screenWidth - 60);
        const textWidth = profileWidth - 40;
        const padding = 20;
        
        const fontSize = {
            header: 24,
            label: 13,
            text: 12,
            boost: 16,
            close: 10
        };

        const lineHeight = {
            header: fontSize.header + 20,
            section: fontSize.label + 8,
            text: fontSize.text * 1.5,
            boost: fontSize.boost + 10,
            close: fontSize.close + 10
        };
        
        // ✅ CALCULATE CONTENT HEIGHT DYNAMICALLY
        let contentHeight = padding;
        contentHeight += lineHeight.header;
        
        const sections = [
            char.profile.superpower,
            char.profile.quote,
            char.profile.funFact,
            char.profile.hobby
        ];
        
        sections.forEach(text => {
            contentHeight += lineHeight.section;
            const estimatedLines = Math.ceil(text.length / (textWidth / (fontSize.text * 0.6)));
            contentHeight += estimatedLines * lineHeight.text;
            contentHeight += 15;
        });
        
        contentHeight += lineHeight.boost;
        contentHeight += lineHeight.close;
        contentHeight += padding;
        
        const maxHeight = screenHeight - 80;
        const profileHeight = Math.min(contentHeight, maxHeight);
        
        // ✅ FIXED: Profile background with k.fixed() for screen space
        const profileBg = this.k.add([
            this.k.rect(profileWidth, profileHeight, { radius: 8 }),
            this.k.pos(screenWidth / 2, screenHeight / 2),
            this.k.anchor("center"),
            this.k.color(30, 30, 50),
            this.k.outline(3, this.k.rgb(char.color[0], char.color[1], char.color[2])),
            this.k.area(),
            this.k.z(100),
            this.k.fixed(),  // ✅ ADDED: Stay in screen space!
            "profileBg"
        ]);

        profileBg.onClick(() => {
            // Consume click to prevent click-through
        });

        const contentStartY = screenHeight / 2 - profileHeight / 2 + padding;
        let currentY = contentStartY;

        // ✅ FIXED: Profile header with k.fixed()
        const headerText = this.k.add([
            this.k.text(`${char.emoji} ${char.name} - ${char.role}`, { 
                size: fontSize.header,
                width: textWidth
            }),
            this.k.pos(screenWidth / 2, currentY),
            this.k.anchor("center"),
            this.k.color(char.color[0], char.color[1], char.color[2]),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.header;

        // ✅ FIXED: Superpower section with k.fixed()
        const superpowerLabel = this.k.add([
            this.k.text("⚡ Superpower:", { size: fontSize.label }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(255, 215, 0),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.section;

        const superpowerText = this.k.add([
            this.k.text(char.profile.superpower, { size: fontSize.text, width: textWidth }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(200, 200, 220),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += superpowerText.height + 15;

        // ✅ FIXED: Quote section with k.fixed()
        const quoteLabel = this.k.add([
            this.k.text("💬 Signature Quote:", { size: fontSize.label }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(150, 255, 150),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.section;

        const quoteText = this.k.add([
            this.k.text(`"${char.profile.quote}"`, { size: fontSize.text, width: textWidth }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(200, 200, 220),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += quoteText.height + 15;

        // ✅ FIXED: Fun fact section with k.fixed()
        const funFactLabel = this.k.add([
            this.k.text("💡 Fun Fact:", { size: fontSize.label }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(255, 180, 100),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.section;

        const funFactText = this.k.add([
            this.k.text(char.profile.funFact, { size: fontSize.text, width: textWidth }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(200, 200, 220),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += funFactText.height + 15;

        // ✅ FIXED: Hobby section with k.fixed()
        const hobbyLabel = this.k.add([
            this.k.text("🎯 Hobbies:", { size: fontSize.label }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(180, 180, 255),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.section;

        const hobbyText = this.k.add([
            this.k.text(char.profile.hobby, { size: fontSize.text, width: textWidth }),
            this.k.pos(screenWidth / 2 - textWidth / 2, currentY),
            this.k.color(200, 200, 220),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += hobbyText.height + 15;

        // ✅ FIXED: Series A boost with k.fixed()
        const boostText = this.k.add([
            this.k.text(`🚀 Series A Boost: +${char.boost}%`, { size: fontSize.boost }),
            this.k.pos(screenWidth / 2, currentY),
            this.k.anchor("center"),
            this.k.color(100, 255, 100),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);
        currentY += lineHeight.boost;

        // ✅ FIXED: Close instruction with k.fixed()
        const closeText = this.k.add([
            this.k.text("Click anywhere to close", { size: fontSize.close }),
            this.k.pos(screenWidth / 2, currentY),
            this.k.anchor("center"),
            this.k.color(150, 150, 150),
            this.k.z(101),
            this.k.fixed()  // ✅ ADDED
        ]);

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

    isProfileShowing() {
        return this.currentProfile !== null;
    }

    wasJustShown() {
        return this.justShown;
    }

    getCurrentProfile() {
        return this.currentProfile;
    }
}