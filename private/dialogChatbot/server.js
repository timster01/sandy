
var bodyParser = require("body-parser");
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});
const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('../../sandy-account.json');
//functions
function GetName(name, lastname){

    console.log(name,lastname);
};

//Setup server on port 3000 using express
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});
var name;
var lastname;

var GetName = function(name,lastName) {
    console.log("GetNameFunction");
    this.name = name;
    this.lastname = lastName;
};

var GetName = function(name,lastName) {
    console.log("GetNameFunction");
    this.name = name;
    this.lastname = lastName;
};

// routing (Endpoints)
app.post("/visa", function(req, res) {
    console.log(req.body);
    var responseObject = req.body;
    switch(responseObject.queryResult.intent["displayName"]) {
        case "GetName":
            GetName(responseObject.queryResult.parameters["name"],responseObject.queryResult.parameters["name"]);
            break;
        case y:
            // code block
            break;
        default:
        // code block
    }

});

