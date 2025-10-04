// Character data for Visual Hive team
export const characters = [
    { 
        name: "Bogdan", 
        role: "CEO", 
        color: [255, 100, 100], 
        pos: [200, 220], 
        emoji: "🤝", 
        boost: 15,
        connections: ["Petrica", "Kunal", "Richard"],
        profile: {
            funFact: "Can negotiate a deal while sitting in his pyjamas on his balcony",
            superpower: "Turning 'No' into 'Yes' with rambling charm",
            quote: "Yes, we can do that... technically speaking",
            hobby: "Collecting vintage Claude artifacts"
        }
    },
    { 
        name: "Petrica", 
        role: "COO", 
        color: [75, 75, 150], 
        pos: [450, 220], 
        emoji: "🛡️", 
        boost: 10,
        connections: ["Bogdan", "Kunal", "Iustina", "Dishant"],
        profile: {
            funFact: "Has heard more classical music than Mozart",
            superpower: "Keeping Bogdan out of trouble",
            quote: "Budapest is not the same as Bucharest, alright?!",
            hobby: "Fixing up his dream house in France"
        }
    },
    { 
        name: "Richard", 
        role: "CTO", 
        color: [100, 150, 255], 
        pos: [750, 220], 
        emoji: "💻", 
        boost: 12,
        connections: ["Caroline", "Kateryna", "Maksym", "Dishant", "Thong", "Iustina", "Arianne", "Kunal"],
        profile: {
            funFact: "Jack of all trades, master of none",
            superpower: "Call his name three times and he appears (on Google Meet)",
            quote: "Guys, are you ready to crap your pants?",
            hobby: "Coming up with new, weird and wonderful solutions to problems"
        }
    },
    { 
        name: "Dishant", 
        role: "Lead Dev", 
        color: [100, 180, 100], 
        pos: [150, 380], 
        emoji: "🏔️", 
        boost: 13,
        connections: ["Richard", "Petrica", "Iustina", "Arianne"],
        profile: {
            funFact: "Known as Mama Dishant to his friends",
            superpower: "Debugging production applications from the top of a mountain",
            quote: "You'll have it in 2 hours... 3 tops... Actually, can we push it to next Tuesday?",
            hobby: "Indie fantasy fiction"
        }
    },
    { 
        name: "Thong", 
        role: "Programmer", 
        color: [150, 255, 100], 
        pos: [350, 380], 
        emoji: "⚡", 
        boost: 14,
        connections: ["Richard", "Dishant", "Bogdan"],
        profile: {
            funFact: "Can solve complex backend algorithms while eating pho",
            superpower: "Making impossible deadlines possible",
            quote: "Real! (Or whatever new expression he's invented this week)",
            hobby: "Too busy for hobbies. What's the next task guys?"
        }
    },
    { 
        name: "Caroline", 
        role: "Product", 
        color: [180, 100, 200], 
        pos: [550, 380], 
        emoji: "✨", 
        boost: 11,
        connections: ["Richard", "Maksym", "Bogdan"],
        profile: {
            funFact: "Has never seen Star Wars",
            superpower: "Presenting at the weekly scrum with a baby in one arm while giving the other kids a ponytail",
            quote: "Everything can be solved through the power of coffee",
            hobby: "The family sandwich"
        }
    },
    { 
        name: "Kunal", 
        role: "Sales", 
        color: [255, 140, 50], 
        pos: [750, 380], 
        emoji: "🥃", 
        boost: 13,
        connections: ["Bogdan", "Petrica", "Richard"],
        profile: {
            funFact: "Has never not closed a deal",
            superpower: "Building a pitch deck at midnight with a smile on his face",
            quote: "[Insert complex sales logic Bogdan doesn't understand here]. Does that make sense?",
            hobby: "Whiskey tasting"
        }
    },
    { 
        name: "Kateryna", 
        role: "DevOps", 
        color: [150, 50, 100], 
        pos: [200, 520], 
        emoji: "🦇", 
        boost: 12,
        connections: ["Richard", "Maksym"],
        profile: {
            funFact: "Terraforms at midnight because she's naturally nocturnal",
            superpower: "Making k8s purr like a happy cat",
            quote: "Hi, nice to meet you!",
            hobby: "Listening to old metal music to gain retro cred"
        }
    },
    { 
        name: "Maksym", 
        role: "DevOps", 
        color: [50, 200, 255], 
        pos: [400, 520], 
        emoji: "🧠", 
        boost: 10,
        connections: ["Richard", "Kateryna", "Caroline"],
        profile: {
            funFact: "Predicts server failures by reading cloud patterns",
            superpower: "Can jump in and out of the Matrix without pills",
            quote: "Yes, I don't think this should be a problem",
            hobby: "Runs a support group for 10X devs he embarrassed"
        }
    },
    { 
        name: "Arianne", 
        role: "Junior Dev", 
        color: [255, 150, 150], 
        pos: [600, 520], 
        emoji: "🌱", 
        boost: 8, 
        growth: 0,
        connections: ["Richard", "Dishant"],
        profile: {
            funFact: "Jumped down the rabbit hole of 2000s punk rock and hasn't been seen since",
            superpower: "Jumping head first into uncharted territory like Dora the Explorer",
            quote: "I have no idea what I'm doing. Wait, hold on, never mind, I got it",
            hobby: "Making short films with her Uni squad"
        }
    },
    { 
        name: "Iustina", 
        role: "PM", 
        color: [120, 120, 120], 
        pos: [800, 520], 
        emoji: "🕵️", 
        boost: 10,
        connections: ["Petrica", "Richard", "Dishant"],
        profile: {
            funFact: "Can detect scope creep from a mile away",
            superpower: "Keeping projects on track with mysterious precision",
            quote: "Alright Dishant, we can wait another week for that feature",
            hobby: "Possibly a secret agent or spy"
        }
    }
];

// Create character lookup map
export function createCharacterMap(chars) {
    const map = {};
    chars.forEach(char => {
        map[char.name] = char;
    });
    return map;
}