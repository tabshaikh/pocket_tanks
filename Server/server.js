var express = require('express');
var app = express();
var path = require("path");
var fs = require('fs');
var https = require('https');

var port = process.env.PORT || 8000;

var path1 = path.join(__dirname,"\..");
app.get('/',function(req, res) {
    res.sendFile(path1 + '/Client/index.html');
});
app.use('/Client',express.static(path1 + '/Client'));

const httpsOptions = {
    key: fs.readFileSync(path1 + '/Server/security/localhost.key'),
    cert: fs.readFileSync(path1 + '/Server/security/localhost.cert'),
    requestCert: false,
    rejectUnauthorized: false
}
const server = https.createServer(httpsOptions,app);
server.listen(port, () => {
    console.log('server running at ' + port)
});

var SOCKET_LIST = {};

var PLAYERS_LIST = {};

PLAYERS_LIST.onConnect = function(data){
    var id = data.firebaseUser.uid;
    var name = data.firebaseUser.displayName;
    var player ={
        "id" : id,
        "name" : name,
        "control" : undefined,
        "state" : undefined,
        "round" : undefined,
        "game_type" : undefined,
        "status" : undefined,
        "otherPlayerId" : undefined
    };
    console.log(player);
    PLAYERS_LIST[id]= player;
}
PLAYERS_LIST.onDisconnect = function(data){
    delete PLAYERS_LIST[data.id];
}

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){
    
    socket.on('signInSuccess',function(data){
        console.log("signInSuccess");
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
        var temp_player = PLAYERS_LIST[socket.id];
        if(PLAYERS_LIST[socket.id] != undefined)
        console.log("Disconnected " + PLAYERS_LIST[socket.id].name);        
        PLAYERS_LIST.onDisconnect(socket);
        ///////////////////////////////////////////
        if(temp_player != undefined && temp_player.otherPlayerId != undefined) { 
            console.log("Disconnecting from ", PLAYERS_LIST[temp_player.otherPlayerId].name); 
            PLAYERS_LIST[temp_player.otherPlayerId].otherPlayerId = undefined; 
            var soc = SOCKET_LIST[temp_player.otherPlayerId];
            if(soc != null) { 
                sendTo(soc, { 
                    type: "leave" 
                }); 
            }
        }
    });
    
    socket.on('askConnection',function(data){
        var socket1 = SOCKET_LIST[data.id];
        socket1.emit('incommingConnection',PLAYERS_LIST[socket.id]);
    });
    
    socket.on('approvedConnection',function(data){
        var socket1 = SOCKET_LIST[data.player1.id];
        socket1.emit('connectionEstablish',PLAYERS_LIST[socket.id]);
    });

    socket.on('data_transfer', function(data){
        if(PLAYERS_LIST[socket.id] != undefined && PLAYERS_LIST[socket.id].otherPlayerId != undefined){
            var socket1 = SOCKET_LIST[PLAYERS_LIST[socket.id].otherPlayerId];
            socket1.emit('data_receive',data);
        }
    })
    
    //when server gets a message from a connected user 
    socket.on('message1', function(message) { 
        
        var data; 
        
        //accepting only JSON messages 
        try { 
            data = JSON.parse(message); 
        } catch (e) { 
            console.log("Invalid JSON"); 
            data = {}; 
        }
        
        //switching type of the user message 
        switch (data.type) {
            
            case "offer": 
            //for ex. UserA wants to call UserB 
            console.log("Sending offer to: ", PLAYERS_LIST[data.playerId].name);
            
            //if UserB exists then send him offer details 
            var soc = SOCKET_LIST[data.playerId]; 
            
            if(soc != null) { 
                //setting that UserA connected with UserB 
                PLAYERS_LIST[socket.id].otherPlayerId = data.playerId; 
                
                sendTo(soc, { 
                    type: "offer", 
                    offer: data.offer, 
                    id: socket.id 
                }); 
            }
            
            break;
            
            case "answer": 
            console.log("Sending answer to: ", PLAYERS_LIST[data.playerId].name); 
            //for ex. UserB answers UserA 
            var soc = SOCKET_LIST[data.playerId];
            
            if(soc != null) { 
                PLAYERS_LIST[socket.id].otherPlayerId = data.playerId; 
                sendTo(soc, { 
                    type: "answer", 
                    answer: data.answer 
                }); 
            } 
            
            break; 
            
            case "candidate": //////wrong wrong wrong
            console.log("Sending candidate to:",PLAYERS_LIST[data.playerId].name); 
            var soc = SOCKET_LIST[data.playerId];
            
            if(soc != null) { 
                sendTo(soc, { 
                    type: "candidate", 
                    candidate: data.candidate 
                }); 
            } 
            
            break;
            
            case "leave": 
            console.log("Disconnecting from", PLAYERS_LIST[data.playerId].name); 
            var soc = SOCKET_LIST[data.playerId]; 
            PLAYERS_LIST[socket.id].otherPlayerId = undefined; 
            
            //notify the other user so he can disconnect his peer connection 
            if(soc != null) {
                sendTo(soc, { 
                    type: "leave" 
                }); 
            }
            
            break;
            
            default: 
            sendTo(socket, { 
                type: "error", 
                message: "Command not found: " + data.type 
            }); 
            
            break; 
        }
        
    }); 
});

function sendTo(socket, message) { 
    socket.emit("message",JSON.stringify(message)); 
}

setInterval(function(){
    var pack = {
        player:PLAYERS_LIST,
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('onlinePlayers',pack);
    }
},1000);