var socket = undefined

$(document).ready(() => {
    socket = io.connect('http://localhost:8000/')

    socket.on('connect', () => {
        console.log("Socket succesfully created: " + socket.id)

        socket.on("sendMessage", (data) => {
            console.log(data)
            createSandyMessage(data.message)
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

    let inputField = document.getElementById('messageInput')
    let message = inputField.value
    if (message.trim() == "") {
        return
    }
    inputField.value = ""
    createUserMessage(message)
    socket.emit('sendMessage-' + socket.id, {message: message})
}

function createUserMessage(text) {
    let messagesList = document.getElementById("messagesList")
    let msgBox = createAndAppend("div", messagesList, "user_msg");
    let msg = createAndAppend("div", msgBox, "sent_msg");
    fillMessage(msg, text, "right");
}

function createSandyMessage(text) {
    let messagesList = document.getElementById("messagesList")
    let msgBox = createAndAppend("div", messagesList, "sandy_incoming_msg");

    let img_div = createAndAppend("div", msgBox, "sandy_msg_img");
    let img = createAndAppend("img", img_div);
    img.src = "images/sandy.png";
    img.alt = "Sandy";

    let msg = createAndAppend("div", msgBox, "sandy_msg");
    let msg_withd = createAndAppend("div", msg, "sandy_withd_msg");
    fillMessage(msg_withd, text, "left");
}

function fillMessage(container, text, side) {
    createAndAppend("p", container, "", text);
    createAndAppend("span", container, "date_time float-" + side, getTime());
    let messagesList = document.getElementById("messagesList")
    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;
}