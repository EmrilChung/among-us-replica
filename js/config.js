// Game Configuration
const CONFIG = {
    // Canvas
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    
    // Player
    PLAYER_SIZE: 30,
    PLAYER_SPEED: 3,
    PLAYER_COLOR: '#ff0000',
    
    // Map
    ROOM_COLOR: '#1a3a52',
    ROOM_BORDER_COLOR: '#00ff00',
    DOOR_COLOR: '#ffaa00',
    VENTILATION_COLOR: '#ff00ff',
    IMPOSTOR_COLOR: '#ff0000',
    DEAD_COLOR: '#808080',
    
    // UI
    MINIMAP_WIDTH: 150,
    MINIMAP_HEIGHT: 150,
    
    // Game
    TOTAL_TASKS: 5,
    INTERACTION_DISTANCE: 60,
    KILL_COOLDOWN: 15000, // 15 seconds between kills
    KILL_RANGE: 50,
    REPORT_COOLDOWN: 30000, // 30 seconds between emergency calls
    
    // NPCs
    NPC_COLORS: ['#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'],
    NPC_COUNT: 3,
    IMPOSTOR_COUNT: 1,
    
    // Rooms
    ROOMS: [
        { id: 'cafeteria', x: 50, y: 300, width: 300, height: 200, name: 'Cafeteria' },
        { id: 'upper-engine', x: 450, y: 50, width: 200, height: 150, name: 'Upper Engine' },
        { id: 'reactor', x: 450, y: 250, width: 200, height: 200, name: 'Reactor' },
        { id: 'security', x: 750, y: 50, width: 150, height: 150, name: 'Security' },
        { id: 'med-bay', x: 750, y: 250, width: 150, height: 150, name: 'Med-Bay' },
        { id: 'lower-engine', x: 50, y: 550, width: 200, height: 150, name: 'Lower Engine' },
        { id: 'electrical', x: 350, y: 550, width: 150, height: 150, name: 'Electrical' },
        { id: 'storage', x: 600, y: 550, width: 150, height: 150, name: 'Storage' },
    ],
    
    // Doors between rooms
    DOORS: [
        { from: 'cafeteria', to: 'upper-engine' },
        { from: 'cafeteria', to: 'lower-engine' },
        { from: 'upper-engine', to: 'reactor' },
        { from: 'reactor', to: 'security' },
        { from: 'reactor', to: 'med-bay' },
        { from: 'security', to: 'med-bay' },
        { from: 'lower-engine', to: 'electrical' },
        { from: 'electrical', to: 'storage' },
        { from: 'reactor', to: 'electrical' },
    ],
};

// Task definitions
const TASKS = [
    { id: 1, name: 'Submit Scan', room: 'med-bay', duration: 5000 },
    { id: 2, name: 'Start Reactor', room: 'reactor', duration: 5000 },
    { id: 3, name: 'Swipe Card', room: 'security', duration: 3000 },
    { id: 4, name: 'Empty Garbage', room: 'storage', duration: 4000 },
    { id: 5, name: 'Prime Shields', room: 'upper-engine', duration: 6000 },
];

// Vents for NPCs
const VENTS = [
    { room: 'upper-engine', x: 200, y: 100 },
    { room: 'lower-engine', x: 100, y: 600 },
    { room: 'security', x: 800, y: 80 },
];