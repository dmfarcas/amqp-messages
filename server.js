"use strict";
    // set up ========================
    const jackrabbit = require('jackrabbit');
    const config = require('./config.js');
    const rabbit = jackrabbit(config.url);
    const exchange = rabbit.default();
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    // var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    let message = {};
    // configuration =================
    const port = 8081;
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port", port);
    
    //AMQP
    function consumeQueue(resultQueue) {
      exchange
        .queue({ name: resultQueue, durable: false, arguments: {'x-message-ttl': 180000 }})
        .consume(messageReceive);
    }
    
    function messageReceive(msg,ack) {
      message = JSON.parse(msg.toString());
      ack();
    }
    
    //listen for messages
    consumeQueue(config.workQueue);
    
    //publish a message
    // exchange.publish({ msg: 'Hello CloudAMQP' }, { key: config.resultQueue });

    app.get('/', function(req, res) {
      res.sendfile('./public/index.html');
    });
    
    app.get('/getmessage', function(req, res) {
      res.json(message); // return all todos in JSON format
    });