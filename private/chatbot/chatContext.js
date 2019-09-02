const utils = require('../utils.js')

class ChatContext {
    constructor() {
        this.step = 0
        this.finished = false
        this.triggerStrings = []
    }

    process(words) {
        throw new Error("Context process must be implemented.")
    }

    isTriggered(words) {
        let validIfCases = 0
        let ifCases = 0

        //"includes" checks for case sensitivity. This should be changed later to be ignored.
        for (let i = 0; i < this.triggerStrings.length; i++) {
            let trigger = this.triggerStrings[i]
            if (Array.isArray(trigger)) {
                ifCases++
                for (let j = 0; j < trigger.length; j++) {
                    if (words.includes(trigger[j])){
                        validIfCases++
                        break
                    }
                }
            } else if (!words.includes(trigger)) {
                return false
            }
        }
        return validIfCases >= ifCases
    }
}

module.exports = ChatContext