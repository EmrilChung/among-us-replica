# Among Us Replica - Single Player

A web-based single-player game inspired by Among Us, built with vanilla JavaScript and HTML5 Canvas.

## Features

### Current Implementation
- ✅ Game map with 8 interconnected rooms
- ✅ 2D cartoon-style graphics
- ✅ Player character with keyboard controls
- ✅ 3 NPC crewmates with AI behavior
- ✅ Task system for crewmates
- ✅ **Impostor role with kill mechanics**
- ✅ **Kill cooldown system**
- ✅ **Win/lose conditions**
- ✅ Minimap display
- ✅ Modern UI with interaction panels
- ✅ Room detection and boundaries

## How to Play

### Controls
- **WASD** or **Arrow Keys** - Move your character
- **E** - Complete tasks (crewmates only)
- **K** - Kill nearby players (impostors only)
- **R** - Report dead body (all players)

### Objective

**If you're a Crewmate:**
- Complete all 5 tasks scattered throughout the map
- Avoid being killed by the impostor
- Find and vote out the impostor

**If you're an Impostor:**
- Kill all crewmates before they complete tasks
- Avoid getting caught
- Make it look like someone else is suspicious!

## Game Mechanics

### Kill System
- **Impostor Kill Range**: 50 pixels
- **Kill Cooldown**: 15 seconds between kills
- **Key Binding**: K (when near a crewmate)

### Win Conditions
- **Crewmates win if:**
  - All tasks are completed
  - All impostors are eliminated (voted out)
  
- **Impostors win if:**
  - Impostors equal or outnumber crewmates

### NPC AI
- **Crewmates**: Wander around rooms randomly, working on tasks
- **Impostors**: Hunt crewmates and try to eliminate them

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
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Styling & UI
├── js/
│   ├── config.js          # Game configuration
│   ├── map.js             # Map and room system
│   ├── crewmate.js        # Player and NPC classes
│   └── game.js            # Main game loop
└── README.md              # This file
```

## Game Classes

### Crewmate
- Player character class
- Properties: position, color, name, tasks, isAlive, isImpostor, killCooldown
- Methods: update, render, getCurrentRoom, completeTask, kill

### NPCCrewmate
- AI-controlled crewmates
- Inherits from Crewmate
- Wanders around rooms randomly
- Methods: update, updateImpostorBehavior (for impostors)

### GameMap
- Manages all rooms and doors
- Collision detection
- Position constraints
- Methods: renderRooms, renderDoors, getRoomAtPosition, isValidPosition, constrainPosition

### Game
- Main game class
- Handles game loop, rendering, and updates
- Manages player, NPCs, and map
- Tracks game state and win conditions

## Configuration

All game settings are in `js/config.js`:
- Canvas dimensions
- Player speed and size
- Kill mechanics (range, cooldown)
- Colors for different roles
- Room definitions
- Task definitions

## Future Features

- [ ] Emergency meetings and voting system
- [ ] Sabotage mechanics (lights, reactor, etc.)
- [ ] Vent system for impostors
- [ ] Security camera system
- [ ] Chat system
- [ ] Sound effects and music
- [ ] Multiplayer support
- [ ] Custom map editor
- [ ] Achievements and stats
- [ ] Animations and particle effects
- [ ] Death animation effects

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API

## License

This is a fan project created for educational purposes.