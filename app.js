const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { start } = require('./services/chat.js')
const cors= require('cors');
require('dotenv').config();


(async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
		start(io);
    } catch (e) {
        console.log(e.message)
        process.exit();
    }
})();

const { verifyToken } = require('./middleware/jwtAuth');
const { authRole } = require('./middleware/roleAuth')

const authRoute = require('./routes/auth')
const projectRoute = require('./routes/project')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const groupRoute = require('./routes/group')
const chatRoute = require('./routes/chat')
const exploreRoute = require('./routes/explore')
const adRoute = require('./routes/ad')


app.use(cors());
app.use(express.json());

app.use('/auth',authRoute)
app.use('/user',verifyToken,userRoute)
app.use('/post',verifyToken,postRoute)
app.use('/group',verifyToken,groupRoute)
app.use('/project',verifyToken,projectRoute)
app.use('/chat',verifyToken,chatRoute)
app.use('/explore',verifyToken,exploreRoute)
app.use('/ad',verifyToken,adRoute)

server.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})
