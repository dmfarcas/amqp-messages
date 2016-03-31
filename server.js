"use strict";
  // set up ========================
  const jackrabbit = require('jackrabbit');
  const config = require('./config.js');
  const rabbit = jackrabbit(config.url);
  const exchange = rabbit.default();
  var express = require('express');
  var app = express(); // create our app w/ express
  var morgan = require('morgan'); // log requests to the console (express4)
  var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
  // var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

  let objModel = {
    'key1': 'value1',
    'key2': 'value2',
    'key3': {
      'keyInside': 'valueInside',
      'keyInside2': 'valueInside2',
    },
    'key4': 'value3'
  };

  let contentRequestMessage = objModel;
  let contentResponseMessage = {};
  let workQueue = config.workQueue;
  let resultQueue = config.resultQueue;

  // configuration =================
  const port = 8081;
  app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
  app.use(morgan('dev')); // log every request to the console
  app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()); // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

  // listen (start app with node server.js) ======================================
  app.listen(port);
  console.log("App listening on port", port);

  //publish a message
  exchange.publish({ msg: contentRequestMessage }, { key: workQueue });
  exchange.publish({ msg: contentRequestMessage }, { key: resultQueue });

  //AMQP
  function consumeQueue(nameQueue, resultQueue) {
    const exchangeQueue = exchange.queue({ name: nameQueue, durable: false, arguments: { 'x-message-ttl': 180000 } });
    if (resultQueue) {
      exchangeQueue.consume(messageResponse);
    } else {
      exchangeQueue.consume(messageReceive);
    }
  }

  function messageReceive(msg, ack) {
    contentRequestMessage = msg;
    ack();
  }


  //listen for messages
  consumeQueue(workQueue, false);

  app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
  });

  app.get('/getreqmsq', function(req, res) {
    res.json(contentRequestMessage); // return all todos in JSON format
  });



// consumeQueue(resultQueue, true);
function messageResponse(msg, ack) {
  contentResponseMessage = msg;
  ack();
}

app.get('/getresmsg', function(req, res) {
  res.json(contentResponseMessage); // return all todos in JSON format
});
