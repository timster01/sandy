let SenderEnum = Object.freeze({ "client": 1, "server": 2 })
var socket = undefined

$(document).ready(() => {
    socket = io.connect('http://localhost:8000/')

    socket.on('connect', () => {
        console.log("Socket succesfully created: " + socket.id)

        socket.on("sendMessage-" + socket.id, (data) => {
            console.log(data)
            addChatline(SenderEnum.server, data.message)
        })
    })
})

function trySubmitUserText(event) {
    if (event.keyCode == 13) {
        submitUserText()
    }
}

function submitUserText() {
    if(socket == undefined){
        console.log("Socket undefined!")
        return
    }

    let inputField = document.getElementById('userInputField')
    let message = inputField.value
    if (message.trim() == "") {
        return
    }
    inputField.value = ""

    addChatline(SenderEnum.client, message)
    socket.emit('sendMessage-' + socket.id, {message: message})
}

function addChatline(sender, message) {
    if (sender == SenderEnum.client) {
        message = "You: " + message
    }

    let chat = document.getElementById("chatfield")
    let htmlString = "<li><p>" + message + "</p></li>"
    chat.insertAdjacentHTML('beforeend', htmlString)
    chat.scrollTop = chat.scrollHeight
}
