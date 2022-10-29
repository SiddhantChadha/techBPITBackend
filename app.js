const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app.get('/',(req,res){
//     res.send("hi");
// })

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('msg', (msg,callback) => {
        callback({
            status: "got your msg"
          });
    });

});

server.listen(process.env.PORT,()=>{
    console.log("Server started");
})