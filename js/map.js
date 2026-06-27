// Map and Room Management
class GameMap {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rooms = CONFIG.ROOMS;
        this.doors = CONFIG.DOORS;
    }

    renderRooms() {
        this.rooms.forEach(room => {
            this.renderRoom(room);
        });
        this.renderDoors();
    }

    renderRoom(room) {
        this.ctx.fillStyle = CONFIG.ROOM_COLOR;
        this.ctx.fillRect(room.x, room.y, room.width, room.height);

        this.ctx.strokeStyle = CONFIG.ROOM_BORDER_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(room.x, room.y, room.width, room.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            room.name,
            room.x + room.width / 2,
            room.y + 25
        );
    }

    renderDoors() {
        this.doors.forEach(door => {
            const fromRoom = this.rooms.find(r => r.id === door.from);
            const toRoom = this.rooms.find(r => r.id === door.to);

            if (fromRoom && toRoom) {
                const doorX = (fromRoom.x + fromRoom.width / 2 + toRoom.x + toRoom.width / 2) / 2;
                const doorY = (fromRoom.y + fromRoom.height / 2 + toRoom.y + toRoom.height / 2) / 2;

                this.ctx.fillStyle = CONFIG.DOOR_COLOR;
                this.ctx.fillRect(doorX - 15, doorY - 25, 30, 50);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(doorX - 15, doorY - 25, 30, 50);
            }
        });
    }

    getRoomAtPosition(x, y) {
        return this.rooms.find(
            room => x >= room.x && x <= room.x + room.width &&
                    y >= room.y && y <= room.y + room.height
        );
    }

    isValidPosition(x, y) {
        return this.getRoomAtPosition(x, y) !== undefined;
    }

    constrainPosition(x, y, size) {
        const room = this.getRoomAtPosition(x, y);
        if (!room) return { x, y };

        const minX = room.x + size / 2;
        const maxX = room.x + room.width - size / 2;
        const minY = room.y + size / 2;
        const maxY = room.y + room.height - size / 2;

        return {
            x: Math.max(minX, Math.min(maxX, x)),
            y: Math.max(minY, Math.min(maxY, y))
        };
    }
}