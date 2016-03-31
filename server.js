// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

// load the config
var database = require('./config/database');

mongoose.connect(database.url, database.options);     // connect to mongoDB database on modulus.io

//var LINKEDIN_API_KEY = "777e88m15vltcr";
//var LINKEDIN_SECRET_KEY = "em5BATHfg0Zv5uwO";

app.use(express.static(__dirname + '/public1'));                 // set the static files location /public1/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());





// routes ======================================================================
require('./server/routes')(app);
// api ---------------------------------------------------------------------





// listen (start app with node server.js) ======================================
app.listen(4000);
console.log("App listening on port 4000");
