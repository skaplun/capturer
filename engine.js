var Nightmare = require("nightmare");
var Promise = require("bluebird")
var request = require('request');
var fs = require('fs'),
path = require('path');

var util = {
    
    isUrlValid : function(url) {
        return request(url, function (error, response, body) {
            return !error && response.statusCode == 200 ? true : false;
            })
    },
    getDirectories : function(srcpath){
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
}

var engine = {
    
    baseImageSetup : function(url){
        
        var userDirectories;
        var location;
        
        if(!util.isUrlValid(url)) 
            return [false, 'url']
        
        userDirectories = util.getDirectories(__dirname);
        var loc = './static/' + url.split('.')[1];
        location = __dirname + '/static/' + url.split('.')[1];
        
        if (!fs.existsSync(location)) {
            fs.mkdirSync(location);
            return loc;
        }else{
            return loc
        }
        
    },
    
    getBaseImage : function(url, settings) {
        return new Promise(function(resolve, reject) {
            
            var setupComplete = engine.baseImageSetup(url)
            
            if(!setupComplete[0]) {
                if(setupComplete[1] === 'url') reject({type: 'error', text: 'invalid url'});
            }
            
            var nightmare = new Nightmare();
            nightmare
                .viewport(settings.width, 3000)
                .goto('http://' + url)
                .wait()
                .screenshot(setupComplete + '/init.png')
                .run(function(){
                    return resolve(setupComplete + '/init.png')
                });
        });
       
    },
    
    viewportFn : function(nightmare,data) {
        return nightmare.viewport(data[1], data[2]);
    },
    
    clickFn : function(nightmare, data){
        return nightmare.click(data);
        
    },
    
    screenshotFn : function(nightmare, data){
        return nightmare.screenshot(data);
    },
    
    gotoFn : function(nightmare, data) {
        return nightmare.goto(data);
    },
    
    runFn : function(nightmare, callback) {
        return nightmare.run(callback);
        
    },
    
    construct : function(localFuncs, data){
        
        var nightmare = new Nightmare();

        localFuncs.forEach(function(key, index) {

           key(nightmare, data[index])
            
        })
        
        nightmare.goto('http://www.google.com')
        nightmare.screenshot('static/second.png')
        nightmare.run(function(){
            console.log(arguments)
            console.log('done')
        });
        
        
    },
    
    processRule : function(data){
        var localFuncs = [];
        var url = data.url;
        var allFuncs = {
            'viewport': engine.viewportFn, 
            'click' : engine.clickFn, 
            'screenshot' : engine.screenshotFn, 
            'goto': engine.gotoFn
            
        };
        
        
        delete data.url
        
        Object.keys(data).forEach(function(key) {
            var arr = data[key]
            if(Object.keys(allFuncs).indexOf(arr[0]) !== -1) {
                localFuncs.push(allFuncs[arr[0]]);
            } 
            
        })
        
        engine.construct(localFuncs, data, url);
        
        
    }
    
}

module.exports = engine;