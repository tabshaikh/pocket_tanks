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

function init2(){ // this function is called when user choose a single player game
    
    player.control  = 0;
    player.state  = 1;
    player.round  = 0;
    otherPlayer.id  = 0;
    otherPlayer.name  = "Computer";
    otherPlayer.control  = 1;
    otherPlayer.state  = 0;
    otherPlayer.round  = 0;
    otherPlayer.game_type  = "single_player";
    otherPlayer.score  = 0;
    otherPlayer.moves  = 4;
    
    console.log("init2 called");
    
    draw_terrain();
    
    document.getElementById("p2score").innerHTML ="Player 2: " + otherPlayer.score;
    
    player.tankX = rand ; 
    player.tankY = terrain[rand] ; 
    player.angle = 60;
    fireangle = 60;
    document.getElementById("fireangle").innerHTML =fireangle;
    
    otherPlayer.tankX = rand1 ; 
    otherPlayer.tankY = terrain[rand1] ; 
    otherPlayer.angle = 120;
    
    // console.log("otherPlayer angle is "+otherPlayer.angle);
    
    draw_tank11();
    draw_weapon_tank11();
    draw_tank21();
    draw_weapon_tank21();
    stage.update();
    //createjs.Ticker.addEventListener("tick", update_other_player_info1);
    //createjs.Ticker.setFPS(60);
}

function update_other_player_info1(){   // this function update other palyer info 
    draw_tank11();
    draw_weapon_tank11();
    draw_tank21();
    draw_weapon_tank21();  
    update_tank2_bullet1();
    document.getElementById("p2score").innerHTML ="Player 2: "+otherPlayer.score;
    stage.removeChild(tank2_bullet);
    stage.update();
}

var tank2_bullet= new createjs.Shape();

function update_tank2_bullet1(){
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
function draw_tank11(){
    var tank1 = new Image();
    tank1.src = "./Client/img/tankVehicleright.png";
    tank1.onload = handletankLoad11;
}

var tank1_angle;
function handletankLoad11(event) {    
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
function draw_weapon_tank11(){
    var turret1 = new Image();
    turret1.src = "./Client/img/tankWeaponleft.png";
    turret1.onload = handleweaponLoad11;
}
// Weapon size 35*7
function handleweaponLoad11(event) {
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
function draw_tank21(){
    var tank2 = new Image();
    tank2.src = "./Client/img/tankVehicleleft.png";
    tank2.onload = handletankLoad21;
    // console.log("tank 2 drawn" + otherPlayer.tankY);    
}

var image4, bitmap4;
function draw_weapon_tank21(){
    var turret2 = new Image();
    turret2.src = "./Client/img/tankWeaponleft.png";
    turret2.onload = handleweaponLoad21;
}
// Weapon size 35*7
function handleweaponLoad21(event) {
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

function handletankLoad21(event) {    
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

function decrease_movement_forward1(){
    if(player.state === 1)
    { 
        if(movement > 0 )
        {
            count = 25;
            movement = movement -1;
            createjs.Ticker.addEventListener("tick", movetank1forward1);
            createjs.Ticker.setFPS(30);  
        }    
        document.getElementById("move").innerHTML = movement;
    }
}

function movetank1forward1(event) {
    if (count > 0) { 
        player.tankX = player.tankX + 2;
        player.tankY = terrain[player.tankX];
        draw_tank11();
        draw_weapon_tank11();
        count = count - 1; }
        stage.update(event); // important!!
    }
    
    var weapon = new createjs.Shape();
    var xi,yi;
    var t;
    var weapon1 = new createjs.Shape();
    function fire1(){
        // console.log("FIRE : "); 
        if(player.state == 1 && player.round < 10)
        {
            player.round = player.round + 1;
            document.getElementById("roundno").innerHTML ="Round: "+ player.round;
            weapon.graphics.beginFill("red");
            weapon.graphics.drawCircle(0,0,10);
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
            createjs.Ticker.addEventListener("tick", fireweapon_person);
            createjs.Ticker.setFPS(30);
        }
        else if(otherPlayer.state == 1 && otherPlayer.round < 10)
        {
            otherPlayer.round = otherPlayer.round + 1;
            weapon1.graphics.beginFill("red");
            weapon1.graphics.drawCircle(0,0,10);
            weapon1.x = bitmap3.x;
            weapon1.y = bitmap3.y;
            otherPlayer.bulletX = weapon1.x;
            otherPlayer.bulletY = weapon1.y;
            weapon1.graphics.endFill();
            xi = bitmap3.x;
            yi = bitmap3.y - 2;
            stage.addChild(weapon1);
            stage.update();
            t=0;
            otherPlayer.angle = Math.random()*20 + 100;
            otherPlayer.power = Math.random()*30 + 60;
            createjs.Ticker.addEventListener("tick", fireweapon_computer);
            createjs.Ticker.setFPS(30);
        }
        else if(otherPlayer.round >= 10)
        {
            player.state = 0;
            otherPlayer.state = 0;
            storeScore();
        }
    }
    
    function fireweapon_person(event){  // used to fire weapons by person
        if(weapon.y <= terrain[Math.ceil(weapon.x)])
        {   
            t+=0.5;
            weapon.x = xi + player.power * (Math.cos(Math.PI*(player.angle)/180)) * t;
            weapon.y = yi - (player.power * (Math.sin(Math.PI*(player.angle)/180)) * t) + (4.9 * Math.pow(t,2));
            player.bulletX = weapon.x;
            player.bulletY = weapon.y;
            // console.log("firing");
        }
        else
        {
            createjs.Ticker.removeEventListener("tick", fireweapon_person);
            stage.removeChild(weapon);
            remove_terrain1();
            // console.log("IN HERE "+player.state);
            update_score1();      
        }
        stage.update(event);
    }
    
    function fireweapon_computer(event){    // used to fire weapons by computer
        // console.log("In computer area");
        if(weapon1.y <= terrain[Math.ceil(weapon1.x)])
        {      
            t+=0.5;
            weapon1.x = xi + otherPlayer.power * (Math.cos(Math.PI*(otherPlayer.angle)/180)) * t;
            weapon1.y = yi - (otherPlayer.power * (Math.sin(Math.PI*(otherPlayer.angle)/180)) * t) + (4.9 * Math.pow(t,2));
            otherPlayer.bulletX = weapon1.x;
            otherPlayer.bulletY = weapon1.y;
        }
        else
        {
            createjs.Ticker.removeEventListener("tick", fireweapon_computer);
            stage.removeChild(weapon1);
            remove_terrain2();
            update_score1();      
        }
        stage.update(event);
    }
    
    function remove_terrain1(){     // this function removes previously drawn terrain 
        // console.log("In remove terrain");
        createjs.Ticker.addEventListener("tick", regenerate_terrain1);
        createjs.Ticker.setFPS(60);
    }
    
    var ran=0;
    
    function regenerate_terrain1(){    // this function is used to regenerated terrain
        // console.log("In remove terrain");
        ran+=55;
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
        draw_tank11();
        draw_weapon_tank11();
        draw_tank21();
        draw_weapon_tank21();
        if(ran>=50)
        {                
            createjs.Ticker.removeEventListener("tick", regenerate_terrain1);
            ran=0;
        }
        stage.update(event);
        stage.removeChild(weapon);
    }
    
    function remove_terrain2(){
        // console.log("In remove terrain");
        createjs.Ticker.addEventListener("tick", regenerate_terrain2);
        createjs.Ticker.setFPS(60);
    }
    
    function regenerate_terrain2(){    
        // console.log("In remove terrain");
        ran+=55;
        for(var i=weapon1.x-ran;i<=weapon1.x+ran;i++)
        {
            var y_cord;
            y_cord=Math.sqrt((ran*ran)-((i-weapon1.x)*(i-weapon1.x)));
            y_cord=Math.ceil((terrain[Math.ceil(i)])+y_cord);
            if(y_cord <= canvas.height)
            terrain[Math.ceil(i)]=y_cord;
        }
        stage.removeChild(lineShape);
        draw_terrain(); 
        player.tankY = terrain[player.tankX]; 
        otherPlayer.tankY = terrain[otherPlayer.tankX];
        draw_tank11();
        draw_weapon_tank11();
        draw_tank21();
        draw_weapon_tank21();
        if(ran>=50)
        {                
            createjs.Ticker.removeEventListener("tick", regenerate_terrain2);
            ran=0;
        }
        stage.update(event);
        stage.removeChild(weapon1);
    }
    
    function update_score1(){   // used to update score
        if(player.state == 1)
        {
            // console.log("Updating state of player");
            player.state = 0;
            otherPlayer.state = 1;
            fire1();
            if(otherPlayer.tankX - 37 < weapon.x && weapon.x < otherPlayer.tankX + 37 )
            {
                player.score = player.score + 30;
                document.getElementById("p1score").innerHTML ="Player 1: " + player.score;
            }
        }
        else
        {
            // console.log("Updating state of computing");
            player.state = 1;
            otherPlayer.state = 0;
            if(player.tankX - 37 < weapon1.x && weapon1.x < player.tankX + 37 )
            {
                otherPlayer.score = otherPlayer.score + 30;
                document.getElementById("p2score").innerHTML ="Player 2: " + otherPlayer.score;
            }
        }
    }
    
    var count1 = 25; // The number of points the tank will move forward or backward
    function decrease_movement_backward1(){
        if(player.state === 1)
        {
            if(movement > 0 )
            {
                count1 = 25;
                movement = movement -1;
                createjs.Ticker.addEventListener("tick", movetank1backward1);
                createjs.Ticker.setFPS(30); 
            }     
            document.getElementById("move").innerHTML = movement;
        }
    }
    
    function movetank1backward1(event) {
        if (count1 > 0) { 
            player.tankX = player.tankX - 2;
            player.tankY = terrain[player.tankX];
            draw_tank11();
            draw_weapon_tank11();
            count1 = count1 - 1; }
            stage.update(event); // important!!
        }
        
        function decrease_speed1(){
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
        function increase_speed1(){
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
        function decrease_angle1(){
            if(player.state === 1)
            {
                fireangle = fireangle -1;
                player.angle = player.angle - 1;
                draw_weapon_tank11();
                document.getElementById("fireangle").innerHTML =fireangle;
            }
        }
        function increase_angle1(){
            if(player.state === 1)
            {
                fireangle = fireangle + 1;
                player.angle = player.angle + 1;
                draw_weapon_tank11();
            }
            document.getElementById("fireangle").innerHTML =fireangle;
        }
        
        function api(){
            var time =  (2 * tanks[1].bullet_speed * Math.	sin(tanks[1].bullet_angle * Math.PI / 180)) / 9.8;
            var height = Math.pow(tanks[1].bullet_speed * Math.sin(tanks[1].bullet_angle * Math.PI / 180),2) / (2 * 9.8);
            var range = Math.pow(tanks[1].bullet_speed,2) * Math.sin(2 * tanks[1].bullet_angle * Math.PI / 180) / 9.8;            
        }
        
        
        