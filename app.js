const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config();

app.use(express.json());

(async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (e) {
        console.log(e.message)
        process.exit();
    }
})();

const { signUp, login } = require('./controllers/auth')
const verifyOTP = require('./controllers/verifyOTP')
const allUsers = require('./controllers/allUsers')

app.get('/', (req, res) => {
    res.send("Dummy route");
})

app.post('/signup', signUp);
app.post('/verify', verifyOTP);
app.get('/users', allUsers);
app.post('/login',login)

io.on('connection', (socket) => {
    const user = socket.handshake.query.userId;
    console.log(user + 'connected');
    socket.join(user);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    })

    socket.on('msg', (msg, receiver, callback) => {

        console.log(msg);
        socket.to(receiver).emit(msg.sender +"-msg", msg);

        callback({
            status: "message delivered"
        });

    });

    socket.on('grp-msg', (msg, receiver, callback) => {

        socket.to(receiver).emit(receiver + "-msg", msg);

        callback({
            status: "message delivered"
        });

    });

});

server.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})