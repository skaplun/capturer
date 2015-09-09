var express = require('express');
var bodyParser = require('body-parser');
var phantom = require('phantom');
var Promise = require("bluebird")

var getBaseImage = require("./engine.js").getBaseImage;
var processRule = require("./engine.js").processRule;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/js', express.static(__dirname + '/client/js'));
app.use(express.static(__dirname + '/client'));
app.use('/static', express.static(__dirname + '/static'));



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res){
    var data = req.body
    if(data.stage === '0') {

        getBaseImage(data.url, data.settings).then(function(image){
            res.send(image);
        })    
        
    } 
    
});

app.post('/chunk', function(req, res) {
    processRule(req.body)
    
    // .then(function(argument) {
    //     res.send('static/' + argument);
        
    // })
});



app.listen(process.env.PORT, process.env.IP);