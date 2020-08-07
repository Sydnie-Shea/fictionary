
class Game {
    constructor(diction) {
        this.players = []; 
        this.currentHolder = 0;  
        this.dictionary = diction;
        this.numGuesses = 0;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    
    removePlayer(player){
        this.players.pop(player);
    }
    startRound() {
        this.currentFakeDef = {};
        this.numGuesses = 0;
        this.currentHolder += 1;
        this.correctGuess = 0;
        if (this.currentHolder >= this.players.length) {
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
        if (this.orderedPlayers[guess] == "actual") {
            this.correctGuess += 1;
            player.scoreChange(1);
        } else {
            console.log(this.orderedPlayers);
            console.log(this.orderedPlayers[guess]);
            this.orderedPlayers[guess].scoreChange(1);
        }
        this.numGuesses += 1;
    }

    doneGuess() {
        return this.numGuesses = this.players.length -1;
    }

    endRound() {
        if (this.correctGuess == 0) {
            this.currentHolderPlayer.scoreChange(2);
        }
    }

    getCurrentWord() {
        return this.currentWordInfo;
    }

    getCurrentHolder() {
        return this.currentHolderPlayer;
    }

    getWordsToShow(playerHolder) {
        this.currentFakeDef["actual"] = this.currentDefinition;
        console.log(this.players)
        this.orderedPlayers = [];
        for (var player in this.players) {
            if (this.players[player] != playerHolder) {
                this.orderedPlayers.push(this.players[player]);
            }
        }
        this.orderedPlayers.push("actual");
        console.log(this.orderedPlayers);
        this.shuffle(this.orderedPlayers);
        console.log(this.orderedPlayers);
        console.log(this.currentFakeDef);
        this.orderedDefs = [];
        for (var i = 1; i < this.orderedPlayers.length +1; i++) {
            this.orderedDefs.push(i + " - " +this.currentFakeDef[this.orderedPlayers[i-1]]);
        }
        return this.orderedDefs;
    }
    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }
      
    getPlayers() {
        return this.players;
    }

    getSids() {
        var temp = [];
        for (var i = 0; i<this.players.length; i++) {
            temp.push(this.players[i].getSocketId());
        }    
        return temp;
    }

    getNames() {
        var temp = [];
        for (var i = 0; i<this.players.length; i++) {
            temp.push(this.players[i].getName());
        }    
        return temp;
    }

    getScores() {
        var temp = [];
        for (var i = 0; i<this.players.length; i++) {
            temp.push(this.players[i].getScore());
        }    
        return temp;
    }

}

module.exports = Game;