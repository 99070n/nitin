const express = require("express");
const path = require("path");
// const bodyparser = require("body-parser");
const app = express();

const server = require('http').createServer(app);
const{Server} = require("socket.io");
const io = new Server(server);

const users = [];
const port = 3000; 




io.sockets.on('connection',(socket)=>{
    socket.on('set user',(data,callback)=>{
        if(users.indexOf(data)!= -1){
            callback(false);    
        }
        else{
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsers(); 
        }
    });

    socket.on('send message',(data)=>{
        io.sockets.emit('show message',({ msg:data, user:socket.username}));
    });

    socket.on('discoonect',(data)=>{
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsers();
    })
    function updateUsers(){
        io.sockets.emit('users',users);
    };


});


// views engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// static path
app.use(express.static(path.join(__dirname,'public')));

// //bodyparser
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({extended:false}));


app.get('/', (req,res,next)=>{
    res.render('index');
});

server.listen(port,()=>{
    console.log("web server is running on port"+" "+ port);
});



