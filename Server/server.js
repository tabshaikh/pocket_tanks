var express = require('express');
var app = express();
var serv = require('http').Server(app);

var path = "/home/aakar/Pocket Tanks/"
app.get('/',function(req, res) {
    res.sendFile(path + '/Client/index.html');
});
app.use('/Client',express.static(path + '/Client'));
 
serv.listen(8000);
console.log("Server started.");
 
var SOCKET_LIST = {};
 
var PLAYERS_LIST = {};

PLAYERS_LIST.onConnect = function(data){
    var id = data.firebaseUser.uid;
    var name = data.firebaseUser.displayName;
    var player ={"id":id,"name":name};
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
        PLAYERS_LIST.onDisconnect(data);
        console.log("LogOut");
    });
   
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        PLAYERS_LIST.onDisconnect(socket);
        console.log("Disconnected");
    });  
});
 
// setInterval(function(){
//     var pack = {
//         player:PLAYERS_LIST,
//     }
//     for(var i in SOCKET_LIST){
//         var socket = SOCKET_LIST[i];
//         socket.emit('newPositions',pack);
//     }
// },1000/25);