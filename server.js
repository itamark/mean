// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var cors = require('cors')
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var passport = require('passport');
var session = require('express-session');
var LinkedInStrategy = require('passport-linkedin').Strategy;
// configuration =================

// load the config
var database = require('./config/database');

mongoose.connect(database.url, database.options);     // connect to mongoDB database on modulus.io

var LINKEDIN_API_KEY = "777e88m15vltcr";
var LINKEDIN_SECRET_KEY = "em5BATHfg0Zv5uwO";

app.use(express.static(__dirname + '/public1'));                 // set the static files location /public1/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).


app.use(passport.initialize());
app.use(session());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
passport.use(new LinkedInStrategy({
        consumerKey: LINKEDIN_API_KEY,
        consumerSecret: LINKEDIN_SECRET_KEY,
        callbackURL: "http://localhost:4000/auth/linkedin/callback"
    },
    function(token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's LinkedIn profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the LinkedIn account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));




// routes ======================================================================
require('./server/routes')(app);
// api ---------------------------------------------------------------------





// listen (start app with node server.js) ======================================
app.listen(4000);
console.log("App listening on port 4000");
