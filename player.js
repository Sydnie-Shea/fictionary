class Player {
    constructor(n) {
        this.name = n;
        this.score = 0;
    }

    scoreChange(points) {
        this.score += points;
    }
}