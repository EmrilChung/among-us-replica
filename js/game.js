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
        this.allPlayers = [];
        this.keys = {};
        this.gameState = 'playing'; // playing, gameover_crewmate_win, gameover_impostor_win
        this.isPlayerImpostor = false;
        this.deadBodies = [];
        this.reportCooldown = 0;

        // Initialize player tasks
        TASKS.forEach(task => this.player.addTask(task));

        // Spawn NPCs
        this.spawnNPCs();

        // Setup all players array
        this.allPlayers = [this.player, ...this.npcs];

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

        // Randomly assign impostor role
        const impostorIndex = Math.floor(Math.random() * this.allPlayers.length);
        const impostor = this.allPlayers[impostorIndex];
        impostor.isImpostor = true;

        // Set player as impostor or not
        this.isPlayerImpostor = this.player.isImpostor;

        // Give tasks to crewmates only
        this.npcs.forEach(npc => {
            if (!npc.isImpostor) {
                TASKS.forEach(task => npc.addTask(task));
            }
        });
    }

    // Setup keyboard and mouse listeners
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Kill hotkey (K) - only for impostors
            if (e.key.toLowerCase() === 'k' && this.isPlayerImpostor && this.player.isAlive) {
                this.attemptKill();
            }

            // Report hotkey (R) - for everyone
            if (e.key.toLowerCase() === 'r' && this.player.isAlive && this.reportCooldown <= 0) {
                this.reportDeadBody();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    // Attempt to kill a nearby player
    attemptKill() {
        if (this.player.killCooldown > 0) return;

        for (let npc of this.npcs) {
            if (npc.isAlive) {
                if (this.player.kill(npc)) {
                    console.log(`Killed ${npc.name}!`);
                    return;
                }
            }
        }
    }

    // Report dead body
    reportDeadBody() {
        if (this.gameState !== 'playing') return;
        
        this.reportCooldown = CONFIG.REPORT_COOLDOWN;
        console.log('Emergency meeting called!');
        // In future: trigger emergency meeting UI
    }

    // Check win conditions
    checkWinConditions() {
        const aliveCrewmates = this.allPlayers.filter(p => p.isAlive && !p.isImpostor).length;
        const aliveImpostors = this.allPlayers.filter(p => p.isAlive && p.isImpostor).length;
        const completedTasks = this.allPlayers
            .filter(p => !p.isImpostor && p.isAlive)
            .reduce((sum, p) => sum + p.completedTasks, 0);
        const totalCrew = this.allPlayers.filter(p => !p.isImpostor).length;
        const totalTasks = TASKS.length * totalCrew;

        // Impostors win if they equal or outnumber crewmates
        if (aliveImpostors >= aliveCrewmates && aliveCrewmates > 0) {
            this.gameState = 'gameover_impostor_win';
            this.showGameOver(this.isPlayerImpostor ? '🎉 YOU WIN! Impostors victory!' : '☠️ YOU LOSE! Impostors won!');
            return true;
        }

        // Crewmates win if all impostors are dead
        if (aliveImpostors === 0 && aliveCrewmates > 0) {
            this.gameState = 'gameover_crewmate_win';
            this.showGameOver(this.isPlayerImpostor ? '☠️ YOU LOSE! All impostors eliminated!' : '🎉 YOU WIN! All impostors eliminated!');
            return true;
        }

        // Crewmates win if all tasks are completed
        if (completedTasks >= totalTasks && aliveCrewmates > 0) {
            this.gameState = 'gameover_crewmate_win';
            this.showGameOver(this.isPlayerImpostor ? '☠️ YOU LOSE! Tasks completed!' : '🎉 YOU WIN! All tasks completed!');
            return true;
        }

        return false;
    }

    // Show game over screen
    showGameOver(message) {
        const panel = document.getElementById('interaction-panel');
        const text = document.getElementById('interaction-text');
        text.innerHTML = `<h2>${message}</h2><p>Refresh to play again</p>`;
        panel.classList.add('active');
    }

    // Update game state
    update() {
        if (this.gameState !== 'playing') return;

        // Update player
        this.player.update(this.keys, this.map);

        // Update NPCs
        this.npcs.forEach(npc => {
            npc.update(this.map);

            // Update impostor behavior
            if (npc.isImpostor) {
                npc.updateImpostorBehavior(this.allPlayers);
            }
        });

        // Update cooldowns
        if (this.reportCooldown > 0) {
            this.reportCooldown--;
        }

        // Update UI
        this.updateUI();

        // Check for win conditions
        this.checkWinConditions();
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

        // Draw kill indicator
        if (this.isPlayerImpostor && this.player.isAlive) {
            this.drawKillCooldown();
        }
    }

    // Draw kill cooldown indicator
    drawKillCooldown() {
        const cooldownPercent = 1 - (this.player.killCooldown / CONFIG.KILL_COOLDOWN);
        const x = 20;
        const y = this.canvas.height - 60;
        const width = 100;
        const height = 30;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Cooldown fill
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(x, y, width * cooldownPercent, height);

        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        const text = this.player.killCooldown > 0 ? 'KILL' : 'READY';
        this.ctx.fillText(text, x + width / 2, y + height / 2 + 5);
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
            if (npc.isAlive) {
                ctx.fillStyle = npc.color;
            } else {
                ctx.fillStyle = CONFIG.DEAD_COLOR;
            }
            ctx.beginPath();
            ctx.arc(npc.x * scaleX, npc.y * scaleY, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw player on minimap
        if (this.player.isAlive) {
            ctx.fillStyle = this.player.color;
        } else {
            ctx.fillStyle = CONFIG.DEAD_COLOR;
        }
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
        document.getElementById('total-tasks').textContent = this.player.isImpostor ? '—' : TASKS.length;

        const playerStatus = this.isPlayerImpostor ? '🔴 IMPOSTOR' : '🟢 CREWMATE';
        document.getElementById('player-info').innerHTML = `<span>Role: ${playerStatus} | ${this.player.name}</span>`;

        const currentRoom = this.player.getCurrentRoom(this.map);
        if (currentRoom && this.player.isAlive) {
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

        if (!this.isPlayerImpostor) {
            // Check for tasks in current room
            const availableTask = TASKS.find(t => t.room === currentRoom.id);
            if (availableTask) {
                const playerTask = this.player.tasks.find(t => t.id === availableTask.id);
                if (playerTask && !playerTask.completed) {
                    interactionText_str = `Complete: ${availableTask.name} (E to interact)`;
                    hasInteraction = true;
                }
            }
        } else {
            // Impostor interactions
            const cooldownText = this.player.killCooldown > 0 ? ` (${Math.ceil(this.player.killCooldown / 16)}s)` : ' (READY)';
            interactionText_str = `Press K to Kill${cooldownText}`;
            hasInteraction = true;
        }

        // Show kill range for impostor
        if (this.isPlayerImpostor && this.player.isAlive) {
            interactionText_str = `Kill Range: ${CONFIG.KILL_RANGE}px | Press K${this.player.killCooldown > 0 ? ' (cooling down)' : ' to Kill'}`;
            hasInteraction = true;
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