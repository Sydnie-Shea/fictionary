class Player {
    constructor(sid, n) {
        this.socketId = sid;
        this.name = n;
        this.score = 0;
    }

    scoreChange(points) {
        this.score += points;
    }

    getSocketId() {
        return this.socketId;
    }

    getName() {
        return this.name;
    }

    getScore() {
        return this.score;
    }
}

module.exports = Player;