"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

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

var messagesList;
var datetime;

$(document).ready(function () {
    messagesList = document.getElementById("messagesList");
    datetime = new Date();
    connection.start().then(function () {
        document.getElementById("sendButton").disabled = false;
        connection.invoke("SendMessage", "request start message").catch(function (err) {
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

function createUserMessage(text) {
    var msgBox = createAndAppend("div", messagesList, "user_msg");
    var msg = createAndAppend("div", msgBox, "sent_msg");
    createAndAppend("p", msg, "", text);
    createAndAppend("span", msg, "date_time float-right", datetime.toLocaleTimeString());

    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;
}
function createSandyMessage(text) {
    var msgBox = createAndAppend("div", messagesList, "sandy_incoming_msg");

    var img_div = createAndAppend("div", msgBox, "sandy_msg_img");
    var img = createAndAppend("img", img_div);
    img.src = "https://ptetutorials.com/images/user-profile.png";
    img.alt = "Sandy";

    var msg = createAndAppend("div", msgBox, "sandy_msg");
    var msg_withd = createAndAppend("div", msg, "sandy_withd_msg");
    createAndAppend("p", msg_withd, "", text);
    createAndAppend("span", msg_withd, "date_time float-left", datetime.toLocaleTimeString());

    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;
}

function createElement(type, className = "", html = "") {     // returns a new html elemnt with specified type and attributes
    var item = document.createElement(type);
    if (className.length > 0)
        item.className = className;
    item.innerHTML = html;
    return item;
}

function createAndAppend(type, parent, className = "", html = "") {  // create a new html element and add it to the parent, with specified attributes
    var item = createElement(type, className, html);
    parent.append(item);
    return item;                                            // still return the item, because we than we can still add items to that
}
