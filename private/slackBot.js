const request = require('request-promise')

const slackWebAppHook = ""
const skackAppBotAccessToken = ""
const slackAppId = ""
const slackAppWorkspaceId = ""
const slackAppToken = ""

var slackChatsCount = 0
var slackChats = {}
var slackWorkspaceMembers = {}

//Add support for multiple questions per user at the same time.
//Add a reload mechanism so that if the app can't find a workspace member in the workspace members
//object, that it then reloads the users from the workspace to retrieve the name.

function processPOSTRequest(request, response, io, connectedClients) {
    let payload = request.body

    if (payload.challenge) {
        console.log("Challenge POST request from Slack received.")
        response.statusCode = 200
        response.contentType = 'text/plain'
        response.send({ challenge: payload.challenge })
        return true
    }

    response.sendStatus(200)
    if (payload.api_app_id == slackAppId && payload.team_id == slackAppWorkspaceId && payload.token == slackAppToken) {
        console.log("POST request from Slack: " + JSON.stringify(payload))

        if (payload.event.type == "message") {
            if (!payload.event.thread_ts && payload.event.bot_id) {
                let authorName = payload.event.attachments[0].author_name.split(" ")
                let socketId = authorName[authorName.length - 1]
                slackChats[socketId] = payload.event.ts
            } else if (payload.event.thread_ts) {
                let parentTs = payload.event.thread_ts

                let socketId = undefined
                for (let key in slackChats) {
                    if (slackChats[key] == parentTs) {
                        socketId = key
                        break
                    }
                }

                if (socketId == undefined) {
                    console.log("Socket undefined for " + parentTs)
                    return true
                }

                let user = slackWorkspaceMembers[payload.event.user]
                if (user == undefined) {
                    user.name = "Human"
                    user.avatar = "images/sandy.png"
                }
                connectedClients[socketId].socket.emit('sendMessage', { 
                    user : user,
                    message: payload.event.text 
                })
            }
        }
        return true
    }
    return false
}

function deleteSlackChatRecord(socketId) {
    if(slackChats[socketId]){
        console.log("Deleted slack chat")
        delete slackChats[socketId]
        slackChatsCount--
    }
    return slackChatsCount
}

function insertSlackChatRecord(socketId) {
    if (slackChats[socketId] == undefined) {
        console.log("Added slack chat")
        slackChats[socketId] = ""
        slackChatsCount++
    } else {
        slackChats[socketId] = ""
        console.log("Add support for multiple questions per user!")
    }
    return slackChatsCount
}

async function sendBotMessageToSlack(socketId, message) {
    const bodyContent = {
        "attachments": [
            {
                "color": "#FF0000",
                "author_name": "New question from " + socketId,
                "text": message,
                "footer": "Respond to this thread to help the user."
            }
        ]
    }

    const options = {
        url: slackWebAppHook,
        method: 'POST',
        body: bodyContent,
        json: true
    }

    request(options)
        .then(function (repos) {
            //console.log();
        })
        .catch(function (error) {
            console.log(error)
        })
}

async function retrieveWorkspaceUsersData() {
    const options = {
        uri: 'https://slack.com/api/users.list',
        method: 'GET',
        qs: { token: skackAppBotAccessToken },
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        json: true
    }

    request(options)
        .then(function (data) {
            if (!data.ok || data.ok != true) {
                console.log("Error retrieving users: " + JSON.stringify(data))
                return
            }
            console.log("Succesfully retrieved workspace data of " + data.members.length + " members!")
            for (let i = 0; i < data.members.length; i++) {
                let profile = data.members[i].profile
                let user = {}
                user.name = profile.real_name
                user.avatar = profile.image_192
                slackWorkspaceMembers[data.members[i].id] = user
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

module.exports.retrieveWorkspaceUsersData = retrieveWorkspaceUsersData
module.exports.sendBotMessageToSlack = sendBotMessageToSlack
module.exports.insertSlackChatRecord = insertSlackChatRecord
module.exports.deleteSlackChatRecord = deleteSlackChatRecord
module.exports.processPOSTRequest = processPOSTRequest
