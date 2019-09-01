const botName = "Sandy"
const GreetingsContext = require('./greetingsContext.js')
const SendMailContext = require('./sendMailContext.js')

let contexts = [
    new GreetingsContext(),
    new SendMailContext()
]

let currentContext = undefined

exports.parseMessage = function (sentence) {
    let words = sentence.trim().split(" ")

    if (currentContext != undefined && words.length == 1 && words[0].trim() == "stop") {
        currentContext = undefined
        return botName + ": Ok, what else can I help you with?"
    } else {
        if (currentContext == undefined) {
            for (let i = 0; i < contexts.length; i++) {
                if (contexts[i].isTriggered(words)) {
                    currentContext = Object.assign(Object.create(Object.getPrototypeOf(contexts[i])), contexts[i])
                    console.log("Context changed")
                    break
                }
            }
        }
    }

    if (currentContext == undefined) {
        return botName + ": Sorry, I did not understand that."
    } else {
        let response = currentContext.process(words)
        if (currentContext.finished) {
            currentContext = undefined
        }
        return botName + ": " + response
    }
}



