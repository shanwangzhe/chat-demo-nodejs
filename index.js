var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var admin = "";

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

io.on('connection', function(socket){
	socket.on('chat message', function(id, msg){
		if(admin != ""){
			admin.join(socket.id);
			io.sockets.connected[admin.id].emit('dialog', socket.id, msg);
		}
		io.sockets.connected[socket.id].emit('chat message', "", msg);
		console.log("client: " + socket.id + " msg:" + msg);
	});
  
	socket.on('admin', function(nickname){
		socket.nickname = nickname;
		admin = socket;
		console.log("admin: " + socket.id);
	});
	
	socket.on('admin message', function(client_id, msg){
		io.sockets.connected[client_id].emit('chat message', client_id, msg);
		io.sockets.connected[admin.id].emit('dialog', client_id, msg);
		console.log("client: " + client_id + " msg:" + msg);
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
