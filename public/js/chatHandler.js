let SenderEnum = Object.freeze({ "client": 1, "server": 2 })

function trySubmitUserText(event) {
    if (event.keyCode == 13) {
        submitUserText()
    }
}

function submitUserText() {
    let inputField = document.getElementById('userInputField')
    let message = inputField.value
    if (message.trim() == "") {
        return
    }
    inputField.value = ""
    addChatline(SenderEnum.client, message)

    $.ajax({
        url: "http://localhost:8000/api/chatbot",
        type: "POST",
        data: { message: message },
        dataType: "JSON",
        success: function (data) {
            console.log("Retrieved data: " + data.message)
            addChatline(SenderEnum.server, data.message)
        }, error: function () {
            console.log("Unable to retrieve data.")
        }
    })
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
