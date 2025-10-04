# 📁 Visual Hive - Modular File Structure

## File Organization

```
your-project/
├── index.html                  # Main HTML entry point
├── assets/
│   └── sprites/               # Character images
│       ├── bogdan.jpeg
│       ├── petrica.jpeg
│       └── ... (other sprites)
└── js/
    ├── main.js                # Game entry point
    ├── config.js              # Game configuration
    ├── data/
    │   └── characters.js      # Character data
    ├── utils/
    │   └── connections.js     # Connection system
    ├── ui/
    │   └── profile.js         # Profile display
    └── scenes/
        ├── mainScene.js       # Main game scene
        └── victoryScene.js    # Victory scene
```

## 📋 File Purposes

### `index.html`
- Simple HTML entry
- Loads only `main.js` as module
- Styles for canvas

### `js/main.js`
- Game initialization
- Sprite loading
- Scene registration
- Entry point

### `js/config.js`
- Game dimensions
- UI configuration
- Connection settings
- Character settings
- Sprite paths

### `js/data/characters.js`
- Character data array
- Profile information
- Connections mapping
- Helper functions

### `js/utils/connections.js`
- `ConnectionManager` class
- Connection drawing logic
- Color relationships
- Ripple effects

### `js/ui/profile.js`
- `ProfileManager` class
- Profile display
- Profile hiding
- State management

### `js/scenes/mainScene.js`
- Main game logic
- Character creation
- Click handlers
- Update loop
- Progress tracking

### `js/scenes/victoryScene.js`
- Victory screen
- Confetti effect
- Replay option

## 🚀 How to Use

1. **Copy all files** to your project folder
2. **Keep the folder structure** exactly as shown
3. **Run with a local server** (VS Code Live Server, or Python server)
4. **Don't open index.html directly** - modules need a server!

## 🔧 Development Tips

### Testing Changes
- Modify `config.js` for quick tweaks
- Edit `characters.js` for character updates
- Scene logic is in `scenes/` folder

### Adding Features
- New utilities → `js/utils/`
- New UI components → `js/ui/`
- New scenes → `js/scenes/`

### Common Tasks

**Change game size:**
```javascript
// In config.js
export const GAME_CONFIG = {
    width: 1200,  // Change this
    height: 800,  // And this
    background: [20, 20, 40]
};
```

**Add new character:**
```javascript
// In data/characters.js
// Just add to the characters array
```

**Modify connection colors:**
```javascript
// In utils/connections.js
// Edit getConnectionColor() method
```

## ⚠️ Important Notes

- **Must use a local server** for ES6 modules
- All imports use relative paths
- VS Code Live Server recommended
- Browser needs to support ES6 modules

## 🐛 Troubleshooting

**"Failed to load module"**
- Use a local server (Live Server extension)
- Check file paths are correct

**Sprites not loading**
- Verify `assets/sprites/` folder exists
- Check sprite filenames match config.js

**Connection lines not showing**
- Check console for errors
- Verify ConnectionManager is imported

## 📝 Next Steps

Ready to add features:
1. ✅ Character animations (Phase 4)
2. ✅ Particle effects (Phase 5)
3. ✅ Sound effects (optional)
4. ✅ Mobile controls (optional)