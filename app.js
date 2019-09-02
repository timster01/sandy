const logger = require('morgan');
const httpError = require('http-errors');
const express = require("express")
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 8000

const utils = require('./private/utils.js')
const Chatbot = require('./private/chatbot/chatbot.js')

app.set('view engine', 'pug') //Specify and load view engine
app.set('views', path.join(__dirname, 'views')) //Declare views folder
app.use(express.static(path.join(__dirname, 'public'))) //Declare public folder
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(logger('dev'));

var connectedClients = [];

io.on('connection', (socket) => {
  console.log("Client connected: " + socket.id)

  let user = {}
  user.bot = new Chatbot()
  user.socket = socket
  connectedClients.push(user)

  socket.on('disconnect', function () {
    console.log("Client disconnected: " + socket.id)

    let i = connectedClients.findIndex(user => user.socket === socket)
    connectedClients.splice(i, 1)

    console.log("Users left: " + connectedClients.length)
  })

  socket.on('sendMessage-' + socket.id, (data) => {
    console.log("Received message from " + socket.id + " with message: " + data.message)

    let user = connectedClients.find(user => user.socket === socket)
    let answer = user.bot.parseMessage(data.message)
    io.sockets.emit('sendMessage-' + socket.id, { message: answer })
  })
})

app.get('/', function (request, response) {
  response.render('index', { chatbotName: Chatbot.botName })
})

http.listen(port, () => {
  console.log(`Listening to requests on port: ` + port)
})

//Middleware for error handing
/*app.use(function (error, request, response, next) {
  //Set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  //Render the error page
  response.status(error.status || 500);
  response.render('error');
})*/