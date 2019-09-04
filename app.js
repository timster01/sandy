const logger = require('morgan');
const httpError = require('http-errors');
const express = require("express")
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 8000

const Chatbot = require('./private/chatbot/chatbot.js')
const slackBot = require('./private/slackBot.js')

app.set('view engine', 'pug') //Specify and load view engine
app.set('views', path.join(__dirname, 'views')) //Declare views folder
app.use(express.static(path.join(__dirname, 'public'))) //Declare public folder
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(logger('dev'));

var connectedClients = {}
var clientsCount = 0

io.on('connection', (socket) => {
  let user = {}
  user.chatBot = new Chatbot()
  user.socket = socket
  connectedClients[socket.id] = user
  clientsCount++
  console.log("Client connected: " + socket.id + " Now online: " + clientsCount)

  socket.on('disconnect', function () {
    console.log("Client disconnected: " + socket.id)

    delete connectedClients[socket.id]
    clientsCount--

    let slackChatsCount = slackBot.deleteSlackChatRecord(socket.id)
    console.log("Users left: " + clientsCount + " Slack handles left: " + slackChatsCount)
  })

  socket.on('sendMessage-' + socket.id, (data) => {
    console.log("Received message from " + socket.id + " with content: " + data.message)

    let result = connectedClients[socket.id].chatBot.parseMessage(data.message)
    socket.emit('sendMessage', { message: result.message })

    if (!result.success) {
      slackBot.insertSlackChatRecord(socket.id)
      slackBot.sendBotMessageToSlack(socket.id, data.message)
    }
  })
})

app.get('/', function (request, response) {
  response.render('index')
})

app.post('/', function (request, response) {
  if (!slackBot.processPOSTRequest(request, response, io, connectedClients)) {
    console.log("Received POST request from unknown source. Data: " + JSON.stringify(request.body))
  }
})

http.listen(port, () => {
  console.log("Listening to requests on port: " + port)
  slackBot.retrieveWorkspaceUsers()
})