/* initialize the required libraries */
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

/* These two arrays is for to store  */
users = []; /* number of users */
connections = []; /* number of connection */

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

/* io connection starts */

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    /* TO DisConnect */
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets disconnected', connections.length);
    });

    /* To send messages */
    socket.on('sendmessage', (data) => {
        io.sockets.emit('newmessage', { msg: data, user: socket.username });
    });

    /* New User */
    socket.on('newuser', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames() {
        io.sockets.emit('getusers', users);
    }
});

server.listen(8080, () => {
    console.log("Server is running on port 8080, 'http://localhost:8080'");
});