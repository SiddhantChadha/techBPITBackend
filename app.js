const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



io.on('connection', (socket) => {
    console.log('a user connected');

    const user = socket.handshake.query.userId;
    
    socket.join(user);

    socket.on('msg', (msg,receiver,callback) => {
        
        io.to(receiver).emit("msg",msg);
        callback({
            status: "message delivered"
        });

    });

});

server.listen(process.env.PORT,()=>{
    console.log("Server started");
})