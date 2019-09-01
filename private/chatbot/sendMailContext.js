const ChatContext = require('./chatContext.js')
const utils = require('../utils.js')

class SendMailContext extends ChatContext {
    constructor() {
        super()
        this.email = undefined
        this.subject = undefined
        this.triggerStrings = ["send", ["email", "mail"]]
    }

    process(words) {
        switch (this.step) {
            case 0:
                this.step++
                return "To who do you want to send the email?"
            case 1:
                for (let i = 0; i < words.length; i++) {
                    if (utils.isValidEmail(words[i])) {
                        this.email = words[i]
                        break
                    }
                }
                if (this.email == undefined) {
                    return "Please provide a valid email."
                } else {
                    this.step++
                    return "What is the subject?"
                }
            case 2:
                this.step++
                this.subject = words.join(" ")
                return "Alright, and what is the body?"
            case 3:
                this.finished = true
                //Try to send email...
                return "Email has been sent!"
            default:
                throw new Error("Undefined step for SendMailContext")
        }
    }
}

module.exports = SendMailContext