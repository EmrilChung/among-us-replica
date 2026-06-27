// Crewmate Player Character
class Crewmate {
    constructor(x, y, name, color) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.size = CONFIG.PLAYER_SIZE;
        this.isMoving = false;
        this.tasks = [];
        this.completedTasks = 0;
        this.isAlive = true;
        this.isImpostor = false;
        this.killCooldown = 0;
    }

    update(keys, map) {
        if (!this.isAlive) return;

        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;

        if (keys['w'] || keys['ArrowUp']) {
            this.vy = -CONFIG.PLAYER_SPEED;
            this.isMoving = true;
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.vy = CONFIG.PLAYER_SPEED;
            this.isMoving = true;
        }
        if (keys['a'] || keys['ArrowLeft']) {
            this.vx = -CONFIG.PLAYER_SPEED;
            this.isMoving = true;
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.vx = CONFIG.PLAYER_SPEED;
            this.isMoving = true;
        }

        let newX = this.x + this.vx;
        let newY = this.y + this.vy;

        const constrained = map.constrainPosition(newX, newY, this.size);
        this.x = constrained.x;
        this.y = constrained.y;

        if (this.killCooldown > 0) {
            this.killCooldown--;
        }
    }

    render(ctx) {
        if (!this.isAlive) {
            this.renderDead(ctx);
            return;
        }

        const renderColor = this.color;

        ctx.fillStyle = renderColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y - 5, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = renderColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y - 20, this.size / 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - 22, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y - 22, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.x - 12, this.y + 8, 24, 18);
        ctx.strokeStyle = renderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 12, this.y + 8, 24, 18);

        if (this.isImpostor) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 20, this.size / 2.5 + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y + 35);
    }

    renderDead(ctx) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = CONFIG.DEAD_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y - 5, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = CONFIG.DEAD_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y - 20, this.size / 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('☠', this.x, this.y - 20);

        ctx.globalAlpha = 1.0;

        ctx.fillStyle = CONFIG.DEAD_COLOR;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y + 35);
    }

    getCurrentRoom(map) {
        return map.getRoomAtPosition(this.x, this.y);
    }

    addTask(task) {
        this.tasks.push({
            ...task,
            completed: false,
            inProgress: false,
            progress: 0
        });
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.completed = true;
            this.completedTasks++;
            return true;
        }
        return false;
    }

    kill(target) {
        if (!this.isImpostor || this.killCooldown > 0 || !target.isAlive) {
            return false;
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= CONFIG.KILL_RANGE) {
            target.isAlive = false;
            this.killCooldown = CONFIG.KILL_COOLDOWN;
            return true;
        }
        return false;
    }
}

class NPCCrewmate extends Crewmate {
    constructor(x, y, name, color) {
        super(x, y, name, color);
        this.targetX = x;
        this.targetY = y;
        this.wanderTimer = 0;
        this.wanderInterval = Math.random() * 3000 + 2000;
    }

    update(map) {
        if (!this.isAlive) return;

        this.wanderTimer++;

        if (this.wanderTimer > this.wanderInterval) {
            const room = map.getRoomAtPosition(this.x, this.y);
            if (room) {
                this.targetX = room.x + Math.random() * room.width;
                this.targetY = room.y + Math.random() * room.height;
            }
            this.wanderTimer = 0;
            this.wanderInterval = Math.random() * 3000 + 2000;
        }

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
            this.vx = (dx / distance) * CONFIG.PLAYER_SPEED * 0.8;
            this.vy = (dy / distance) * CONFIG.PLAYER_SPEED * 0.8;
            this.isMoving = true;
        } else {
            this.vx = 0;
            this.vy = 0;
            this.isMoving = false;
        }

        let newX = this.x + this.vx;
        let newY = this.y + this.vy;

        const constrained = map.constrainPosition(newX, newY, this.size);
        this.x = constrained.x;
        this.y = constrained.y;

        if (this.killCooldown > 0) {
            this.killCooldown--;
        }
    }

    updateImpostorBehavior(players) {
        if (!this.isImpostor || !this.isAlive) return;

        for (let player of players) {
            if (player !== this && player.isAlive) {
                this.kill(player);
            }
        }
    }
}