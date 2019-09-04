const utils = require('../utils.js')
const GreetingsContext = require('./greetingsContext.js')
const SendMailContext = require('./sendMailContext.js')

class Chatbot {
    constructor() {
        this.currentContext = undefined
    }

    parseMessage(sentence) {
        let words = utils.splitByWhitespaces(sentence)
        let result = {}
        result.success = true

        if (this.currentContext != undefined && words.length == 1 && words[0] == "stop") {
            this.currentContext = undefined
            result.response = "Ok, what else can I help you with?"
            return result
        } else {
            if (this.currentContext == undefined) {
                for (let i = 0; i < Chatbot.registeredContexts.length; i++) {
                    if (Chatbot.registeredContexts[i].isTriggered(words)) {
                        this.currentContext = Object.assign(
                            Object.create(
                                Object.getPrototypeOf(Chatbot.registeredContexts[i])
                            ), Chatbot.registeredContexts[i])
                        break
                    }
                }
            }
        }

        if (this.currentContext == undefined) {
            result.success = false
            result.message = "Sorry, I did not understand that. Let me ask a human..."
            return result
        } else {
            let response = this.currentContext.process(words)
            if (this.currentContext.finished) {
                this.currentContext = undefined
            }
            result.message = response
            return result
        }
    }
}

Chatbot.registeredContexts = [
    new GreetingsContext(),
    new SendMailContext()
]

module.exports = Chatbot
