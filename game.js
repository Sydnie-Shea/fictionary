class Game {
    constructor(diction) {
        this.players = []; 
        this.currentHolder = 0;  
        this.dictionary = diciton; 
    }
    addPlayer(player) {
        this.players.push(player);
    }
    
    removePlayer(player){
        this.players.pop(player);
    }
    startRound() {
        this.currentFakeDef = {};
        this.currentHolder += 1;
        this.correctGuess = 0;
        if (this.currentHolder == length(this.players)) {
            this.currentHolder = 0;
        }
        this.currentHolderPlayer = this.players[this.currentHolder];
        return this.currentHolderPlayer;
    }

    determineWord() {
        this.currentWordInfo = this.dictionary.getNewWord()
        this.currentWord = this.currentWordInfo["word"];
        this.currentDefinition = this.currentWordInfo["definition"]
        return this.currentWordInfo;
    }

    fakeDefinition(player, definitionGuess) {
        this.currentFakeDef[player] = definitionGuess;
    }

    goodDefinition(player) {
        player.scoreChange(2);
        delete this.currentFakeDef[player];
    }

    showDefinitions() {
        this.currentFakeDef["actual"] = this.currentDefinition;
        return this.currentFakeDef;
    }

    guess(player, guess) {
        if (guess == "actual") {
            this.correctGuess += 1;
            player.scoreChange(1);
        } else {
            guess.scoreChange(1);
        }
    }

    endRound() {
        if (this.correctGuess > 0) {
            this.currentHolderPlayer.scoreChange(2);
        }
    }



}