var port = process.env.PORT || 8080;

var express = require('express');

var app = express();
app.use(express.static('static', {index: 'index.html'}));

var currentState = 0;

app.get('/state', function(req, res){
    res.send(JSON.stringify({state:currentState}));
});

app.get('/toggle', function(req, res){
    currentState = 1-currentState;
    res.send(null);
});

app.listen(port);
