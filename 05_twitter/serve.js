var express = require('express');
var session = require('express-session');
var Flutter = require('flutter');
var Twitter = require('twitter');
var keys = require('./oauth.json');

var HOST = "127.0.0.1";
var PORT = process.env.PORT || 8080;

var app = express();
app.use(session({resave:true, saveUninitialized:false, secret:'bangbangbang'}));

// serve login.html at /
app.get('/', function(req, res){
    res.sendFile("static/login.html", {root:'./'});
});

// when not logged in, redirect to login
app.get('/bang.html', function(req, res){
    if("oauthAccessToken" in req.session){
        res.sendFile("static/bang.html", {root:'./'});
    }
    else{
        res.redirect('/');    
    }
});

// this is to keep track of separate users' names and tweets
var userInfo = {};

var flutter = new Flutter({
    cache: false,
    consumerKey: keys['CONSUMER_KEY'],
    consumerSecret: keys['CONSUMER_SECRET'],
    loginCallback: 'http://'+HOST+':'+PORT+'/callback',

    // called eventually once user is logged in
    authCallback: function(req, res, next) {
        if (req.error) {
            console.log(req.error);
            return;
        }

        // initialize the session information
        userInfo[req.sessionID] = {
            screen_name: '',
            lastTweet: ''
        };

        // get a twitter client
        userInfo[req.sessionID].tClient = new Twitter({
            consumer_key: keys['CONSUMER_KEY'],
            consumer_secret: keys['CONSUMER_SECRET'],
            access_token_key: req.session.oauthAccessToken,
            access_token_secret: req.session.oauthAccessTokenSecret
        });

        // get user name
        userInfo[req.sessionID].tClient.get('account/settings', function(error, response){
            if(error){
                return;
            }
            userInfo[req.sessionID].screen_name = response.screen_name;

            // set up a stream and track tweets that mention me
            userInfo[req.sessionID].tClient.stream('statuses/filter', {track: '@'+response.screen_name}, function(stream){
                stream.on('data', function(tweet) {
                    console.log(tweet.text);
                    userInfo[req.sessionID].lastTweet = tweet;
                });

                stream.on('error', function(error) {
                    console.log(error);
                });
            });
        });

        // and redirect user there, now that they are logged in
        res.redirect('/bang.html');
    }
});

app.get('/connect', flutter.connect);
app.get('/callback', flutter.auth);

// The tweet endpoint
app.get('/tweet', function(req, res){
    if("usr" in req.query){
        for(var key in userInfo){
            if(userInfo[key].screen_name.toLowerCase() == req.query['usr'].toLowerCase() && userInfo[key].lastTweet != ''){
                res.send(JSON.stringify({id_str:userInfo[key].lastTweet.id_str}));
                return;
            }
        }
        res.send(JSON.stringify({error:"No such user"}));
    }
    else if(req.sessionID in userInfo){
        res.send(userInfo[req.sessionID].lastTweet);
    }
    else{
        res.send(JSON.stringify({error:"Not logged in"}));
    }
});

app.listen(PORT);
