var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors());
var http = require('http').Server(app);
var path = require('path');
var gulp_task = require('./Server/task');
var Server = new gulp_task(app, http);
var sockets_task = require('./application/sockets/sockets')
var Sockets = new sockets_task(http);
var bodyParser = require('body-parser');
var port = 3000;
var api = require('./application/router/api_router');



// app.set('views', path.join(__dirname, 'ui'));
// // app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'ui')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//api's router
app.use('/api/notifications', api);





Server.start(port);
Sockets.listen();



