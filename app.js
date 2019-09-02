const logger = require('morgan');
const httpError = require('http-errors');
const express = require("express")
const path = require('path')
const app = express()
const port = 8000

const chatbot = require('./private/chatbot/chatbot')

app.set('view engine', 'pug') //Specify and load view engine
app.set('views', path.join(__dirname, 'views')) //Declare views folder
app.use(express.static(path.join(__dirname, 'public'))) //Declare public folder
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(logger('dev'));

//Middleware for error handing
app.use(function (error, request, response, next) {
  //Set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  //Render the error page
  response.status(error.status || 500);
  response.render('error');
})

app.get('/', function (request, response) {
  response.render('index', { chatbotName: chatbot.getName() })
})

app.post('/api/chatbot', function (request, response) {
  console.log("Message received: " + request.body.message)

  let answer = chatbot.parseMessage(request.body.message)
  response.json({ message: answer })
})

app.listen(port, () => {
  console.log(`Listening to requests on port: ` + port)
})
