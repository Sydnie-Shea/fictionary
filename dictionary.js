class Dictionary {
    constructor() {
        this.words = [{
            "word": "test1",
            "definition": "test1 definition",
        },
        {
            "word": "test2",
            "definition": "test2 definition",
        },
        {
            "word": "test3",
            "definition": "test3 definition",
        },
        {
            "word": "test4",
            "definition": "test4 definition",
        }];
        this.nextWord = 0;
    }
    getNewWord() {
        var newWord = this.words[this.nextWord];
        this.nextWord++;
        if (this.nextWord == this.words.length) {
            this.nextWord = 0;
        }
        return newWord;
    }
}
module.exports = Dictionary;