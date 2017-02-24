
var Sockets = function(http) {
var io = require('socket.io')(http);


this.listen = function () {
	console.log("listening sockets...")
	var admin = io
	              .of('/sockets/admin')
	              .on('connection', function(socket) {


	              	socket.on('push', function(data) {
	                    admin.emit('entry', data);
	              	})



	              });            
	          }

     }

module.exports = Sockets;          