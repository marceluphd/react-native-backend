const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const socketio = require('socket.io');
const http = require('http');
require('dotenv').config();

const {mongoose} = require("./db/db");

const userController = require("./controllers/userController");
const tournamentController = require("./controllers/tournamentController");

const {generateMessage} = require('./utils/utils');
const {isRealString} = require('./utils/validation');
const {ChatUsers} = require('./utils/ChatUsers');

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userController);
app.use("/tournament", tournamentController);

const server = http.createServer(app);
const io = socketio(server);

const chatUsers = new ChatUsers();

io.on('connection', (socket) => {
    console.log('New user connected');

    const chatRoom = chatUsers.getRoom();

    socket.on('join', (params, callback) => {
        console.log(params);
    		if(!isRealString(params.name)){
    			return callback('Name and room is required');
    		}
      	chatUsers.removeUser(socket.id);
    		callback();
    		socket.join(chatRoom);
    		chatUsers.addUser(socket.id, params.name, chatRoom);
    		io.to(chatRoom).emit('updateUserList', chatUsers.getUserList(chatRoom));
    		socket.broadcast.to(chatRoom).emit('returnMessage', generateMessage('Admin', `${params.name} has joined`));
    		socket.emit('returnMessage', generateMessage('Admin', 'Welcome to chat'));
	  });

    socket.on('createMessage', (data, callback) => {
    		var user = chatUsers.getUser(socket.id);
    		if(user && isRealString(data.text)) {
    			io.to(user.room).emit('returnMessage', generateMessage(user.name, data.text));
    		}
    		callback();
  	});

    socket.on('disconnect', () => {
    		console.log('User disconnected');
    		var user = chatUsers.removeUser(socket.id);
    		if(user) {
    			io.to(user.room).emit('updateUserList', chatUsers.getUserList(user.room));
    			io.to(user.room).emit('returnMessage', generateMessage('Admin', `${user.name} has left.`));
    		}
  	});
});

const port = process.env.PORT || 3333;

server.listen(port, () => {
    console.log("Server is running on port 3333");
});
