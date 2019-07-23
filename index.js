const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const socketio   = require('socket.io');
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

const port = process.env.PORT || 3333;

var server = http.createServer(app);

const websocket = socketio(server);


var users = new ChatUsers();

websocket.on('connection', (socket) => {
    console.log('New user connected');
    //New User Joined
    socket.on('new user', (query, callback)=>{
		var rooms = users.getRoomList();
		callback(rooms);
	})

})

server.listen(port, () => {
    console.log("Server is running on port 3333");
});
