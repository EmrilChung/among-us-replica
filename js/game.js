// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');

        // Set canvas sizes
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.minimapCanvas.width = CONFIG.MINIMAP_WIDTH;
        this.minimapCanvas.height = CONFIG.MINIMAP_HEIGHT;

        // Initialize game objects
        this.map = new GameMap(this.canvas);
        this.player = new Crewmate(100, 400, 'Red', CONFIG.PLAYER_COLOR);
        this.npcs = [];
        this.keys = {};
        this.gameState = 'playing'; // playing, paused, gameover

        // Initialize player tasks
        TASKS.forEach(task => this.player.addTask(task));

        // Spawn NPCs
        this.spawnNPCs();

        // Event listeners
        this.setupEventListeners();

        // Start game loop
        this.lastTime = Date.now();
        this.gameLoop();
    }

    // Spawn NPC crewmates
    spawnNPCs() {
        const spawnPoints = [
            { x: 200, y: 350 },
            { x: 500, y: 100 },
            { x: 800, y: 300 }
        ];

        for (let i = 0; i < CONFIG.NPC_COUNT; i++) {
            const point = spawnPoints[i];
            const npc = new NPCCrewmate(
                point.x,
                point.y,
                ['Green', 'Blue', 'Yellow'][i],
                CONFIG.NPC_COLORS[i]
            );
            this.npcs.push(npc);
        }
    }

    // Setup keyboard and mouse listeners
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    // Update game state
    update() {
        if (this.gameState !== 'playing') return;

        // Update player
        this.player.update(this.keys, this.map);

        // Update NPCs
        this.npcs.forEach(npc => npc.update(this.map));

        // Update UI
        this.updateUI();
    }

    // Render everything
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0f0f1e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw map
        this.map.renderRooms();

        // Draw NPCs
        this.npcs.forEach(npc => npc.render(this.ctx));

        // Draw player
        this.player.render(this.ctx);

        // Draw minimap
        this.renderMinimap();
    }

    // Render minimap
    renderMinimap() {
        const minimap = this.minimapCanvas;
        const ctx = this.minimapCtx;

        // Clear minimap
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, minimap.width, minimap.height);

        // Calculate scale
        let maxX = Math.max(...CONFIG.ROOMS.map(r => r.x + r.width));
        let maxY = Math.max(...CONFIG.ROOMS.map(r => r.y + r.height));
        const scaleX = minimap.width / maxX;
        const scaleY = minimap.height / maxY;

        // Draw rooms on minimap
        CONFIG.ROOMS.forEach(room => {
            ctx.fillStyle = CONFIG.ROOM_COLOR;
            ctx.fillRect(
                room.x * scaleX,
                room.y * scaleY,
                room.width * scaleX,
                room.height * scaleY
            );
            ctx.strokeStyle = CONFIG.ROOM_BORDER_COLOR;
            ctx.lineWidth = 1;
            ctx.strokeRect(
                room.x * scaleX,
                room.y * scaleY,
                room.width * scaleX,
                room.height * scaleY
            );
        });

        // Draw NPCs on minimap
        this.npcs.forEach(npc => {
            ctx.fillStyle = npc.color;
            ctx.beginPath();
            ctx.arc(npc.x * scaleX, npc.y * scaleY, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw player on minimap
        ctx.fillStyle = this.player.color;
        ctx.beginPath();
        ctx.arc(this.player.x * scaleX, this.player.y * scaleY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Update UI elements
    updateUI() {
        document.getElementById('completed-tasks').textContent = this.player.completedTasks;
        document.getElementById('total-tasks').textContent = TASKS.length;

        const currentRoom = this.player.getCurrentRoom(this.map);
        if (currentRoom) {
            // Check for nearby NPCs or tasks
            this.updateInteractionPanel();
        }
    }

    // Update interaction panel
    updateInteractionPanel() {
        const panel = document.getElementById('interaction-panel');
        const interactionText = document.getElementById('interaction-text');
        const currentRoom = this.player.getCurrentRoom(this.map);

        let interactionText_str = '';
        let hasInteraction = false;

        // Check for tasks in current room
        const availableTask = TASKS.find(t => t.room === currentRoom.id);
        if (availableTask) {
            const playerTask = this.player.tasks.find(t => t.id === availableTask.id);
            if (playerTask && !playerTask.completed) {
                interactionText_str = `Complete: ${availableTask.name}`;
                hasInteraction = true;
            }
        }

        if (hasInteraction) {
            interactionText.textContent = interactionText_str;
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    }

    // Game loop
    gameLoop = () => {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop);
    };
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});