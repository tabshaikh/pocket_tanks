// firebase config details
var config = {
    apiKey: "AIzaSyATvQWRxZzGBPprB9wcdn4Fw_53tUIDaTE",
    authDomain: "pocket-tanks-dfb9e.firebaseapp.com",
    databaseURL: "https://pocket-tanks-dfb9e.firebaseio.com",
    projectId: "pocket-tanks-dfb9e",
    storageBucket: "",
    messagingSenderId: "879042693506"
};
// intilising firebase App
firebase.initializeApp(config);
var database = firebase.database();

var socket = io(); //initilising socket
var yourConn; // for storing WebRTC connection
var stream; // for video streamimg
var dataChannel;

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
var statistics = document.getElementById('statistics');
var logOut = document.getElementById('logOut');
//video
var remoteVideo = document.getElementById('remoteVideo');

//statistics
var statisticsPage =  document.getElementById('statisticsPage');
var totalGamesPlayed =  document.getElementById('totalGamesPlayed');
var gameWon =  document.getElementById('gameWon');
var gameLost =  document.getElementById('gameLost');

//gameOver
var gameover = document.getElementById("gameOver");
var gameOverResult = document.getElementById("gameOverResult");

//game
var game = document.getElementById("game");
//game Area
var score = document.getElementById("score");
var canvas = document.getElementById("PocketCanvas");
var gameControl = document.getElementById("part2");

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

// adding listners on various events
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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)      //logging via firebase
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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)      //singup via firebase
    .then(function() {
        auth.createUserWithEmailAndPassword(email,pass)
        .then(function(user) {
            firebase.database().ref('users/' + user.uid).set({
                "total": 0,
                "gameWon": 0,
                "gameLost" : 0
            });
            return user.updateProfile({
                displayName: username,
            });
        });
    });
});

logOut.addEventListener('click',e => {
    firebase.auth().signOut()               //firebase signout
    .then(function() {
        // Sign-out successful.
        disable();
        authentication.style.display = 'block';
        
        socket.emit('signOutSuccess',player);            
        player.id = undefined;
        player.name = undefined;
    })
    .catch(function(error) {
        // An error happened
        console.log("logout error");
    });
});

firebase.auth().onAuthStateChanged(firebaseUser => {        //called when login or logout
    if(firebaseUser){
        disable();
        mainPage.style.display = 'block';
        options.style.display = 'block';
        player.id = firebaseUser.uid;
        player.name = firebaseUser.displayName;
        userName.innerHTML = "Hi " + player.name;
        socket.emit('signInSuccess',{firebaseUser});       
    }
    else {
        console.log('not logged in');
    }
});
// function for disabling all the elements of the html
function disable(){
    gameover.style.display = 'none';
    options.style.display = 'none';
    authentication.style.display = 'none';
    game.style.display = 'none';
    remoteVideo.style.display = 'none';
    selectPlayer.style.display = 'none';
    mainPage.style.display = 'none';
}

// call for statistics
statistics.addEventListener('click',e => {
    disable();
    mainPage.style.display = 'block';
    statisticsPage.style.display = 'block';
    var wonCount, lostCount, totalCount;
    firebase.database().ref('users/' + player.id).once('value').then(function(snapshot) {
        wonCount = snapshot.val().gameWon;
        lostCount = snapshot.val().gameLost;
        totalCount = snapshot.val().total;
        totalGamesPlayed.innerHTML = "Total Games Played:-" + (totalCount);
        gameWon.innerHTML = "Games Won:-" + (wonCount);
        gameLost.innerHTML = "Games Lost:-" + (lostCount);
    });    
});

/*******************Single player mode*******************************/
singlePlayer.addEventListener('click',e => {
    disable();
    mainPage.style.display = 'block';
    game.style.display = 'block';
    videoChat.style.display = 'none';
    voiceChat.style.display = 'none';
    chatInput.style.display = 'none';
    chatSubmit.style.display = 'none';
    player.game_type = 'single_player';
    generate_terrain();
    init2();
});
/********************************************************************************/
/***************************** Multi Mode Start *********************************/
/********************************************************************************/
multiPlayer.addEventListener('click',e => {
    disable();
    mainPage.style.display = 'block';
    selectPlayer.style.display = 'block';
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

function showPlayers()      // called for mutiplayer mode only
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
            generate_terrain();
            socket.emit('askConnection',{"data":data.player[id],"terrain":terrain});
            socket.on('connectionEstablish',function(temp){
                if(temp.id === id){
                    player.control = 0; //host 
                    player.state = 1;                 
                    otherPlayer.id = data.player[id].id;
                    otherPlayer.name = data.player[id].name;
                    otherPlayer.control = 1;
                    otherPlayer.state = 0;
                    otherPlayer.score = 0;
                    otherPlayer.game_type = "multiplayer";
                    otherPlayer.status = 1;
                    player2Name.innerHTML = otherPlayer.name;
                    disable();
                    mainPage.style.display = "block";             
                    game.style.display = "block";
                    init1();
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
    if(confirm(data.data.name + ' wants to play a game with you?'))
    {
        terrain = data.terrain;
        // console.log(terrain);
        player.control = 1; //client
        player.state = 0;
        otherPlayer = data.data;
        otherPlayer.id = data.data.id;
        otherPlayer.name = data.data.name;
        otherPlayer.control = 0;
        otherPlayer.state = 1;
        otherPlayer.score = 0;
        otherPlayer.game_type = "multiplayer";
        otherPlayer.status = 1;
        player2Name.innerHTML = otherPlayer.name;  
        disable();
        mainPage.style.display = "block";             
        game.style.display = "block";
        init1();      
        var gameObject = {
            'player1': data.data,
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
    // console.log("Got message", msg);
    
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
    else if(data.type === "copy"){
        otherPlayer.angle = data.value.angle;
        otherPlayer.power = data.value.power;
        otherPlayer.tankX = data.value.tankX; 
        otherPlayer.tankY = data.value.tankY; 
        otherPlayer.round = data.value.round; 
        otherPlayer.bulletX = data.value.bulletX; 
        otherPlayer.bulletY = data.value.bulletY; 
        otherPlayer.score = data.value.score; 
        otherPlayer.moves = data.value.moves;
    }
    else if(data.type === "swap"){
        if(player.state == 1)
        player.state = 0;
        else
        player.state = 1;
    }
    else if(data.type === "terrainDestroyed"){
        terrain = data.terrain;
        player.tankY = data.playerY;
        draw_terrain();
    }
    else if(data.type === "gameOver"){
        console.log("Game Over Transferred");
        storeScore();
    }
    else
    console.log(data.value);
})

setInterval(function(){
    var obj = {
        "type": "copy",
        "value": player
    };
    if(otherPlayer.id != undefined)
    send_obj(obj);
},30);

// Function used to generate the terrain randomly
function generate_terrain()
{
    //Initializing the features of the terrain
    var STEP_MAX = 2.0;
    var STEP_CHANGE = .5;
    var HEIGHT_MAX = canvas.height ;
    
    // starting conditions
    var height = (Math.random() * HEIGHT_MAX);
    var slope = (Math.random() * STEP_MAX) * 2 - STEP_MAX;
    // creating the landscape
    for (var x = 0; x < canvas.width; x++) 
    {
        // change height and slope
        height += slope;
        slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE;
        
        // clip height and slope to maximum
        if (slope > STEP_MAX) { slope = STEP_MAX };
        if (slope < -STEP_MAX) { slope = -STEP_MAX };
        
        if (height > HEIGHT_MAX) { 
            height = HEIGHT_MAX;
            slope *= -1;
        }
        if (height < 0 || height > 0 && height < 100 ) { 
            height = 105;
            slope *= -1;
        }
        terrain.push(height);
    }
}

function gameOver(){
    console.log("Game Over");
    var obj = {
        "type": "gameOver",
    }
    send_obj(obj);
    storeScore();
}
/******************************************************************************/
/*****************Multi Player Mode End **************************************/
function storeScore(){
    disable();
    mainPage.style.display = 'block';
    gameover.style.display = 'block';
    
    var wonCount, lostCount, totalCount;
    firebase.database().ref('users/' + player.id).once('value').then(function(snapshot) {
        wonCount = snapshot.val().gameWon;
        lostCount = snapshot.val().gameLost;
        totalCount = snapshot.val().total;
        console.log("total games played are "+totalCount);
        
        
        if(player.score > otherPlayer.score)
        {
            gameOverResult.innerHTML = "AND THE WINNNER IS " + player.name; 
            wonCount += 1;  
            totalCount += 1;     
        }
        else if(player.score < otherPlayer.score)
        {
            gameOverResult.innerHTML = "AND THE WINNNER IS " + otherPlayer.name;
            lostCount += 1;
            totalCount += 1;             
        }
        else
        {
            gameOverResult.innerHTML = "This was a Draw Game";
            totalCount += 1; 
        }
        var obj = {
            "total": totalCount,
            "gameWon": wonCount,
            "gameLost": lostCount
        }
        firebase.database().ref().child('users/' + player.id).set(obj);
    });
}