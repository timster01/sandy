"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var messagesList;

$(document).ready(function () {
    messagesList = document.getElementById("messagesList");
 
    connection.start().then(function () {
        document.getElementById("sendButton").disabled = false;
        connection.invoke("StartMessage").catch(function (err) {
            return console.error(err.toString());
        });
    }).catch(function (err) {
        return console.error(err.toString());
    });
    

    var input = document.getElementById("messageInput");
    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("sendButton").click();
        }
    });
});

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    createSandyMessage(msg);
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var inputBox = document.getElementById("messageInput");
    var message = inputBox.value;
    if (message.length > 0) {
        inputBox.value = "";
        createUserMessage(message, "user");
        connection.invoke("SendMessage", message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    event.preventDefault();
});

function createUserMessage(text) {
    var msgBox = createAndAppend("div", messagesList, "user_msg");
    var msg = createAndAppend("div", msgBox, "sent_msg");
    fillMessage(msg, text, "right");
}
function createSandyMessage(text) {
    var msgBox = createAndAppend("div", messagesList, "sandy_incoming_msg");

    var img_div = createAndAppend("div", msgBox, "sandy_msg_img");
    var img = createAndAppend("img", img_div);
    img.src = "images/sandy.png";
    img.alt = "Sandy";

    var msg = createAndAppend("div", msgBox, "sandy_msg");
    var msg_withd = createAndAppend("div", msg, "sandy_withd_msg");
    fillMessage(msg_withd, text, "left");
}
function fillMessage(container, text, side) {
    createAndAppend("p", container, "", text);
    createAndAppend("span", container, "date_time float-" + side, getTime());

    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;

}

