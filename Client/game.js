
  var canvas = document.getElementById("PocketCanvas"); //canvas variable initialized with id of pocketcanvas
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  var stage = new createjs.Stage(canvas);
  var control_panel = 100;

  var tanks={};
  var bulletList={};
  
  var firepower = 60;
  document.getElementById("firepower").innerHTML =firepower;
  var fireangle = 60;
  document.getElementById("fireangle").innerHTML =fireangle;
  var movement = 4;
  document.getElementById("move").innerHTML =movement;

  //The tanks size is 70*26
  var rand=Math.floor(Math.random()*(canvas.width/2)); //variable to randomly position tank 1 on the terrain
  var rand1=Math.floor(Math.random()*(canvas.width/2)+canvas.width/2-80); //variable to randomly position tank 2 on the terrain
  
  circle = new createjs.Shape();
  circle.graphics.beginFill("black");
  circle.graphics.drawCircle(0,0,5);
  circle.graphics.endFill();
  createjs.MotionGuidePlugin.install();
  
  function init() 
  {
    generate_terrain();
    
    tank(1,rand,terrain[rand]);
    draw_tank1();	
    
    var turret1 = new Image();
    turret1.src = "./Client/img/tankWeaponleft.png";
    turret1.onload = handleweaponLoad1;	
    
    var tank2 = new Image();
    tank2.src = "./Client/img/tankVehicleright.png";
    tank2.onload = handletankLoad2;
    tank(2,rand1,terrain[rand1]);

    var turret2 = new Image();
    turret2.src = "./Client/img/tankWeaponleft.png";
    turret2.onload = handleweaponLoad2;

    circle2 = new createjs.Shape();
    circle2.graphics.beginFill("black");
    circle2.graphics.drawCircle(rand1,terrain[rand1],5);
    circle2.graphics.endFill();
    stage.addChild(circle2);

    console.log(tanks);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",tickHandler);
    stage.update();
  }
  
  var bitmap,image;
  function draw_tank1(){
    var tank1 = new Image();
    tank1.src = "./Client/img/tankVehicleleft.png";
    tank1.onload = handletankLoad1;
  }
  
  function handletankLoad1(event) {    
            stage.removeChild(bitmap);           
            image = event.target;
            bitmap = new createjs.Bitmap(image);
            bitmap.regX = 35;
            bitmap.regY = 25;
            bitmap.x = tanks[1].x ;
            bitmap.y = tanks[1].y ;
            var tank1_angle= (Math.atan((terrain[tanks[1].x + 10]-terrain[tanks[1].x])/10))*(180/Math.PI);
           // console.log("Tank angle:"+tank1_angle);
            bitmap.rotation = tank1_angle;
            stage.addChild(bitmap);
            stage.update();
        }
    // Weapon size 35*7
    function handleweaponLoad1(event) {
            var image1 = event.target;
            var bitmap1 = new createjs.Bitmap(image1);
            bitmap1.regY = 5;
            bitmap1.regx = 0;
            bitmap1.x = rand - 20*Math.sin((Math.atan((terrain[rand + 10]-terrain[rand])/10))*(180/Math.PI)) ;
            bitmap1.y = terrain[rand] - 20*Math.cos((Math.atan((terrain[rand + 10]-terrain[rand])/10))*(180/Math.PI)) ;
            circle2 = new createjs.Shape();
            circle2.graphics.beginFill("red");
            circle2.graphics.drawCircle(rand,terrain[rand],2);
            circle2.graphics.endFill();
            stage.addChild(circle2);
            var tank1_angle= - 60;
            bitmap1.rotation = tank1_angle;
            stage.addChild(bitmap1);
            stage.update();
        }

    function handleweaponLoad2(event) {
        var image2 = event.target;
        var bitmap2 = new createjs.Bitmap(image2);     
        bitmap2.regY = 5;
        bitmap2.regx = 0;
        bitmap2.x = rand1 - 5;
        bitmap2.y = terrain[rand1]- 20;
        var tank1_angle = -120;
        bitmap2.rotation = tank1_angle;
        stage.addChild(bitmap2);
        stage.update();
    }

  function handletankLoad2(event) {
            var image3 = event.target;
            var bitmap3 = new createjs.Bitmap(image3);
            bitmap3.regX = 35;
            bitmap3.regY = 25;
            stage.addChild(bitmap3);
            bitmap3.x = rand1 ;
            bitmap3.y = terrain[rand1] ;
            var tank1_angle= (Math.atan((terrain[rand1 + 10]-terrain[rand1])/10))*(180/Math.PI);
            //console.log("Tank angle:"+tank1_angle);
            bitmap.rotation = tank1_angle;
            stage.update();
        }
// Function used to generate the terrain randomly
  function generate_terrain()
  {
    var lineShape = new createjs.Shape();
    
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
     // console.log("x"+x);
     // console.log("terrain[x]"+height)
      lineShape.graphics.beginLinearGradientFill(["#794c13","green"],[0.8,0.9],x,HEIGHT_MAX,x,height );
  	  lineShape.graphics.setStrokeStyle(10).beginLinearGradientStroke(["#794c13","green"],[0.7,0.9],x,HEIGHT_MAX,x,height).moveTo(x,HEIGHT_MAX).lineTo(x,height);
      terrain.push(height);
      stage.addChild(lineShape);
  	}
  }

  function fire() {
      	var time =  (2 * tanks[1].bullet_speed * Math.	sin(tanks[1].bullet_angle * Math.PI / 180)) / 9.8;
      	var height = Math.pow(tanks[1].bullet_speed * Math.sin(tanks[1].bullet_angle * Math.PI / 180),2) / (2 * 9.8);
      	var range = Math.pow(tanks[1].bullet_speed,2) * Math.sin(2 * tanks[1].bullet_angle * Math.PI / 180) / 9.8;
      //	console.log(time);
      // 	console.log(height);
      //	console.log(range);
      	var canvas_height = tanks[1].y - height;
        createjs.Tween.get(circle).to({guide:{ path:[tanks[1].bullet_initial_coor_x,tanks[1].bullet_initial_coor_y, tanks[1].bullet_initial_coor_x,canvas_height,(tanks[1].x)+  (range)/2,canvas_height, (tanks[1].x)+(range),canvas_height,(tanks[1].x)+(range),terrain[Math.floor((tanks[1].x)+(range))]] }},time*200);
        stage.addChild(circle);
        stage.update();
  }

  function tickHandler(e){
        stage.update();
      }

tank = function (id,x,y){
        var asd = {
                id:id,
                x:x,
                y:y,
                bullet_initial_coor_x:x+2,
                bullet_initial_coor_y:y,
                bullet_speed:fireangle,
                bullet_angle:firepower             
                };
        tanks[id] = asd;
    }

Bullet = function (id,x,y,spdX,spdY,width,height){
        var asd = {
                x:x,
                spdX:spdX,
                y:y,
                spdY:spdY,
                name:'E',
                id:id,
                width:width,
                height:height,
                color:'black',
                timer:0,
        };
        bulletList[id] = asd;
}

function decrease_speed(){
    if(firepower > 0)
    {
        firepower = firepower -1;
        tanks[1].bullet_speed = tanks[1].bullet_speed - 1;
    }
    document.getElementById("firepower").innerHTML =firepower;
}
function increase_speed(){
    if(firepower < 100)
    {
    firepower = firepower + 1;
    tanks[1].bullet_speed = tanks[1].bullet_speed + 1;
    document.getElementById("firepower").innerHTML =firepower;
}
    document.getElementById("firepower").innerHTML =firepower;
}
function decrease_angle(){
    if(fireangle > 0)
    {
    fireangle = fireangle -1;
    tanks[1].bullet_angle = tanks[1].bullet_angle - 1;
    }
    document.getElementById("fireangle").innerHTML =fireangle;
}
function increase_angle(){
    if(fireangle < 180)
    {
    fireangle = fireangle + 1;
    tanks[1].bullet_angle = tanks[1].bullet_angle + 1;
    }
    document.getElementById("fireangle").innerHTML =fireangle;
}

function decrease_movement_forward(){
    var count = 20; // The number of points the tank will move forward or backward
    if(movement > 0)
    {
    movement = movement -1;
    while(count != 0)
    {
        console.log("move");
        tanks[1].x = tanks[1].x + 2;
        tanks[1].y = terrain[tanks[1].x];
        draw_tank1();
        count = count - 2;
    }    
    }
    document.getElementById("move").innerHTML =movement;
}
function decrease_movement_backward(){
    var count = 20; // The number of points the tank will move forward or backward
    if(movement > 0)
    {
    movement = movement -1;
    while(count>0)
    {
        tanks[1].x = tanks[1].x - 2;
        tanks[1].y = terrain[tanks[1].x];
        draw_tank1();
        stage.update();
        count = cotunt - 2;
    }
    }
    document.getElementById("move").innerHTML =movement;
}
