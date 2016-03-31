"use strict";
    // set up ========================
    const jackrabbit = require('jackrabbit');
    const config = require('./config.js');
    const rabbit = jackrabbit(config.url);
    const exchange = rabbit.default();
    const express  = require('express');
    const app      = express();
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const port = 8081;

    let message = [];

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use('/public',  express.static(__dirname + '/public'));

    app.listen(port);
    console.log("App listening on port", port);

    //AMQP
    function consumeQueue(resultQueue) {
      exchange
        .queue({ name: resultQueue, durable: true})
        .consume(messageReceive);
    }

    function messageReceive(msg, ack) {
      message.push(msg);
      console.log(message);
      ack();
    }

    //listen for messages
    consumeQueue(config.resultQueue);

    //publish a message
    exchange.publish({ msg: 'Hello CloudAMQP2',  }, { key: config.resultQueue });

    app.get('/', function(req, res) {
      res.sendfile('./public/index.html');
    });

    app.get('/workqueue', function(req, res) {
      res.json(message); // return all todos in JSON format
    });
