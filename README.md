# Among Us Replica - Single Player

A web-based single-player game inspired by Among Us, built with vanilla JavaScript and HTML5 Canvas.

## Features

### Current Implementation (Foundation)
- ✅ Game map with multiple interconnected rooms
- ✅ 2D cartoon-style graphics
- ✅ Player character (Red crewmate) with keyboard controls
- ✅ 3 NPC crewmates with AI behavior
- ✅ Task system
- ✅ Minimap display
- ✅ Modern UI with interaction panels
- ✅ Room detection and boundaries

## How to Play

### Controls
- **WASD** or **Arrow Keys** - Move your character
- **E** - Interact with tasks (when near them)

### Objective
- Complete all 5 tasks scattered throughout the map
- Each task is located in a specific room
- Navigate between rooms using doors
- Watch out for the impostors (coming soon!)

## Game Map

The map consists of 8 rooms:

1. **Cafeteria** - Central hub
2. **Upper Engine** - Engine tasks
3. **Reactor** - Core reactor area
4. **Security** - Security cameras
5. **Med-Bay** - Medical scanner
6. **Lower Engine** - Additional engine room
7. **Electrical** - Electrical systems
8. **Storage** - Storage area

## Project Structure

```
among-us-replica/
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Styling
├── js/
│   ├── config.js      # Game configuration
│   ├── map.js         # Map and room system
│   ├── crewmate.js    # Player and NPC classes
│   └── game.js        # Main game loop
└── README.md          # This file
```

## Game Classes

### Crewmate
- Player character class
- Properties: position, color, name, tasks
- Methods: update, render, getCurrentRoom, completeTask

### NPCCrewmate
- AI-controlled crewmates
- Inherits from Crewmate
- Wanders around rooms randomly
- Methods: update (with AI behavior)

### GameMap
- Manages all rooms and doors
- Collision detection
- Position constraints
- Methods: renderRooms, renderDoors, getRoomAtPosition, isValidPosition

### Game
- Main game class
- Handles game loop, rendering, and updates
- Manages player, NPCs, and map
- UI updates

## Configuration

All game settings are in `js/config.js`:
- Canvas dimensions
- Player speed and size
- Colors
- Room definitions
- Task definitions

## Future Features

- [ ] Task completion system
- [ ] Impostor role with kill mechanics
- [ ] Emergency meetings and voting
- [ ] Sound effects and music
- [ ] Multiplayer support
- [ ] Custom map editor
- [ ] Achievements and stats
- [ ] Animations and particle effects

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API

## License

This is a fan project created for educational purposes.
