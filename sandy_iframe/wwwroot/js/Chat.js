"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg;
    var p = document.createElement("p");
    p.textContent = encodedMsg;
    var messagesList = document.getElementById("messagesList");
    messagesList.appendChild(p);
    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var inputBox = document.getElementById("messageInput");
    var message = inputBox.value;
    inputBox.value = "";
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});