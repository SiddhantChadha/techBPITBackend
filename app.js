const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { start } = require('./services/chat.js')
require('dotenv').config();

app.use(express.json());

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

const messageSchema = require('./models/Message')
const { ROLE } = require('./config')
const { signUp, login, refresh } = require('./controllers/auth')
const verifyOTP = require('./controllers/verifyOTP')
const { allUsers,searchUser} = require('./controllers/allUsers')
const { directMessage,groupMessage} = require('./controllers/message');
const { createGroup,getGroups,joinGroup,getJoinedGroup,getGroup } = require("./controllers/group")
const { createPost,getAllPost } = require('./controllers/post.js')
const { recentPersonalChat,recentGroupChat } = require('./controllers/recentChat.js');
const { getUser,updateUser } = require('./controllers/profile.js')
const { verifyToken } = require('./middleware/jwtAuth');
const { authRole } = require('./middleware/roleAuth')
const { createProject,deleteProject } = require('./controllers/project')


app.post('/signup', signUp);
app.post('/verify', verifyOTP);
app.get('/users',verifyToken,allUsers);
app.post('/login',login)
app.post('/auth/access_token/renew',refresh)

app.post('/directMessage',verifyToken,directMessage)

app.post('/createGroup',createGroup);
app.post('/getGroups',verifyToken,getGroups);
app.post('/joinGroup',joinGroup)
app.post('/getJoinedGroup',verifyToken,getJoinedGroup)

app.post('/groupMessage',verifyToken,groupMessage)

app.post('/createPost',verifyToken,createPost)

app.post('/recentPersonalChat',verifyToken,recentPersonalChat);
app.post('/recentGroupChat',verifyToken,recentGroupChat);
app.get('/getAllPost',verifyToken,getAllPost)

app.get('/user/:userId',verifyToken,getUser)
app.get('/group/:groupId',getGroup)
app.get('/searchUser',searchUser)

app.patch('/updateUser',updateUser)

app.post('/updateUser',createProject)
app.delete('/updateUser',deleteProject)

server.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})
