const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



io.on('connection', (socket) => {
    const user = socket.handshake.query.userId;
    console.log(user + 'connected');
    socket.join(user);

    socket.on('join-room',(roomId)=>{
        socket.join(roomId);
    })

    socket.on('msg', (msg,receiver,callback) => {
        
        socket.to(receiver).emit("msg",msg);

        callback({
            status: "message delivered"
        });

    });

    socket.on('grp-msg', (msg,receiver,callback) => {
        
        socket.to(receiver).emit(receiver + "-msg",msg);

        callback({
            status: "message delivered"
        });

    });

});

server.listen(process.env.PORT,()=>{
    console.log("Server started");
})