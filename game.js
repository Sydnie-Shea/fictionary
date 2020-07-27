class Game {
    constructor() {
        this.players = []; 
        this.currentHolder = 0;       
    }
    addPlayer(player) {
        this.players.push(player);
    }
    
    removePlayer(player){
        this.players.pop(player);
    }

    round() {
        this.currentHolder += 1;
        if (this.currentHolder == length(this.players)) {
            
        }
    }
}