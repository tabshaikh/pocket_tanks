var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require("path");

var path1 = path.join(__dirname,"\..");
app.get('/',function(req, res) {
    res.sendFile(path1 + '/Client/index.html');
});
app.use('/Client',express.static(path1 + '/Client'));
 
serv.listen(process.env.PORT || 8000);
console.log("Server started.");
 
var SOCKET_LIST = {};
 
var PLAYERS_LIST = {};

PLAYERS_LIST.onConnect = function(data){
    var id = data.firebaseUser.uid;
    var name = data.firebaseUser.displayName;
    var player ={
        "id" : id,
        "name" : name,
        "angle" : undefined,
        "power" : undefined,
        "tankX" : undefined,
        "tankY" : undefined,
        "control" : undefined,
        "state" : undefined,
        "round" : undefined,
        "game_type" : undefined,
        "status" : undefined,
        "bulletX" : undefined,
        "bulletY" : undefined
    };
    console.log(player);
    PLAYERS_LIST[id]= player;
}
PLAYERS_LIST.onDisconnect = function(data){
    delete PLAYERS_LIST[data.id];
}
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
   
    socket.on('signInSuccess',function(data){
        PLAYERS_LIST.onConnect(data);
        socket.id = data.firebaseUser.uid;
        SOCKET_LIST[socket.id] = socket;
    });

    socket.on('signOutSuccess',function(data){
        delete SOCKET_LIST[data.id];
        console.log("LogOut " + PLAYERS_LIST[data.id].name);        
        PLAYERS_LIST.onDisconnect(data);
    });
   
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        if(PLAYERS_LIST[socket.id] != undefined)
            console.log("Disconnected " + PLAYERS_LIST[socket.id].name);        
        PLAYERS_LIST.onDisconnect(socket);
    });  
});
 
setInterval(function(){
    var pack = {
        player:PLAYERS_LIST,
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('onlinePlayers',pack);
    }
},1000);