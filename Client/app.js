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
        game.style.display = 'block';
    });

    function showPlayers()
    {
        var PLAYER_LIST;
        socket.on('onlinePlayers',function(data){
            PLAYERS_LIST = data.players;
            delete PLAYERS_LIST(player.id);
        });
    }