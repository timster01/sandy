const ChatContext = require('./chatContext.js')

class GreetingsContext extends ChatContext {
    constructor() {
        super()
        this.triggerStrings = [["hi", "hoi", "hey", "hallo"]]
        this.positiveWords = ["good", "well", "ok"]
        this.negativeWords = ["bad", "sad", "blah"]
        this.reverse = "not"
    }

    process(words) {
        switch (this.step) {
            case 0:
                this.step++
                return "Hi there, how are you?"
            case 1:
                let badAura = 0
                let goodAura = 0
                for (let i = 0; i < words.length; i++) {
                    let word = words[i].toLowerCase()
                    if (this.positiveWords.includes(word)) {
                        if (i != 0 && words[i - 1].toLowerCase() == this.reverse) {
                            badAura++
                        } else {
                            goodAura++
                        }
                    }
                    if (this.negativeWords.includes(word)) {
                        if (i != 0 && words[i - 1].toLowerCase() == this.reverse) {
                            goodAura++
                        } else {
                            badAura++
                        }
                    }
                }

                this.finished = true
                if (goodAura == badAura) {
                    return "Nice to know."
                } else if (goodAura > badAura) {
                    return "Awesome!"
                } else {
                    return "Hope you feel better soon!"
                }
            default:
                throw new Error("Undefined step for GreetingsContext")
        }
    }


}

module.exports = GreetingsContext