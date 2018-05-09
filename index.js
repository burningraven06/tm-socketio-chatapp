const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
socket_connections = [];

server.listen(3000, () => {
	console.log('server started');
});

app.get('/', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	socket_connections.push(socket);
	console.log('Total Sockets : ', socket_connections.length, 'Socket ID: ', socket.id);

	socket.on('disconnect', function(){
		socket_connections.splice(socket_connections.indexOf(socket),1);
		console.log('Disconnected. Sockets now', socket_connections.length);
	})

	socket.on('send-message', function(data){
		data.user = socket.user
		io.sockets.emit('new-message', data);
	});

	socket.on('send-user', function(data){
		socket.user = data.user;
		io.sockets.emit('new-user', data);

	})
	
});

