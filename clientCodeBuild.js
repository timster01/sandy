function buildClient() {
    const config = require('./config')
    const fs = require('fs')
    const file = "./public/js/chatHandler.js"
    var text = fs.readFileSync(file)
    text = text.replace(new RegExp('http://localhost:8000','g'), config.applocation + ":" + config.port)
    fs.writeFileSync(file, text)
}