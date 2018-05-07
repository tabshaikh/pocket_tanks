var config = {
    apiKey: "AIzaSyATvQWRxZzGBPprB9wcdn4Fw_53tUIDaTE",
    authDomain: "pocket-tanks-dfb9e.firebaseapp.com",
    databaseURL: "https://pocket-tanks-dfb9e.firebaseio.com",
    projectId: "pocket-tanks-dfb9e",
    storageBucket: "",
    messagingSenderId: "879042693506"
};
firebase.initializeApp(config);

var socket = io(); 
var yourConn; 
var stream;
var dataChannel;
var sendQueue = [];

//authententication
var authentication = document.getElementById('auth');

//register
var registerForm = document.getElementById('register-form');
var registerUsername = document.getElementById('register-username');
var registerEmail = document.getElementById('register-email');
var registerPassword = document.getElementById('register-password');
var register = document.getElementById('register');
var SignIn = document.getElementById('SignIn');

//login
var loginForm = document.getElementById('login-form');
var loginEmail = document.getElementById('login-email');
var loginPassword = document.getElementById('login-password');
var login = document.getElementById('login');
var create = document.getElementById('create');

// main-page
var mainPage = document.getElementById('main-page');
//header
var header = document.getElementById('header');
var userName = document.getElementById('UserName');
var logOut = document.getElementById('logOut');
//video
var remoteVideo = document.getElementById('remoteVideo');
//game
var game = document.getElementById("game");
// var ctx = document.getElementById("ctx").getContext("2d");
// ctx.font = '30px Arial';

//chat
var chat = document.getElementById('chat');
var player2Name = document.getElementById('otherPlayerName');
var voiceChat = document.getElementById('voiceChat');
var videoChat = document.getElementById('videoChat');
var chatBox = document.getElementById('chatBox');
var chat1 = document.getElementById('chat1');
var chat2 = document.getElementById('chat2');
var chatInput = document.getElementById('chatInput');
var chatSubmit = document.getElementById('chatSubmit');

//options
var options = document.getElementById('options');
var singlePlayer = document.getElementById('single-player');
var multiPlayer = document.getElementById('multi-player');

//selectPlayer
var selectPlayer = document.getElementById('selectPlayer');

SignIn.addEventListener('click',e => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'inline-block';
});

create.addEventListener('click',e => {
    registerForm.style.display = 'inline-block';
    loginForm.style.display = 'none';
});    

login.addEventListener('click',e => {
    //Get username and password
    const email = loginEmail.value;
    const pass = loginPassword.value;
    
    const auth = firebase.auth();
    // Sign in
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
        auth.signInWithEmailAndPassword(email,pass)
        .catch(e => console.log(e.mesage));
    });     
});

register.addEventListener('click',e => {
    //Get username and password
    const username = registerUsername.value;
    const email = registerEmail.value;
    const pass = registerPassword.value;
    const auth = firebase.auth();
    
    // Sign in
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
        auth.createUserWithEmailAndPassword(email,pass)
        .then(function(user) {
            console.log("Hi "+ username);
            return user.updateProfile({
                displayName: username,
            });
        });
    });
});

logOut.addEventListener('click',e => {
    firebase.auth().signOut()
    .then(function() {
        // Sign-out successful.
        authentication.style.display = 'block';
        mainPage.style.display = 'none';
        options.style.display = 'block';
        game.style.display = 'none';
        
        socket.emit('signOutSuccess',player);            
        player.id = undefined;
        player.name = undefined;
    })
    .catch(function(error) {
        // An error happened
        console.log("logout error");
    });
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        authentication.style.display = 'none';
        mainPage.style.display = 'block';
        player.id = firebaseUser.uid;
        player.name = firebaseUser.displayName;
        userName.innerHTML = "Hi " + player.name;
        socket.emit('signInSuccess',{firebaseUser});
        ////////////////////////////////////////////////
        //********************** 
        //Starting a peer connection 
        //********************** 
        
        //getting local video stream 
        navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) { 
            stream = myStream; 
            
            //displaying local video stream on the page 
            // localVideo.srcObject = (stream);
            
            //using Google public stun server 
            var configuration = { 
                "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
            }; 
            
            yourConn = new webkitRTCPeerConnection(configuration);

            // yourConn.ondatachannel = function(event) {
            //     console.log('Data channel is created!');
            //     receiveChannel = event.channel;
            //     receiveChannel.onopen = function() {
            //       console.log('Data channel is open and ready to be used.');
            //     };
            //     receiveChannel.onerror = function (error) { 
            //         console.log("Ooops...error:", error); 
            //     }; 
            //     receiveChannel.onmessage = function (event) {
            //         if(event.data.type === "chat")
            //             chatBox.innerHTML += "<div id=\"chat1\">" + event.data.value + "</div>";
            //         else
            //             console.log(event.data.value);
            //     }; 
            //     receiveChannel.onclose = function () { 
            //         console.log("data channel is closed"); 
            //     };
            //   };
            
            //creating data channel 
            // dataChannel = yourConn.createDataChannel("channel1", {reliable:true}); 

            // setup stream listening 
            yourConn.addStream(stream); 
            
            //when a remote user adds stream to the peer connection, we display it 
            yourConn.onaddstream = function (e) { 
                remoteVideo.srcObject = (e.stream); 
            };
            
            // Setup ice handling 
            yourConn.onicecandidate = function (event) { 
                if (event.candidate) { 
                    send({ 
                        type: "candidate", 
                        candidate: event.candidate 
                    }); 
                } 
            };  
            
        }, function (error) { 
            console.log(error); 
        });
        /////////////////////////////////////////////////
        
    }
    else {
        console.log('not logged in');
    }
});

singlePlayer.addEventListener('click',e => {
    options.style.display = 'none';
    game.style.display = 'block';
});

multiPlayer.addEventListener('click',e => {
    options.style.display = 'none';
    selectPlayer.style.display = 'block';
    showPlayers();
});

videoChat.addEventListener('click',e => {
    if(stream.getVideoTracks()[0].enabled)
    {
        stream.getVideoTracks()[0].enabled = false;
        remoteVideo.style.display = 'none';
    }
    else
    {
        stream.getVideoTracks()[0].enabled = true;
        remoteVideo.style.display = 'block';
    }
});

voiceChat.addEventListener('click',e => {
    if(stream.getAudioTracks()[0].enabled)
    stream.getAudioTracks()[0].enabled = false;
    else
    stream.getAudioTracks()[0].enabled = true;
});

function showPlayers()
{
    var PLAYER_LIST;
    socket.on('onlinePlayers',function(data){
        PLAYERS_LIST = data.player;
        delete PLAYERS_LIST[player.id];
        selectPlayer.innerHTML = "";
        for(var i in data.player)
        {
            selectPlayer.innerHTML += "<div class=\"onlinePlayers\" id=\"" + data.player[i].id +"\">" + data.player[i].name + "<\div>\n"; 
        }
        
        $('div.onlinePlayers').click(function() {
            var id = $(this).attr('id');
            socket.emit('askConnection',data.player[id]);
            socket.on('connectionEstablish',function(temp){
                if(temp.id === id){
                    selectPlayer.style.display = 'none';                
                    game.style.display = "block";                   
                    otherPlayer = data.player[id];
                    player2Name.innerHTML = otherPlayer.name;
                    //////////////////////////////////
                    // create an offer 
                    yourConn.createOffer(function (offer) { 
                        send({ 
                            type: "offer", 
                            offer: offer 
                        }); 
                        
                        yourConn.setLocalDescription(offer); 
                    }, function (error) { 
                        alert("Error when creating an offer"); 
                    });
                }
            });
        });
    });
}

socket.on('incommingConnection',function(data){
    if(confirm(data.name + ' wants to play a game with you?'))
    {
        selectPlayer.style.display = 'none';                
        game.style.display = "block";
        otherPlayer = data;
        player2Name.innerHTML = otherPlayer.name;        
        var gameObject = {
            'player1': data,
            'player2': player
        }
        socket.emit('approvedConnection',gameObject);
    }
    else
    {
        console.log('rejected offer');
    }
});

/////////////////////////////////////////////////////////////////
//when we got a message from a signaling server 
socket.on("message", function (msg) { 
    console.log("Got message", msg);
    
    var data = JSON.parse(msg); 
    
    switch(data.type) { 
        case "login": 
        handleLogin(data.success); 
        break; 
        //when somebody wants to call us 
        case "offer": 
        handleOffer(data.offer); 
        break; 
        case "answer": 
        handleAnswer(data.answer); 
        break; 
        //when a remote peer sends an ice candidate to us 
        case "candidate": 
        handleCandidate(data.candidate); 
        break; 
        case "leave": 
        handleLeave(); 
        break; 
        default: 
        break; 
    }
});


//alias for sending JSON encoded messages 
function send(message) { 
    //attach the other peer username to our messages 
    if (otherPlayer.id) { 
        message.playerId = otherPlayer.id;
    } 
    
    socket.emit("message1",JSON.stringify(message)); 
};

//when somebody sends us an offer 
function handleOffer(offer) { 
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    
    //create an answer to an offer 
    yourConn.createAnswer(function (answer) { 
        yourConn.setLocalDescription(answer); 
        
        send({ 
            type: "answer", 
            answer: answer 
        }); 
        
    }, function (error) { 
        alert("Error when creating an answer"); 
    }); 
};

//when we got an answer from a remote user
function handleAnswer(answer) { 
    yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
};

//when we got an ice candidate from a remote user 
function handleCandidate(candidate) { 
    yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
    stream.getAudioTracks()[0].enabled = false;
    stream.getVideoTracks()[0].enabled = false;    
};

//when user clicks the "send message" button 
chatSubmit.addEventListener("click", function (event) { 
    var val = chatInput.value; 
    chatBox.innerHTML += "<div id=\"chat2\">" + val + "</div>"; 
     
    //sending a message to a connected peer 
    obj = {
        "type": "chat",
        "value": val 
    };
    if(otherPlayer.id != undefined)
        send_obj(obj);
    else
        console.log("kuch gadbad hai");
    chatInput.value = "";
 });

function send_obj(obj){
    socket.emit('data_transfer',obj);
}

socket.on('data_receive',function(data){
    if(data.type === "chat")
        chatBox.innerHTML += "<div id=\"chat1\">" + data.value + "</div>";
    else if(data.type === "swap"){
        otherPlayer = data.value;
    }
    else
        console.log(data.value);
})

 setInterval(function(){
    var obj = {
        "type": "swap",
        "value": player
    };
    if(otherPlayer.id != undefined)
        send_obj(obj);
},1000);
