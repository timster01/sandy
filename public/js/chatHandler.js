var socket = undefined

$(document).ready(() => {
    socket = io.connect(process.env.THISAPP + ":" + process.env.PORT) //must be changed to docker container adress for production

    socket.on('connect', () => {
        console.log("Socket succesfully created: " + socket.id)

        socket.on("sendMessage", (data) => {
            console.log(data)
            createServerMessage(data.user.name, data.user.avatar, data.message)
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
    fillMessage(msg, "You", text, "right");
}

function createServerMessage(name, avatar, text) {
    let messagesList = document.getElementById("messagesList")
    let msgBox = createAndAppend("div", messagesList, "sandy_incoming_msg");

    let img_div = createAndAppend("div", msgBox, "sandy_msg_img");
    let img = createAndAppend("img", img_div);
    img.src = avatar;
    img.alt = "avatar";

    let msg = createAndAppend("div", msgBox, "sandy_msg");
    let msg_withd = createAndAppend("div", msg, "sandy_withd_msg");
    fillMessage(msg_withd, name, text, "left");
}

function fillMessage(container, name, text, side) {
    createAndAppend("span", container, "date_time text-" + side, "<b>" + name + "</b> " + getTime());
    createAndAppend("p", container, "", text);
    let messagesList = document.getElementById("messagesList")
    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;
}