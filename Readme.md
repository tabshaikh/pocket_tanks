# Pocket Tanks
This is a online game created using NodeJS and CreateJS. The server of
this game is deployed on Heroku and Firebase is used as a database to store
data. The game can be played with both computer or with another player
online. To play the game first the user need to login. Matches history and
the achievement of every player will be stored individually.
## Running Game server
```
cd Server
node server.js
```
This will run the server in development mode.
You can view the game with the link [https://localhost:8000](https://localhost:8000) on your machine.

To run the code on other people machine format will be ( https://your_ip:8000 ).
## Cautions
- After running the you you need to grant the permission for accessing the camera and microphone.
- The WebRTC is only supported by Chrome, Firefox and Opera. So the game will not run on any browser other than that.
