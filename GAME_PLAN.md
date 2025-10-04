# 🎮 Visual Hive Game - Complete Design Document

## 🎯 Game Concept

**Title:** Visual Hive: Quest for Series A  
**Genre:** Lighthearted Team RPG / Clicking Game  
**Goal:** Use team members' unique abilities to reach 100% funding progress  
**Audience:** Visual Hive team members  
**Tone:** Fun, celebratory, with loving inside jokes

---

## 👥 Complete Character Roster

### 1. Bogdan - CEO & Founder
- **From:** Romania
- **Personal:** Married, teenage daughter
- **Personality:** Way too nice, always wants others happy, charming and honest businessman
- **Ability:** "Charm Offensive" - Wins over investors with genuine kindness
- **Visual Theme:** Warm colors (red/orange), friendly emoji 🤝
- **Game Effect:** +15% progress, small chance for bonus investor goodwill

### 2. Petrica - COO & Cofounder  
- **From:** Romania, moving to France
- **Personal:** Loves French cuisine and wine, renovating old house
- **Personality:** The hard-ass, protects Bogdan from being taken advantage of
- **Ability:** "Reality Check Shield" - Blocks bad deals and keeps team grounded
- **Visual Theme:** Strong colors (dark blue/purple), shield emoji 🛡️
- **Game Effect:** +10% progress, occasionally blocks negative events

### 3. Richard - CTO
- **From:** Ireland, living in France
- **Personal:** Married to Caroline, 3 daughters, lifetime geek
- **Personality:** Nice like Bogdan but less patient, loves teaching and learning
- **Ability:** "Tech Innovation Burst" - Experiments with new tech solutions
- **Visual Theme:** Tech blue, geek emoji 💻
- **Game Effect:** +12% progress, can trigger tech breakthrough events

### 4. Dishant - Lead Developer
- **From:** India
- **Personal:** Loves outdoors and hiking
- **Personality:** Mild-mannered, heart of gold, strong opinions on right/wrong dev practices
- **Ability:** "Code Perfection" - Delivers flawless architecture
- **Visual Theme:** Nature green, mountain emoji 🏔️
- **Game Effect:** +13% progress, reduces technical debt

### 5. Thong - Programmer
- **From:** Vietnam  
- **Personal:** Says "Real" constantly, thinks it's cool
- **Personality:** Endless motivation and energy, lightning fast, great eye for design
- **Ability:** "Lightning Code + Real Energy" - Completes tasks at speed of light
- **Visual Theme:** Electric yellow/green, lightning emoji ⚡
- **Game Effect:** +14% progress, occasionally says "Real!" for bonus

### 6. Caroline - Product Owner
- **From:** Germany, living in France
- **Personal:** Married to Richard, 3 daughters, loves fine dining and travel
- **Personality:** Seeking work-life balance, prompt specialist
- **Ability:** "Perfect Prompt Engineering" - Crafts ideal solutions
- **Visual Theme:** Elegant purple, sparkle emoji ✨
- **Game Effect:** +11% progress, improves team efficiency

### 7. Kunal - Sales
- **From:** India
- **Personal:** Loves quality whiskey
- **Personality:** Inserts himself in every meeting, determined to learn everything
- **Ability:** "Omnipresent Sales Force" - Appears everywhere at once
- **Visual Theme:** Bold orange, handshake emoji 🥃
- **Game Effect:** +13% progress, multiplies effect of other abilities used recently

### 8. Kateryna - DevOps
- **From:** Ukraine
- **Personal:** Loves metal music, studying masters in CS
- **Personality:** Works nights, possibly a vampire (Romania connection!)
- **Ability:** "Vampire Mode Deployment" - Deploys perfectly during night hours
- **Visual Theme:** Dark purple/red, bat emoji 🦇
- **Game Effect:** +12% progress, stronger at "night" in game time

### 9. Maksym - DevOps
- **From:** Ukraine
- **Personal:** Only 19 years old
- **Personality:** Tech genius, incredibly helpful, always makes time for others
- **Ability:** "Young Genius Support" - Helps everyone else succeed
- **Visual Theme:** Bright cyan, brain emoji 🧠
- **Game Effect:** +10% progress, boosts next teammate's ability

### 10. Arianne - Junior Frontend Dev
- **From:** Nicaragua, studying in Dubai
- **Personal:** Social sciences + CS minor
- **Personality:** Full of potential and motivation, stays positive despite mistakes
- **Ability:** "Learning Boost" - Grows stronger with each use
- **Visual Theme:** Warm pink/coral, growth emoji 🌱
- **Game Effect:** +8% initially, increases by 1% each time used (growth mechanic!)

### 11. Iustina - Project Manager
- **From:** Romania
- **Personal:** Never turns camera on in meetings
- **Personality:** Mystery person, possibly secret agent, instrumental in Notion setup
- **Ability:** "Mystery Agent Coordination" - Unknown effects, but it works!
- **Visual Theme:** Dark mysterious gray, spy emoji 🕵️
- **Game Effect:** +10% progress, random bonus effect (mystery!)

---

## 🎮 Game Mechanics

### Core Loop
1. Player clicks team member
2. **Dynamic Synergy System Activates:** Connection lines appear showing relationships
3. Ability activates with character profile popup
4. Progress bar increases with floating numbers
5. Character goes on cooldown (1.5 seconds)
6. Connection ripple effects fade out
7. Repeat until 100% reached AND all team members explored

### **NEW: Dynamic Synergy Connection System**
- **Visual Network:** Real-time connection lines between team members
- **Connection Types:**
  - **Leadership Triangle:** Bogdan-Petrica-Kunal (Golden lines)
  - **Tech Hub:** Richard's extensive network (Blue lines)
  - **Mentorship:** Arianne with Richard/Dishant (Green lines)
  - **Cross-functional:** Caroline-Maksym collaboration (Purple lines)
  - **DevOps Sync:** Kateryna-Maksym-Richard (Blue technical lines)
- **Interactive Effects:**
  - **Click Ripples:** Clicking triggers connection cascade
  - **Hover Previews:** Faint connection hints on mouse hover
  - **Periodic Pulses:** Random connections appear every 3 seconds
  - **Secondary Connections:** Connected teammates light up after delay

### Enhanced Mechanics
- **Team Synergy:** Visual connections show real collaboration patterns
- **Growth System:** Arianne's ability and character size grows with each use
- **Boost Chain:** Maksym boosts next teammate clicked
- **Real Energy:** Thong occasionally shouts "Real!" for bonus
- **Profile System:** Click to see detailed character profiles with fun facts

### Win Condition
- Reach 100% Series A funding progress
- **AND** explore all 11 team members (encourages full team interaction)
- Victory celebration with confetti rain
- Option to play again

---

## �️ Development Steps (For Cursor AI)

### ✅ Step 1: Foundation (COMPLETE)
- Set up Kaboom.js
- Create basic game scene
- Add 3 test characters (Bogdan, Richard, Thong)
- Implement click interactions
- Add progress bar
- Create victory scene

### 🔄 Step 2: Add All Characters (NEXT)
```javascript
// Add remaining 8 characters:
// - Petrica, Dishant, Caroline, Kunal
// - Kateryna, Maksym, Arianne, Iustina

// Each needs:
// - Unique position on screen (arrange in nice layout)
// - Character circle with color
// - Emoji representation
// - Name and role labels
// - Click handler with their specific ability
// - Appropriate progress contribution

// Layout suggestion:
// Top row: Bogdan, Petrica, Richard (founders/leadership)
// Middle row: Dishant, Thong, Caroline, Kunal (dev + product + sales)
// Bottom row: Kateryna, Maksym, Arianne, Iustina (devops + junior + PM)
```

### ⏳ Step 3: Enhanced Mechanics
```javascript
// Implement special abilities:
// - Arianne's growing power (tracks usage count)
// - Maksym's boost effect (affects next character clicked)
// - Kunal's multiplier (affects recent clicks)
// - Kateryna's night mode (time-based bonus)
// - Combo detection for related characters

// Add visual flourishes:
// - Different colored particle effects per character
// - Ability descriptions on hover
// - Character-specific animations
// - Sound effects (optional)
```

### ⏳ Step 4: Polish & Fun Additions
```javascript
// Add startup challenges that appear randomly:
// - "Bug in Production!" (-5% progress)
// - "Investor Meeting!" (bonus progress if Bogdan used)
// - "Demo Day!" (bonus if multiple devs used recently)
// - "Coffee Break" (temporary ability cooldown reduction)

// Improve visuals:
// - Better character sprites (if available)
// - Animated backgrounds
// - Progress bar animations
// - Victory confetti

// Add personality touches:
// - Thong says "Real!" randomly
// - Kunal appears to "join" other meetings
// - Iustina's camera stays off (shadowy figure)
// - Richard and Caroline occasionally interact
```

---

## 💡 Inside Jokes & Easter Eggs

1. **Vampire Connection:** Kateryna works nights + Romania founders = vampire theme
2. **"Real":** Thong's catchphrase should appear in his interactions
3. **Omnipresent Kunal:** Visual gag showing him in multiple places
4. **Mystery Iustina:** Her character is always slightly obscured/shadowy
5. **French Dreams:** Petrica's ability could show wine/baguette imagery
6. **Hiking Dishant:** Mountain/nature imagery in his effects
7. **Learning Arianne:** Her character visibly "grows" or gets brighter with use
8. **Young Genius:** Maksym's age (19) referenced in ability description
9. **Family Connection:** Richard + Caroline as couple can have special interaction
10. **Whiskey Kunal:** His emoji/visual includes whiskey glass

---

## 🎨 Visual Design Notes

### Color Palette
- **Background:** Dark blue/purple startup night vibes (#1a1a2e, #16213e)
- **Progress Bar:** Green gradient (success, growth)
- **Characters:** Each unique, vibrant color
- **Text:** Clean white/yellow for readability
- **Accents:** Gold for achievements, highlights

### Character Layout
```
         [Bogdan]    [Petrica]    [Richard]
              
    [Dishant]  [Thong]  [Caroline]  [Kunal]
              
      [Kateryna]  [Maksym]  [Arianne]  [Iustina]
```

### UI Elements
- Big progress bar at top
- Character circles with emojis
- Names and roles clearly labeled
- Ability names appear on use
- Floating numbers for progress gains
- Victory screen with confetti

---

## 🚀 Deployment

Once complete:
1. Single HTML file - easy to host anywhere
2. Can put on internal website
3. Can share via file
4. Could even make it a team homepage!

---

## 📝 Notes for Cursor AI

- Keep code simple and readable
- Comment generously for team to understand
- Maintain single-file structure for easy deployment
- Focus on fun over complexity
- Make sure all 11 characters feel special and unique
- Test that progress reaches exactly 100%
- Ensure all abilities are balanced (8-15% range)
- Keep cooldowns reasonable (1-2 seconds)

---

**Remember:** This is a celebration of the team! Every detail should make someone smile. 😊
