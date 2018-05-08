var lineShape;

var canvas = document.getElementById("PocketCanvas"); //canvas variable initialized with id of pocketcanvas
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var stage = new createjs.Stage(canvas);
var control_panel = 100;

var firepower = 30;
player.power = 30;
document.getElementById("firepower").innerHTML =firepower;
var fireangle ;

var movement = 4;
player.moves = 4;
document.getElementById("move").innerHTML =movement;

player.score = 0;
player.round = 0;
document.getElementById("p1score").innerHTML ="Player 1: "+player.score;
document.getElementById("roundno").innerHTML ="Round: "+player.round;

//The tanks size is 70*26
var rand=Math.floor(Math.random()*(canvas.width/2)); //variable to randomly position tank 1 on the terrain
var rand1=Math.floor(Math.random()*(canvas.width/2)+canvas.width/2); //variable to randomly position tank 2 on the terrain

function init1(){
    //console.log("init called");
    draw_terrain();
    document.getElementById("p2score").innerHTML ="Player 2: " + otherPlayer.score;
    if(player.control == 0) //draw a player to the left 
    {
        player.tankX = rand ; 
        player.tankY = terrain[rand] ; 
        player.angle = 60;
        fireangle = 60;
        document.getElementById("fireangle").innerHTML =fireangle;
    }
    else 
    {
        player.tankX = rand1 ; 
        player.tankY = terrain[rand1] ;
        player.angle = 120;
        fireangle = 120;
        document.getElementById("fireangle").innerHTML =fireangle;
    }
    draw_tank1();
    draw_weapon_tank1();
    draw_tank2();
    draw_weapon_tank2();
    stage.update();
    createjs.Ticker.addEventListener("tick", update_other_player_info);
    createjs.Ticker.setFPS(60);
}

function update_other_player_info(){
    draw_tank1();
    draw_weapon_tank1();
    draw_tank2();
    draw_weapon_tank2();  
    update_tank2_bullet();
    document.getElementById("p2score").innerHTML ="Player 2: "+otherPlayer.score;
    //stage.removeChild(tank2_bullet);
    stage.update();
}

var tank2_bullet= new createjs.Shape();

function update_tank2_bullet(){
    if(otherPlayer.bulletY  <= terrain[Math.ceil(otherPlayer.bulletX)]){
    stage.removeChild(tank2_bullet);
    tank2_bullet.graphics.beginFill("red");
    tank2_bullet.graphics.drawCircle(0,0,10);
    tank2_bullet.x = otherPlayer.bulletX;
    tank2_bullet.y = otherPlayer.bulletY - 2;
    tank2_bullet.graphics.endFill();
    stage.addChild(tank2_bullet);
    stage.update();
    }
    else{
        stage.removeChild(tank2_bullet);
        stage.update();
    }
}

var bitmap,image;
var count = 25; // The number of points the tank will move forward or backward
function draw_tank1(){
    var tank1 = new Image();
    tank1.src = "./Client/img/tankVehicleright.png";
    tank1.onload = handletankLoad1;
}

var tank1_angle;
function handletankLoad1(event) {    
    stage.removeChild(bitmap);           
    image = event.target;
    bitmap = new createjs.Bitmap(image);
    bitmap.regX = 35;
    bitmap.regY = 25;
    bitmap.x = player.tankX ;
    bitmap.y = player.tankY ;
    tank1_angle= (Math.atan((terrain[player.tankX + 10]-terrain[player.tankX])/10))*(180/Math.PI);
    // console.log("Tank angle:"+tank1_angle);
    bitmap.rotation = tank1_angle;
    stage.addChild(bitmap);
    stage.update();
}
var image1, bitmap1;
function draw_weapon_tank1(){
    var turret1 = new Image();
    turret1.src = "./Client/img/tankWeaponleft.png";
    turret1.onload = handleweaponLoad1;
}
// Weapon size 35*7
function handleweaponLoad1(event) {
    stage.removeChild(bitmap1);
    image1 = event.target;
    bitmap1 = new createjs.Bitmap(image1);
    bitmap1.regY = 5;
    bitmap1.regX = 0;
    if(tank1_angle > 0)
    {
        bitmap1.x = player.tankX + 20*Math.sin(tank1_angle*Math.PI / 180);
        bitmap1.y = player.tankY - 20*Math.cos(tank1_angle*Math.PI / 180);        
    }
    else
    {
        bitmap1.x = player.tankX - 20*Math.sin(-tank1_angle*Math.PI / 180);
        bitmap1.y = player.tankY - 20*Math.cos(-tank1_angle*Math.PI / 180);
    }
    var turret_angle = - player.angle ;
    bitmap1.rotation = turret_angle;
    stage.addChild(bitmap1);
    stage.update();
}

var bitmap3,image3;
function draw_tank2(){
    var tank2 = new Image();
    tank2.src = "./Client/img/tankVehicleleft.png";
    tank2.onload = handletankLoad2;
    // console.log("tank 2 drawn" + otherPlayer.tankY);    
}

var image4, bitmap4;
function draw_weapon_tank2(){
    var turret2 = new Image();
    turret2.src = "./Client/img/tankWeaponleft.png";
    turret2.onload = handleweaponLoad2;
}
// Weapon size 35*7
function handleweaponLoad2(event) {
    stage.removeChild(bitmap4);
    image4 = event.target;
    bitmap4 = new createjs.Bitmap(image4);
    bitmap4.regY = 5;
    bitmap4.regX = 0;
    if(tank2_angle > 0)
    {   
        bitmap4.x = otherPlayer.tankX + 20*Math.sin(tank2_angle*Math.PI / 180);
        bitmap4.y = otherPlayer.tankY - 20*Math.cos(tank2_angle*Math.PI / 180);        
    }
    else
    {
        bitmap4.x = otherPlayer.tankX - 20*Math.sin(-tank2_angle*Math.PI / 180);
        bitmap4.y = otherPlayer.tankY - 20*Math.cos(-tank2_angle*Math.PI / 180);
    }
    var turret_angle = - otherPlayer.angle ;
    bitmap4.rotation = turret_angle;
    stage.addChild(bitmap4);
    stage.update();
}

var tank2_angle;

function handletankLoad2(event) {    
    stage.removeChild(bitmap3);           
    image3 = event.target;
    bitmap3 = new createjs.Bitmap(image);
    bitmap3.regX = 35;
    bitmap3.regY = 25;
    bitmap3.x = otherPlayer.tankX ;
    bitmap3.y = otherPlayer.tankY ;
    tank2_angle= (Math.atan((terrain[otherPlayer.tankX + 10]-terrain[otherPlayer.tankX])/10))*(180/Math.PI);
    // console.log("Tank angle:"+tank1_angle);
    bitmap3.rotation = tank2_angle;
    stage.addChild(bitmap3);
    stage.update();
}

function decrease_movement_forward(){
    if(player.state === 1)
    { 
        if(movement > 0 )
        {
            count = 25;
            movement = movement -1;
            createjs.Ticker.addEventListener("tick", movetank1forward);
            createjs.Ticker.setFPS(30);  
        }    
        document.getElementById("move").innerHTML = movement;
    }
}

function movetank1forward(event) {
    if (count > 0) { 
        player.tankX = player.tankX + 2;
        player.tankY = terrain[player.tankX];
        draw_tank1();
        draw_weapon_tank1();
        count = count - 1; }
        stage.update(event); // important!!
    }
    
    var weapon = new createjs.Shape();
    var xi,yi;
    var t;
    function fire(){
        if(player.state == 1 && player.round < 10)
        {
            player.state = 0;
            ///////////////////////////////////
            var obj = {
                "type": "swap",
            };
            if(otherPlayer.id != undefined)
            send_obj(obj);
            //////////////////////////////////
            //console.log(player.state);
            player.round = player.round + 1;
            document.getElementById("roundno").innerHTML ="Round: "+ player.round;
            weapon.graphics.beginFill("red");
            weapon.graphics.drawCircle(0,0,10);
            // console.log("Bitmap: "+bitmap1.x);
            // console.log("Bitmap: "+bitmap1.y);
            // console.log("Player: "+player.tankX);
            // console.log("Player: "+player.tankY);
            weapon.x = bitmap1.x;
            weapon.y = bitmap1.y;
            player.bulletX = weapon.x;
            player.bulletY = weapon.y;
            weapon.graphics.endFill();
            xi = bitmap1.x;
            yi = bitmap1.y;
            stage.addChild(weapon);
            stage.update();
            t=0;
            createjs.Ticker.addEventListener("tick", fireweapon);
            createjs.Ticker.setFPS(60);
        }
        else if(otherPlayer.round >= 10)
        {       
                player.state = 0;~
                gameOver();
        }
    }
    
    var orignalterrainy;
    
    var change = 0 ; 
    
    function fireweapon(event){
        if(weapon.y <= terrain[Math.ceil(weapon.x)])
        {   
            t+=0.5;
            weapon.x = xi + player.power * 2 * (Math.cos(Math.PI*(player.angle)/180)) * t;
            weapon.y = yi - (player.power * 2 * (Math.sin(Math.PI*(player.angle)/180)) * t) + (4.9 * Math.pow(t,2));
            player.bulletX = weapon.x;
            player.bulletY = weapon.y;
        }
        else
        {
            orignalterrainy = weapon.y;
            change = 1;
            createjs.Ticker.removeEventListener("tick", fireweapon);
            stage.removeChild(weapon);
            remove_terrain();
            update_score();      
        }
        stage.update(event);
    }
    
    function remove_terrain(){
        stage.removeChild(tank2_bullet);
        createjs.Ticker.addEventListener("tick", regenerate_terrain);
        createjs.Ticker.setFPS(60);
    }

    var ran=0;

    function regenerate_terrain(){    
            ran+=55;
            //console.log(weapon.x);
            for(var i=weapon.x-ran;i<=weapon.x+ran;i++)
            {
                var y_cord;
                y_cord=Math.sqrt((ran*ran)-((i-weapon.x)*(i-weapon.x)));
                y_cord=Math.ceil((terrain[Math.ceil(i)])+y_cord);
                if(y_cord <= canvas.height)
                terrain[Math.ceil(i)]=y_cord;
            }
            stage.removeChild(lineShape);
            draw_terrain(); 
            player.tankY = terrain[player.tankX]; 
            otherPlayer.tankY = terrain[otherPlayer.tankX];
            // console.log("tank 2 y changed"+ otherPlayer.tankY);
            /////////////////////////////////////////// 
            var obj = {
                "type":"terrainDestroyed",
                "terrain": terrain,
                "playerY": otherPlayer.tankY
            }
            send_obj(obj);
            //////////////////////////////////////
            draw_tank1();
            draw_weapon_tank1();
            draw_tank2();
            draw_weapon_tank2();
            if(ran>=50)
            {                
                createjs.Ticker.removeEventListener("tick", regenerate_terrain);
                ran=0;
            }
            
            stage.removeChild(weapon);
            stage.update(event);
    }

    function update_score(){
        //console.log("otherPlayer.tankX: "+otherPlayer.tankX);
        //console.log("weapon.x: "+weapon.x);
        if(otherPlayer.tankX - 37 < weapon.x && weapon.x < otherPlayer.tankX + 37 )
        {
            player.score = player.score + 30;
            document.getElementById("p1score").innerHTML ="Player 1: " + player.score;
        }
    }
       
    function draw_terrain(){
        //stage.removeAllChildren();
        stage.removeChild(lineShape);
        lineShape = new createjs.Shape();
        //console.log("canvas width: "+canvas.width);
        for (var x = 0; x < canvas.width; x++) 
        {
            //console.log("terrain: "+terrain[Math.ceil(weapon.x)]);
            var HEIGHT_MAX = canvas.height ;
            lineShape.graphics.beginLinearGradientFill(["#794c13","green"],[0.8,0.9],x,HEIGHT_MAX,x,terrain[x]);
            lineShape.graphics.setStrokeStyle(10).beginLinearGradientStroke(["#794c13","green"],[0.7,0.9],x,HEIGHT_MAX,x,terrain[x]).moveTo(x,HEIGHT_MAX).lineTo(x,terrain[x]);
            stage.addChild(lineShape);      
        }
        stage.update();
    }
    
    var count1 = 25; // The number of points the tank will move forward or backward
    function decrease_movement_backward(){
        if(player.state === 1)
        {
            if(movement > 0 )
            {
                count1 = 25;
                movement = movement -1;
                createjs.Ticker.addEventListener("tick", movetank1backward);
                createjs.Ticker.setFPS(30); 
            }     
            document.getElementById("move").innerHTML = movement;
        }
    }
    
    function movetank1backward(event) {
        if (count1 > 0) { 
            player.tankX = player.tankX - 2;
            player.tankY = terrain[player.tankX];
            draw_tank1();
            draw_weapon_tank1();
            count1 = count1 - 1; }
            stage.update(event); // important!!
        }
        
        function decrease_speed(){
            if(player.state === 1)
            {
                if(firepower > 0)
                {
                    firepower = firepower -1;
                    player.power = player.power - 1;
                }
                document.getElementById("firepower").innerHTML =firepower;
            }
        }
        function increase_speed(){
            if(player.state === 1)
            {
                if(firepower < 100)
                {
                    firepower = firepower + 1;
                    player.power = player.power + 1;
                }
                document.getElementById("firepower").innerHTML =firepower;
            }
        }
        function decrease_angle(){
            if(player.state === 1)
            {
                    fireangle = fireangle -1;
                    player.angle = player.angle - 1;
                    draw_weapon_tank1();           
                document.getElementById("fireangle").innerHTML =fireangle;
            }
        }
        function increase_angle(){
            if(player.state === 1)
            {
                    fireangle = fireangle + 1;
                    player.angle = player.angle + 1;
                    draw_weapon_tank1();
                document.getElementById("fireangle").innerHTML =fireangle;
            }
        }

        function api(){
            var time =  (2 * tanks[1].bullet_speed * Math.	sin(tanks[1].bullet_angle * Math.PI / 180)) / 9.8;
            var height = Math.pow(tanks[1].bullet_speed * Math.sin(tanks[1].bullet_angle * Math.PI / 180),2) / (2 * 9.8);
            var range = Math.pow(tanks[1].bullet_speed,2) * Math.sin(2 * tanks[1].bullet_angle * Math.PI / 180) / 9.8;
            
        }
        
        
        